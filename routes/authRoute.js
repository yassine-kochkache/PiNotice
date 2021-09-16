const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/uploadProfileImage");
const authController = require("../controllers/authController")

// login route

router.post("/login", authController.login);

// register route
router.post("/register", upload.single("avatar"), authController.register);

module.exports = router;
