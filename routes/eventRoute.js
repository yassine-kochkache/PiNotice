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
    res.status(200).json({ message: "event updated successfully", updatedEvent });
})

// delete event 
router.delete('/events/:id', async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
});
// affect owner
router.put('/events/affectOwner/:idEevent/:idOwner', async (req, res) => {
    const affectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEevent, { owner: req.params.idOwner }, { new: true });
    res.status(200).json({ message: "Owner affected successfully", affectedOwnertoEvent });
});

// desaffect owner
router.put('/events/desaffectOwner/:idEvent', async (req, res) => {
    const desaffectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEvent, { owner: null }, { new: true });
    res.status(200).json({ message: "Owner desaffected successfully", desaffectedOwnertoEvent });
});

// affect tag
router.put('/events/affectTag/:idEvent/:idTag', async (req, res) => {
    const affectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $push: { tags: req.params.idTag } }, { new: true });
    res.status(200).json({ message: "Tag affected successfully", affectedTagToEvent })
})
// desaffect tag
router.put('/events/desaffectTag/:idEvent/:idTag', async (req, res) => {
    const desaffectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $pull: { tags: req.params.idTag } }, { new: true });
    res.status(200).json({ message: "Tag affected successfully", desaffectedTagToEvent })
})



// get all full events 
router.get('/fullEvents', async (req, res) => {
    const fullEvents = await Event.find({}).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description -_id' });
    res.status(200).json(fullEvents);
});

// get full event by id
router.get('/fullEvent/:id', async (req, res) => {
    const fullEvent = await Event.findById(req.params.id).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description -_id' });
    res.status(200).json(fullEvent);
});

module.exports = router;
