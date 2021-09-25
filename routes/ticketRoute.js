const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController')
const verifyToken = require('../middlewares/authorizationToken')

// get all tickets
router.get('/tickets', verifyToken, ticketController.getAllTickets)

// delete ticket
router.delete('/tickets/:id', verifyToken, ticketController.deleteTicket)


module.exports = router;
