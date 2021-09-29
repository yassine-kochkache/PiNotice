const User = require("../models/userSchema")
const Event = require("../models/eventSchema")
const Notification = require("../models/notificationScema")

const createNotif = async (type, userId, eventId, text, ownerId) => {
    try {
        const user = await User.findById(userId)
        const event = await Event.findById(eventId).populate({ path: 'owner' })
        let owner
        let notifInfos
        if (event) {
            owner = await User.findById(event.owner._id)
            notifInfos = {
                notifType: type,
                user: user,
                event: event,
                owner: owner,
                text: text
            }
        } else {
            owner = await User.findById(ownerId)
            notifInfos = {
                notifType: type,
                user: user,
                event: eventId,
                owner: owner,
                text: text
            }
        }

        const newNotif = await Notification.create(notifInfos)
    } catch (err) {
        console.log(err);
    }
}

module.exports = createNotif