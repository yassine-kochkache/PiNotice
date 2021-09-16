const Ticket = require('../models/ticketSchema');
const Event = require('../models/eventSchema');
const User = require('../models/userSchema')
const qr = require('qrcode')

exports.reservation = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        const user = await User.findById(req.params.userId)
        // checking event available tickets 
        if (event.availableTicketNumber > 0) {

            // checking event type
            let proceedreservation = false
            let paymentVerif = false
            if (event.eventType == "free") {
                proceedreservation = true
            } else {
                // process payment


            }
            if (proceedreservation) {
                // generating a ticket QR Code
                const ticketPath = 'ticket/' + event.title + '/' + user.firstName + "-" + user.lastName;
                const qrData =
                    "eventTitle : " + event.title +
                    ", userName : " + user.firstName +
                    ", userEmail : " + user.email;
                // creating a ticket
                const ticketData = {
                    owner: user._id,
                    event: event._id,
                    ticketPath: ticketPath,
                    QRCodeData: qrData,
                    QRCodePath: await qr.toDataURL(qrData),
                }
                const newTicket = await Ticket.create(ticketData)

                // taking one ticket out of stock
                const modifiedTickets = event.availableTicketNumber - 1
                const updatedEvent = await Event.findByIdAndUpdate(event._id, { availableTicketNumber: modifiedTickets }, { new: true })
                res.status(200).json({ message: "Reservation success", ticket: ticketData })
            } else {
                // not available tickets 
                res.status(400).json({ message: "Please verify your payment info" })
            }



        } else {
            res.status(400).json({ message: "Tickets for this event are out of Stock" })
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}