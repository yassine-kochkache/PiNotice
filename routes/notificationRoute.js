const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController')

// get notifications
router.get('/notifications/:userId', notifController.getNotifications)
// set notifications to seen

router.put('/notifications/:userId', notifController.seeNotifications)

module.exports = router;
