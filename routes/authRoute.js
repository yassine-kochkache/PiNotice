const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/userSchema')

// login route

router.post('/login', async (req, res) => {

    const userDb = await User.findOne({ email: req.body.email, password: req.body.password });
    if (userDb) {
        // create jwt token
        const tokenData = {
            userId: userDb._id,
            email: userDb.email,
            firstName: userDb.firstName,
            lastName: userDb.LastName
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ message: "Connected successfully", token: token })
    } else {
        res.status(400).json({ message: "Wrong credentials!" })
    }

});

// register route

router.post("/register", async (req, res) => {
    const userData = req.body
    if (!("firstName" in userData && "lastName" in userData && "email" in userData && "password" in userData && "birthDate" in userData && "phone" in userData && "address" in userData)) {
        res.status(400).json({ message: "Please fill your registration form" })
    } else {
        const foundUser = await User.findOne({ email: userData.email })
        if (foundUser) {
            res.status(400).json({ message: "Email already exists" })
        } else {
            const newUser = await User.create(userData)
            res.status(200).json({ message: "Registred successfully" })
        }
    }
});

module.exports = router;

