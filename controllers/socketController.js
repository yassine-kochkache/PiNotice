

exports.sendNotification = (req, res) => {
    const notify = req.body;
    const io = req.app.get('io')
    io.emit('notification', notify);
    res.status(200).json({ message: notify });
}

