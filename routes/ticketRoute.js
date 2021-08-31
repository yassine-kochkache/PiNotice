const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketSchema');

// get all tickets
router.get('/tickets', async (req, res) => {
    const tickets = Ticket.find({});
    res.status(200).json({ allTickets: tickets })
})
// delete ticket
router.delete('/tickets/:id', async (req, res) => {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
})


module.exports = router;
