const express = require('express');
const router = express.Router();

const forgottenPasswordController = require('../controllers/forgotterPasswordController')

// forgot password route
router.post('/forgottenPassword', forgottenPasswordController.forgotPassword)

// rest password route

router.post('/resetPassword/', forgottenPasswordController.resetPassword)



module.exports = router;

