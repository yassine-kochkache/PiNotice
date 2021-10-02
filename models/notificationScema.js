const mongoose = require('mongoose');
const { Schema } = mongoose;


const notificationSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    text: String,
    notifType: String,
    seen: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification