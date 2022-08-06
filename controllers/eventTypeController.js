const EventType = require('../models/eventType');

// add new EventType
exports.addEvenetType = async (req, res) => {
    try {
        const eventData = {
            title: req.body.title.toLowerCase()
        }
        const foundEvenet = await EventType.findOne({ title: eventData.title })
        if (foundEvenet) {
            res.status(400).json({ message: "this event type already exists" })
        } else {
            const newEventType = await EventType.create(eventData)
            res.status(200).json({ message: "Event type created successfully" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update EventType
exports.updateEventType = async (req, res) => {
    try {
        const updateEvent = await EventType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "EventType updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete EventType
exports.deleteEventType = async (req, res) => {
    try {
        const deletedEventType = await EventType.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'EventType deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get all EventTypes
exports.getEventTypes = async (req, res) => {
    try {
        const EventTypes = await EventType.find({});
        res.status(200).json(EventTypes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get EventType by id
exports.getEventTypeById = async (req, res) => {
    try {
        const EventType = await EventType.findById(req.params.id)
        if (EventType) {
            res.status(200).json({ EventType: EventType })
        } else {
            res.status(404).json({ message: "EventType not found" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}