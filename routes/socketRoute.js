const express = require("express");
const router = express.Router();
const socketController = require('../controllers/socketController')

router.post('/send-notification/:id', socketController.sendNotification);

module.exports = router