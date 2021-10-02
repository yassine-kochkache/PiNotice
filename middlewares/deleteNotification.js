const Notification = require('../models/notificationScema')
const deleteNotification = async (eventId) => {
    try {
        const notifications = await Notification.remove({ event: eventId })

    } catch (err) {
        console.log(err);
    }
}
module.exports = deleteNotification