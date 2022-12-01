require("dotenv").config()

const config = {
  PORT: process.env.PORT,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
}

module.exports = config