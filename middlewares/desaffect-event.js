const User = require("../models/userSchema")

const desaffectEvent = async (res, userId, eventId) => {
    try {
        const desaffectedEventToUser = await User.findByIdAndUpdate(userId, { $pull: { events: eventId } }, { new: true });
        res.status(200).json({ message: "Event desaffected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}
module.exports = desaffectEvent