const Event = require('../models/eventSchema');
const desaffectEvent = require('../middlewares/desaffect-event')
const affectEvent = require('../middlewares/affect-event')
const jwt = require("jsonwebtoken");
const fs = require('fs');


// add event
exports.addEvent = async (req, res) => {
    try {
        const eventData = {
            image: req.file.filename,
            title: req.body.title,
            description: req.body.description,
            owner: req.params.connectedUserId,
            eventType: req.body.eventType
        }
            const newEvent = await Event.create(eventData)
            // event affectation automatically
            affectEvent(res, req.params.connectedUserId, newEvent._id)
            res.status(200).json({ message: "event created successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}

// update event
exports.updateEvent = async (req, res) => {
    try {
        const eventData = {
            image: req.file.filename,
            title: req.body.title,
            description: req.body.description,
            owner: req.params.connectedUserId,
            eventType: req.body.eventType
        }
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
            res.status(200).json({ message: "event updated successfully", updatedEvent });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete event
exports.deleteEvent = async (req, res) => {
    try {
        const eventToDelete = await Event.findById(req.params.eventId).populate({ path: 'owner' });
        const token = req.headers.authorization.split(" ").pop();
        const decodedToken = await jwt.decode(token);
        // if (decodedToken.role === "admin" && eventToDelete.owner._id !== decodedToken.userId) {
        //     createNotif("delete", decodedToken.userId, eventToDelete._id, 'your event has been deleted by and admin : \n' + eventToDelete.title, eventToDelete.owner._id)
        //     const io = req.app.get('io')
        //     const usersArray = req.app.get('usersArray')
        //     const notify = { text: "An Admin has deleted one of your events" }
        //     io.to(usersArray[eventToDelete.owner._id]).emit('notification', notify);
        // }
        // const deletedNotification = deleteNotification(req.params.eventId)
        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
        const filePath = './uploads/event-pics/' + deletedEvent.image
        fs.unlinkSync(filePath);
        desaffectEvent(res, req.params.connectedUserId, req.params.eventId)
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update event image
exports.updateEventImage = async (req, res) => {
    try {
        const eventData = {
            image: req.file.filename
        }
        if (!("image" in eventData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
            const filePath = './uploads/event-pics/' + updatedEvent.image
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "event pictutre updated successfully", updatedEvent });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}

// affect owner manually
exports.affectOwner = async (req, res) => {
    try {
        const affectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEevent, { owner: req.params.idOwner }, { new: true });
        res.status(200).json({ message: "Owner affected successfully", affectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect owner
exports.desaffectOwner = async (req, res) => {
    try {
        const desaffectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEvent, { owner: null }, { new: true });
        res.status(200).json({ message: "Owner desaffected successfully", desaffectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect tag
exports.affectTag = async (req, res) => {
    try {
        const affectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $push: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", affectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect tag
exports.desaffectTag = async (req, res) => {
    try {
        const desaffectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $pull: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", desaffectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get all full events
exports.getAllFullEvents = async (req, res) => {
    try {
        const fullEvents = await Event.find({})
        .populate({ path: 'owner', select: '-password -events -createdAt -updatedAt' });
        res.status(200).json(fullEvents);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get event by id 
exports.getEvent = async (req, res) => {
    try {
        const fullEvent = await Event.findById(req.params.id).populate({ path: 'owner', select: '-password -events -createdAt -updatedAt' });
        res.status(200).json(fullEvent);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}