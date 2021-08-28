const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');

// get user by id
router.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
})

// update user

router.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
});

// delete user 
router.delete('/users/:id', async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'user deleted successfully' });
});


// affect event
router.put('/users/affectEvent/:idUser/:idEvent', async (req, res) => {
    const affectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $push: { events: req.params.idEvent } }, { new: true });
    res.json(affectedEventToUser)
})
// desaffect event
router.put('/users/desaffectEvent/:idUser/:idEvent', async (req, res) => {
    const desaffectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $pull: { events: req.params.idEvent } }, { new: true });
    res.json(desaffectedEventToUser)
})

// affect admin role
router.put('/users/affectRole/:idUser', async (req, res) => {
    const affectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "admin" }, { new: true });
    res.json({ message: "admin role affected successfully" });
})

// desaffect admin role
router.put('/users/desaffectRole/:idUser', async (req, res) => {
    const desaffectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "user" }, { new: true });
    res.json({ message: "admin role desaffected successfully" });
})

module.exports = router;
