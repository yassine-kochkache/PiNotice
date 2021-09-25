const express = require('express')
const router = express.Router()
const reservationController = require("../controllers/reservationController")
const verifyToken = require('../middlewares/authorizationToken')


router.post('/reservation/:userId/:eventId', verifyToken, reservationController.reservation)

module.exports = router;
