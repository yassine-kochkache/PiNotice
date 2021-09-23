const Ticket = require('../models/ticketSchema');
const Event = require('../models/eventSchema');
const User = require('../models/userSchema')
const qr = require('qrcode')
const sendEmail = require("../utils/email/sendTicketEmail")
// const pdf = require("pdf-creator-node");
// const fs = require("fs");
// const html = fs.readFileSync("../utils/email/template/ticketTemplate.html", "utf8");

exports.reservation = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        const user = await User.findById(req.params.userId)
        // checking event available tickets 
        if (event.availableTicketNumber > 0) {

            // creating a ticket
            const ticketData = {
                owner: user._id,
                event: event._id,
                ticketPath: '',
                QRCodeData: '',
                QRCodePath: '',
            }
            const newTicket = await Ticket.create(ticketData);
            // generating a ticket QR Code
            const qrData = {
                eventTitle: event.title,
                userName: user.firstName,
                userEmail: user.email,
            }
            await qr.toFile(`./qrCodes/${newTicket._id}.png`, JSON.stringify(qrData));
            // update new ticket QR code data and path 
            newTicket.QRCodeData = JSON.stringify(qrData);
            newTicket.QRCodePath = `http://localhost:3000/qrCodes/${newTicket._id}.png`;
            await newTicket.save();

            // taking one ticket out of stock
            const ticketPath = 'ticket/' + event.title + '/' + user.firstName + "-" + user.lastName;

            // const modifiedTickets = event.availableTicketNumber - 1
            // const updatedEvent = await Event.findByIdAndUpdate(event._id, { availableTicketNumber: modifiedTickets }, { new: true })

            // const options = {
            //     format: "A4",
            //     orientation: "portrait",
            //     border: "10mm",
            //     header: {
            //         height: "45mm",
            //         contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            //     },
            //     footer: {
            //         height: "28mm",
            //         contents: {
            //             first: 'Cover page',
            //             2: 'Second page',
            //             default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            //             last: 'Last Page'
            //         }
            //     }
            // };
            // const ticket = pdf.create(html, options).then((res) => {
            //     console.log(res);
            // }).catch((err) => {
            //     console.log(err);
            // })
            // const info = await sendEmail(user.email, "Event ticket", { name: user.firstName }, "./template/reservationSuccess.handlebars", ticket);

            res.status(200).json({ message: "Reservation success", ticket: ticketData })
        } else {
            res.status(400).json({ message: "Tickets for this event are out of Stock" })
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}