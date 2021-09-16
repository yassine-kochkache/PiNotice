const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadProfileImage')
const userController = require('../controllers/userController')

// get all users
router.get('/users', userController.getAllUsers)

// get user by id
router.get('/users/:id', userController.getUser)

// update user

router.put('/users/:id', userController.updateUser);

// update user's avatar
router.put('/users-avatar/:id', upload.single('avatar'), userController.updateUsersAvatar)

// delete user 
router.delete('/users/:id', userController.deletUser);


// affect event manually 
router.put('/users/affectEvent/:idUser/:idEvent', userController.affectEvent)

// desaffect event
router.put('/users/desaffectEvent/:idUser/:idEvent', userController.desaffectEvent)

// affect admin role
router.put('/users/affectRole/:idUser', userController.affectAdminRole)

// desaffect admin role
router.put('/users/desaffectRole/:idUser', userController.desaffectAdminRole)

module.exports = router;
