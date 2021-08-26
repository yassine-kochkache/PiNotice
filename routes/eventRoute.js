const express = require('express');
const router = express.Router();
const Event = require('../models/eventSchema');

//  add new event
router.post('/events/', async (req, res) => {

    const eventData = req.body
    if (!("image" in eventData && "title" in eventData && "description" in eventData && "startDateTilme" in eventData && "endDateTime" in eventData && "location" in eventData && "availableTicketNumber" in eventData && "eventType" in eventData)) {
        res.status(400).json({ message: "Empty Field !" })
    } else {
        const newEvent = await Event.create(eventData)
        res.status(200).json({ message: "event created successfully" })
    }
});

// update events
router.put('/events/:id', async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
})

// delete event 
router.delete('/events/:id', async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
});


module.exports = router;
