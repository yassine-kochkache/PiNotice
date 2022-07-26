const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    role: { type: String, default: 'user' },
    birthDate: {
        type: Date, required: true
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);
module.exports = User
