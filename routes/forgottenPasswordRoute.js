const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Token = require('../models/tokenSchema')
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

// forgot password route
router.post('/forgottenPassword', async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
        res.status(400).json({ message: "This email address does not match any user" })
    } else {
        const existToken = await Token.findOne({ userId: user._id });
        if (existToken) {
            await Token.deleteOne()
        } else {
            try {
                // creating token
                const saltRounds = 10;
                const resetToken = crypto.randomBytes(32).toString("hex");
                const hash = await bcrypt.hash(resetToken, saltRounds);
                const tokenData = {
                    userId: user._id,
                    token: hash,
                    createdAt: Date.now(),
                };
                const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_RESET_EXPIRES_IN,
                });
                // sending email


                // step 1 : create transporter
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL,
                        pass: process.env.PASSWORD
                    },

                });

                // step 2 : mail options
                const options = {
                    from: process.env.MAIL,
                    to: user.email,
                    subject: "Reset Password Token",
                    text: 'Hello ' + user.firstName + '\n Here is your reset password Token : \n \n' + token
                };

                // step 3: sending e-mail

                try {
                    const info = await transporter.sendMail(options);
                    res.json({ message: "email sent successfully" });
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "email not sent" });
                }



            } catch (err) {
                console.log(err);
                res.status(500).json({ message: 'internal server error' });
            }
        };

    }
})

// rest password route






module.exports = router;

