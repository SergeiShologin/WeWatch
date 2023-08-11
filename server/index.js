require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./routes/index")
const errorMiddleware = require("./middlewares/error-middleware")

const PORT = process.env.PORT || 5000
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/wewatch", router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()