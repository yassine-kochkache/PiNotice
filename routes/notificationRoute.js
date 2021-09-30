const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController')

// get notifications
router.get('/notifications/:userId', notifController.getNotifications)

module.exports = router;
