const express = require('express')
const router = express.Router()
const reservationController = require("../controllers/reservationController")

router.post('/reservation/:userId/:eventId', reservationController.reservation)

module.exports = router;
