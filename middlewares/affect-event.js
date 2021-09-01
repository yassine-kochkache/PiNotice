const User = require("../models/userSchema")

const affectEvent = async (res, userId, eventId) => {
    try {
        const affectedEventToUser = await User.findByIdAndUpdate(userId, { $push: { events: eventId } }, { new: true });
        res.status(200).json({ message: "Event affected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}
module.exports = affectEvent