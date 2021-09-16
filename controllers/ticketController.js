const Ticket = require('../models/ticketSchema');

// get all tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = Ticket.find({});
        res.status(200).json({ allTickets: tickets })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete ticket
exports.deleteTicket = async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}