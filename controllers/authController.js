const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// login function
exports.login = async (req, res) => {
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
                    role: userDb.role,
                };
                const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                res.status(200).json({ token: token });
            } else {
                res.status(400).json({ message: "wrong credentials" });
            }
        } else {
            res.status(400).json({ message: "wrong credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
}

// register function
exports.register = async (req, res) => {
    try {
        const userVerif = await User.findOne({ email: req.body.email.toLowerCase() });
        if (userVerif) {
            res.status(400).json({ message: "Email already used!" });
        } else {
            const saltRounds = 10;
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            const userData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                birthDate: req.body.birthDate,
                phone: req.body.phone,
                address: req.body.address,
                avatar: req.file.filename,
            };
            const newUser = await User.create(userData);
            res
                .status(200)
                .json({ message: "User created successfully", user: newUser });
        }
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        res.status(500).json({ message: "Internal server error!" });
    }
}