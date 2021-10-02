const User = require("../models/userSchema")

const desaffectEvent = async (res, userId, eventId) => {
    try {
        const desaffectedEventToUser = await User.findByIdAndUpdate(userId, { $pull: { events: eventId } }, { new: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}
module.exports = desaffectEvent