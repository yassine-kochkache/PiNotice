const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    role: { type: String, default: 'user' },
    birthDate: {
        type: Date, validate: {
            validator: function (validation) {
                validation.setFullYear(validation.getFullYear() + 16)
                const currentTime = new Date();
                currentTime.setHours(0, 0, 0, 0);
                return validation.getTime() <= currentTime.getTime();
            },
            message: props => 'You must be at least 16 years old.'
        }
    },
    phone: String,
    address: String,
    avatar: String
});

const User = mongoose.model('User', userSchema);
module.exports = User
