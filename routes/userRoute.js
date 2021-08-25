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

module.exports = router;
