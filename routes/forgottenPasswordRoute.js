const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Token = require('../models/tokenSchema')
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const sendEmail = require("../utils/email/sendEmail")

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
                const newToken = await Token.create(tokenData)

                const clientURL = 'localhost:3000'
                const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

                try {
                    const info = sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");

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

router.post('/resetPassword/', async (req, res) => {
    const saltRounds = 10;
    let passwordResetToken = await Token.findOne({ userId: req.body.userId });
    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    await User.updateOne(
        { _id: req.body.userId },
        { $set: { password: hash } },
        { new: true }
    );
    const user = await User.findById({ _id: req.body.userId });
    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.name,
        },
        "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    res.status(200).json({ message: "Password Reset Successfully" })
})



module.exports = router;

