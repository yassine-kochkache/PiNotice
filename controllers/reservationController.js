const Ticket = require('../models/ticketSchema');
const Event = require('../models/eventSchema');
const User = require('../models/userSchema')
const qr = require('qrcode')
const sendEmail = require("../utils/email/sendEmail")
const pdf = require("pdf-creator-node");
const fs = require("fs");
const ejs = require("ejs");
const createNotif = require("../middlewares/notification")

exports.reservation = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).populate({ path: 'owner' })
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
            const startDate = new Date(event.startDateTime);
            const startDateTime = `${String(startDate.getDate()).padStart(2, "0")}/${String(startDate.getMonth() + 1).padStart(2, "0")}/${startDate.getFullYear()}  ${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
            const endDate = new Date(event.endDateTime);
            const endDateTime = `${String(endDate.getDate()).padStart(2, "0")}/${String(endDate.getMonth() + 1).padStart(2, "0")}/${endDate.getFullYear()} ${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
            const reservationTime = new Date(newTicket.createdAt)
            const ReservationDateTime = `${String(reservationTime.getDate()).padStart(2, "0")}/${String(reservationTime.getMonth() + 1).padStart(2, "0")}/${reservationTime.getFullYear()}  ${String(reservationTime.getHours()).padStart(2, "0")}:${String(reservationTime.getMinutes()).padStart(2, "0")}`;

            const qrData = {
                eventTitle: event.title,
                userName: user.firstName,
                userEmail: user.email,
                startDate: startDateTime,
                endDate: endDateTime,
                location: event.location,
                reservationDate: ReservationDateTime,
                price: event.price + '$'
            }
            await qr.toFile(`./qrCodes/${newTicket._id}.png`, JSON.stringify(qrData));
            // update new ticket QR code data and path 
            newTicket.QRCodeData = JSON.stringify(qrData);
            newTicket.QRCodePath = `http://localhost:3000/qrCodes/${newTicket._id}.png`;
            await newTicket.save();

            // taking one ticket out of stock
            const ticketPath = 'ticket/' + event.title + '/' + user.firstName + "-" + user.lastName;
            await Event.findByIdAndUpdate(event._id, { "$inc": { availableTicketNumber: -1 } }, { new: true })
            const html = fs.readFileSync("./utils/email/template/ticketTemplate.html", "utf8");
            const renderOptions = {
                qrcodeLink: `http://localhost:3000/qrCodes/${newTicket._id}.png`,
                eventTitle: event.title,
                userName: user.firstName,
                userLast: user.lastName,
                userEmail: user.email,
                startDate: startDateTime,
                endDate: endDateTime,
                location: event.location,
                reservationDate: ReservationDateTime,
                price: event.price
            }
            const render = ejs.render(html, renderOptions);
            const Document = {
                html: render,
                data: {},
                path: `./tickets/${newTicket._id}.pdf`,
                type: ''
            }
            const pdfOptions = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
            };
            await pdf.create(Document, pdfOptions);

            // send a mail 
            const attachments = [
                { filename: 'ticket.pdf', content: fs.createReadStream(`./tickets/${newTicket._id}.pdf`) }
            ]
            const info = await sendEmail(user.email, "Event ticket", { name: user.firstName }, "./template/reservationSuccess.handlebars", attachments);

            // update the ticketpath 
            newTicket.ticketPath = `http://localhost:3000/tickets/${newTicket._id}.pdf`;
            await newTicket.save();
            // create notification
            createNotif("book", user._id, event._id, 'has booked for your event : ')
            const io = req.app.get('io')
            const usersArray = req.app.get('usersArray')
            const notify = { text: "Somone has booked ofr your event" }
            io.to(usersArray[event.owner._id]).emit('notification', notify);
            // return statement
            res.status(200).json({ message: "Reservation success", ticket: ticketData })
        } else {
            res.status(400).json({ message: "Tickets for this event are out of Stock" })
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}