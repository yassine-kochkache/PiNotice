const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketSchema');

// get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = Ticket.find({});
        res.status(200).json({ allTickets: tickets })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})
// delete ticket
router.delete('/tickets/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})


module.exports = router;
