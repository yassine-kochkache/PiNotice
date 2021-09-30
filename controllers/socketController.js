

exports.sendNotification = (req, res) => {
    const notify = req.body;
    const io = req.app.get('io')
    const usersArray = req.app.get('usersArray')
    io.to(usersArray[req.params.id]).emit('notification', notify);
    res.status(200).json({ message: notify });
}

