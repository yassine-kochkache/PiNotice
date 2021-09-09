const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const upload = require('../middlewares/uploadProfileImage')

// get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})
// get user by id
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// update user

router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});

// update user's avatar
router.put('/users-avatar/:id', upload.single('avatar'), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { avatar: req.file.path }, { new: true });
        res.status(200).json({ message: "User's avatar updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// delete user 
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});


// affect event manually 
router.put('/users/affectEvent/:idUser/:idEvent', async (req, res) => {
    try {
        const affectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $push: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event affected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})
// desaffect event
router.put('/users/desaffectEvent/:idUser/:idEvent', async (req, res) => {
    try {
        const desaffectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $pull: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event desaffected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// affect admin role
router.put('/users/affectRole/:idUser', async (req, res) => {
    try {
        const affectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "admin" }, { new: true });
        res.json({ message: "Admin role affected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// desaffect admin role
router.put('/users/desaffectRole/:idUser', async (req, res) => {
    try {
        const desaffectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "user" }, { new: true });
        res.json({ message: "Admin role desaffected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router;
