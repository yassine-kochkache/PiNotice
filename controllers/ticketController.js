const Ticket = require('../models/ticketSchema');
const fs = require('fs');

// get all tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({}).populate({ path: 'event owner', select: 'firstName LastName email phone title startDateTime endDateTime description location' });
        res.status(200).json({ allTickets: tickets })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete ticket
exports.deleteTicket = async (req, res) => {
    try {
        const filePath = './tickets/' + req.params.id + '.pdf'
        const qrCode = './qrCodes/' + req.params.id + '.png'
        fs.unlinkSync(filePath);
        fs.unlinkSync(qrCode);
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}