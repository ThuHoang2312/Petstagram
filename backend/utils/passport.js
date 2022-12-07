'use strict'
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcrypt')
const { getUserLogin } = require('../models/userModel')
const config = require('../config/config')

// Log in with the email and password from local storage
passport.use(
  new Strategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      const loginEmail = [email]
      try {
        const [user] = await getUserLogin(loginEmail)
        // if no users were found with the given email return error
        if (user === undefined) {
          return done(null, false, { message: 'Incorrect email.' })
        }
        // Compare passwords, if the passwords match, return true and log in the user
        const passwordOK = await bcrypt.compare(password, user.password)
        if (!passwordOK) {
          return done(null, false, { message: 'Incorrect password.' })
        }
        // use spread syntax to create shallow copy to get rid of binary row type
        return done(null, { ...user }, { message: 'Logged In Successfully' })
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.KEY
    },
    function (jwtPayload, done) {
      console.log('payload:', jwtPayload)
      return done(null, jwtPayload)
    }
  )
)

module.exports = passport
