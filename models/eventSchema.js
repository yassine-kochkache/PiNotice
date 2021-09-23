const mongoose = require('mongoose');
const { Schema } = mongoose;


const eventSchema = new Schema({
    image: String,
    title: String,
    description: String,
    price: { type: Number, default: 0 },
    startDateTime: Date,
    endDateTime: Date,
    location: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    availableTicketNumber: Number,
    eventType: String,
}, {
    timestamps: true,
    versionKey: false
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event