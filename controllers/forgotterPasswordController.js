const User = require('../models/userSchema');
const Token = require('../models/tokenSchema')
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email/sendEmail")

// forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!user) {
            res.status(400).json({ message: "This email address does not match any user" })
        } else {
            const existToken = await Token.findOne({ userId: user._id });
            if (existToken) {
                await Token.findByIdAndDelete(existToken._id)
            }
            // creating new token
            const resetToken = crypto.randomBytes(32).toString("hex");
            const tokenData = {
                userId: user._id,
                token: resetToken,
                createdAt: Date.now(),
            };
            const newToken = await Token.create(tokenData)

            const clientURL = process.env.CLIENT_URL
            const link = `${clientURL}/#/reset-password/${resetToken}`;

            const info = sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");
            res.json({ message: "email sent successfully" });

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }
}

//reset password

exports.resetPassword = async (req, res) => {
    try {
        const passwordResetToken = await Token.findOne({ token: req.body.token });
        if (!passwordResetToken) {
            res.status(400).json({ message: "Invalid or expired password reset token" })
        } else {
            const hash = await bcrypt.hash(req.body.password, 10);
            const usertoUpdate = await User.findByIdAndUpdate(passwordResetToken.userId, { password: hash }, { new: true })
            const info = sendEmail(
                usertoUpdate.email,
                "Password Reset Successfully",
                {
                    name: usertoUpdate.firstName,
                },
                "./template/resetPassword.handlebars"
            );
            await Token.findByIdAndDelete(passwordResetToken._id);
            res.status(200).json({ message: "Password Reset Successfully" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }
}