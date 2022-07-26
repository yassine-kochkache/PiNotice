const mongoose = require('mongoose');
const { Schema } = mongoose;


const eventSchema = new Schema({
    image: String,
    title: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    eventType: {type:Schema.Types.ObjectId, ref : "EventType"},
}, {
    timestamps: true,
    versionKey: false
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event