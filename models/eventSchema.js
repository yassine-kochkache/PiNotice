const mongoose = require('mongoose');
const { Schema } = mongoose;


const eventSchema = new schema({
    image: String,
    title: String,
    description: String,
    price: { type: Number, default: 0 },
    startDateTilme: Date,
    endDateTime: Date,
    location: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ tyoe: Schema.Types.ObjectId, ref: 'Tag' }],
    availableTicketNumber: Number,
    eventType: String,
})

const Event = mongoose.model('Event', eventSchema)