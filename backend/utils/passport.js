"use strict"
const passport = require("passport")
const Strategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')
const { getUserLogin } = require("../models/userModel")

// Log in with the email and password from local storage
passport.use(
  new Strategy(async (email, password, done) => {
    const loginEmail = [email]
    //console.log("passport loginEmail:", loginEmail)
    try {
      const [user] = await getUserLogin(loginEmail)
      //console.log("Local strategy", user) // result is binary row
      // if no users were found with the given email return error
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." })
      }
      // Compare passwords, if the passwords match, return true and log in the user
      const passwordOK = await bcrypt.compare(password, user.password)
      if (!passwordOK) {
        return done(null, false, { message: "Incorrect password." })
      }
      // use spread syntax to create shallow copy to get rid of binary row type
      return done(null, { ...user }, { message: "Logged In Successfully" })
    } catch (err) {
      return done(err)
    }
  })
)

module.exports = passport