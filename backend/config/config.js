require("dotenv").config()

const config = {
  PORT: process.env.PORT,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER, 
  PASSWORD: process.env.DB_PASSWORD,
  NAME: process.env.DB_NAME,
  KEY: process.env.JWT_SECRET
}

module.exports = config