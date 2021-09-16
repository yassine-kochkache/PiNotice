const User = require('../models/userSchema');
const Token = require('../models/tokenSchema')
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email/sendEmail")

// forgot password
exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
        res.status(400).json({ message: "This email address does not match any user" })
    } else {
        const existToken = await Token.findOne({ userId: user._id });
        if (existToken) {
            await Token.findByIdAndDelete(existToken._id)
        }
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


    }
}

//reset password

exports.resetPassword = async (req, res) => {
    const saltRounds = 10;
    let passwordResetToken = await Token.findOne({ userId: req.body.userId });
    if (!passwordResetToken) {
        res.status(400).json({ message: "Invalid or expired password reset token" })
    } else {
        const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
        if (!isValid) {
            res.status(400).json({ message: "Invalid or expired password reset token" })
        } else {
            try {
                const hash = await bcrypt.hash(req.body.password, saltRounds);
                const usertoUpdate = await User.findByIdAndUpdate(req.body.userId, { password: hash }, { new: true })
                sendEmail(
                    usertoUpdate.email,
                    "Password Reset Successfully",
                    {
                        name: usertoUpdate.firstName,
                    },
                    "./template/resetPassword.handlebars"
                );
                await Token.findByIdAndDelete(passwordResetToken._id);
                res.status(200).json({ message: "Password Reset Successfully" })
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: 'internal server error' });
            }
        }
    }
}