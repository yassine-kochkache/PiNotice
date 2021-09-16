const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController')

// get all tickets
router.get('/tickets', ticketController.getAllTickets)

// delete ticket
router.delete('/tickets/:id', ticketController.deleteTicket)


module.exports = router;
