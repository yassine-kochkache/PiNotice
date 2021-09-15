const User = require("../models/userSchema")

const affectEvent = async (res, userId, eventId) => {
    try {
        const affectedEventToUser = await User.findByIdAndUpdate(userId, { $push: { events: eventId } }, { new: true });
    } catch (err) {
        console.log(err);
    }
}
module.exports = affectEvent