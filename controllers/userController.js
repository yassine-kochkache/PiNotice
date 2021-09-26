const User = require('../models/userSchema');
const fs = require('fs');
const bcrypt = require('bcrypt')

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get user by id
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({ path: 'events', populate: 'tags', select: '-owner' });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update user's avatar
exports.updateUsersAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const filePath = './uploads/avatars/' + user.avatar
        fs.unlinkSync(filePath);
        const newBody = { avatar: req.file.filename }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, newBody, { new: true });
        res.status(200).json({ message: "User's avatar updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete user
exports.deletUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect event manually
exports.affectEvent = async (req, res) => {
    try {
        const affectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $push: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event affected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect event
exports.desaffectEvent = async (req, res) => {
    try {
        const desaffectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $pull: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event desaffected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect admin role
exports.affectAdminRole = async (req, res) => {
    try {
        const affectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "admin" }, { new: true });
        res.json({ message: "Admin role affected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect admin role
exports.desaffectAdminRole = async (req, res) => {
    try {
        const desaffectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "user" }, { new: true });
        res.json({ message: "Admin role desaffected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// reset password
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const oldPassword = await bcrypt.hash(req.body.oldPassword, 10);
        const compare = await bcrypt.compare(user.password, oldPassword)
        if (compare == true) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 10)
            const newUser = await User.findByIdAndUpdate(req.params.id, { password: newPassword })
            res.status(200).json({ message: "Password reset successfully" })
        } else {
            res.status(400).json({ message: "Invalid password" })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}