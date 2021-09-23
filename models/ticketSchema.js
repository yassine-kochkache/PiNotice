const mongoose = require('mongoose');
const { Schema } = mongoose;


const ticketSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    ticketPath: String,
    QRCodePath: String,
    QRCodeData: String,
}, {
    timestamps: true,
    versionKey: false
})

const Ticket = mongoose.model('Ticket', ticketSchema)
module.exports = Ticket