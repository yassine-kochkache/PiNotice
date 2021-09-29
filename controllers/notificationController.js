const Notification = require('../models/notificationScema');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ owner: req.params.id }).populate({ path: 'user event', select: 'firstName lastName title ' })
        res.status(200).json(notifications)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}