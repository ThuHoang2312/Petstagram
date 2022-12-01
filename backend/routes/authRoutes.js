"use strict"
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const {body} = require ('express-validator')

// Route for registering and TODO: Logging in
router.post("/register", body('username').isLength({min: 2}).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({min: 4}).trim(), authController.register)
  
module.exports = router