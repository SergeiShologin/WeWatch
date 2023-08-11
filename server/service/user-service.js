const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require("./mail-service")
const tokenService = require("../service/token-serivce")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`An account with email address ${email} already exists`)
        } // Проверка нет ли уже такого пользователя
        const hashPassword = await bcrypt.hash(password, 3) // Хеширование пароля
        const activationLink = uuid.v4() // Ссылка для активации

        const user = await UserModel.create({email, password: hashPassword, activationLink}) // Сохранение пользователя в БД
        await mailService.sendActivationMail(email, `${process.env.API_URL}/wewatch/activate/${activationLink}`) // Отправка письма для активации

        const userDto = new UserDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto}) // Генерация токенов

        await tokenService.saveToken(userDto.id, tokens.refreshToken) // Сохранение токен в БД
        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest("Invalid activation link")
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest("User with this email address was not found")
        }
        const isPassEquals = await bcrypt.compare(password, user.password) //расшифровываем пароль и сравниваем с паролем пользователя
        if (!isPassEquals) {
            throw ApiError.BadRequest("Invalid password")
        }
        const userDto = new UserDto(user) // Из модели выбрасываем ненужное
        const tokens = tokenService.generateTokens({...userDto}) // Генерация токнеов

        await tokenService.saveToken(userDto.id, tokens.refreshToken) // Сохранение токен в БД
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user) // Из модели выбрасываем ненужное
        const tokens = tokenService.generateTokens({...userDto}) // Генерация токнеов

        await tokenService.saveToken(userDto.id, tokens.refreshToken) // Сохранение токен в БД
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()