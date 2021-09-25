const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/authorizationToken')
const updateAvatar = require('../middlewares/updateProfileAvatar')


// get all users
router.get('/users', verifyToken, userController.getAllUsers)

// get user by id
router.get('/users/:id', userController.getUser)

// update user

router.put('/users/:id', verifyToken, userController.updateUser);

// update user's avatar
router.put('/users-avatar/:id', verifyToken, updateAvatar.single('avatar'), userController.updateUsersAvatar)

// delete user 
router.delete('/users/:id', verifyToken, userController.deletUser);


// affect event manually 
router.put('/users/affectEvent/:idUser/:idEvent', verifyToken, userController.affectEvent)

// desaffect event
router.put('/users/desaffectEvent/:idUser/:idEvent', verifyToken, userController.desaffectEvent)

// affect admin role
router.put('/users/affectRole/:idUser', verifyToken, userController.affectAdminRole)

// desaffect admin role
router.put('/users/desaffectRole/:idUser', verifyToken, userController.desaffectAdminRole)

module.exports = router;
