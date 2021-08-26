const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    role: { type: String, default: 'user' },
    birthDate: { type: Date, default: new Date },
    phone: String,
    address: String,
    avatar: String
});

const User = mongoose.model('Users', userSchema);
module.exports = User
