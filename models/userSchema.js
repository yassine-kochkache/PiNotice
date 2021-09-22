const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    role: { type: String, default: 'user' },
    birthDate: {
        type: Date, validate: {
            validator: function (validation) {
                const currentTime = new Date();
                const curretYear = currentTime.getFullYear()
                const currentMonth = currentTime.getMonth()
                const currentDay = currentTime.getDate()
                const ageYear = validation.getFullYear() + 16
                const ageMonth = validation.getMonth()
                const ageDay = validation.getDate()
                if (curretYear >= ageYear && currentMonth >= ageMonth && currentDay >= ageDay) {
                    return true
                } else {
                    return false;
                }
            },
            message: "You must be at least 16 years old"
        }, required: true
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User
