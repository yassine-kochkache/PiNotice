const express = require('express');
const router = express.Router();
const User = require('../models/userSchema')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')


// login route

router.post('/login', async (req, res) => {

    try {
        const userDb = await User.findOne({
            email: req.body.email,
        });
        if (userDb) {
            const result = await bcrypt.compare(req.body.password, userDb.password);
            if (result) {
                //create jwt token
                const tokenData = {
                    userId: userDb._id,
                    email: userDb.email,
                    firstName: userDb.firstName,
                    lastName: userDb.lastName,
                };
                const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                res.json({ token: token });
            } else {
                res.status(400).json({ message: "wrong credentials" });
            }
        } else {
            res.status(400).json({ message: "wrong credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }

    // const userDb = await User.findOne({ email: req.body.email.toLowerCase(), password: req.body.password });
    // if (userDb) {
    //     // create jwt token
    //     const tokenData = {
    //         userId: userDb._id,
    //         email: userDb.email,
    //         firstName: userDb.firstName,
    //         lastName: userDb.LastName,
    //         role: userDb.role
    //     }
    //     const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
    //     res.json({ message: "Connected successfully", token: token })
    // } else {
    //     res.status(400).json({ message: "Wrong credentials!" })
    // }

});

// register route

router.post("/register", async (req, res) => {
    const userVerif = await User.findOne({ email: req.body.email.toLowerCase() })
    if (userVerif) {
        res.status(400).json({ message: "Email already used!" });
    } else {
        try {
            const saltRounds = 10;
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            const userData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email.toLowerCase(),
                password: hash,
                birthDate: req.body.birthDate,
                phone: req.body.phone,
                address: req.body.address,
                avatar: req.body.avatar
            };
            const newUser = await User.create(userData)
            res.status(200).json({ message: "User created successfully", user: newUser })
        } catch (err) {
            res.status(400).json({ message: "erreur hasing password!" });
        }
    }

});

module.exports = router;

