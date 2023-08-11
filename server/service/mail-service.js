const nodemailer = require("nodemailer")

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Welcome to WeWatch`,
            text: "",
            html:`            
            <div>
                <h1>WeWatch account confirmation</h1>
                <div>Hi, there!</div>
                <br/>
                <div>Thank you for signing up with WeWatch. You're one step closer to completing the setup. For security purposes, please click the link below to confirm your account.</div>
                <a href="${link}">${link}</a>
            </div>`
        })
    }
}

module.exports = new MailService()