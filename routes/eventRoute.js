const express = require('express');
const router = express.Router();
const Event = require('../models/eventSchema');
const upload = require('../middlewares/uploadEventImage')
const affectEvent = require('../middlewares/affect-event')
const Tag = require('../models/tagSchema')

//  add new event
router.post('/events/:connectedUserId', upload.single('image'), async (req, res) => {
    try {
        const tagNamesList = JSON.parse(req.body.tags)
        let tagIdList = [];
        for (let i = 0; i < tagNamesList.length; i++) {
            const element = tagNamesList[i];
            let tag = await Tag.find({ name: element })
            let tagId = tag[0]._id;
            tagIdList.push(tagId)
        }
        let myEventType
        if (req.body.eventType == '0') {
            myEventType = "Free"
        } else {
            myEventType = "Payable"
        }
        const eventData = {
            image: req.file.filename,
            title: req.body.title,
            description: req.body.description,
            price: parseInt(req.body.price) || undefined,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            location: req.body.location,
            owner: req.params.connectedUserId,
            availableTicketNumber: parseInt(req.body.availableTicketNumber),
            eventType: myEventType,
            tags: tagIdList
        }
        if (!("image" in eventData && "title" in eventData && "description" in eventData && "startDateTime" in eventData && "endDateTime" in eventData && "location" in eventData && "availableTicketNumber" in eventData && "eventType" in eventData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {
            const newEvent = await Event.create(eventData)
            // event affectation automatically
            affectEvent(res, req.params.connectedUserId, newEvent._id)
            res.status(200).json({ message: "event created successfully" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
});

// update events
router.put('/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "event updated successfully", updatedEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// delete event 
router.delete('/events/:eventId/:connectedUserId', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
        // desaffect event from owner automatically
        affectEvent(res, req.params.connectedUserId, req.params.eventId)
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});
// affect owner manually
router.put('/events/affectOwner/:idEevent/:idOwner', async (req, res) => {
    try {
        const affectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEevent, { owner: req.params.idOwner }, { new: true });
        res.status(200).json({ message: "Owner affected successfully", affectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});

// desaffect owner
router.put('/events/desaffectOwner/:idEvent', async (req, res) => {
    try {
        const desaffectedOwnertoEvent = await Event.findByIdAndUpdate(req.params.idEvent, { owner: null }, { new: true });
        res.status(200).json({ message: "Owner desaffected successfully", desaffectedOwnertoEvent });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});

// affect tag
router.put('/events/affectTag/:idEvent/:idTag', async (req, res) => {
    try {
        const affectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $push: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", affectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})
// desaffect tag
router.put('/events/desaffectTag/:idEvent/:idTag', async (req, res) => {
    try {
        const desaffectedTagToEvent = await Event.findByIdAndUpdate(req.params.idEvent, { $pull: { tags: req.params.idTag } }, { new: true });
        res.status(200).json({ message: "Tag affected successfully", desaffectedTagToEvent })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})



// get all full events 
router.get('/fullEvents', async (req, res) => {
    try {
        const fullEvents = await Event.find({}).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description -_id' });
        res.status(200).json(fullEvents);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});

// get full event by id
router.get('/fullEvent/:id', async (req, res) => {
    try {
        const fullEvent = await Event.findById(req.params.id).populate({ path: 'owner tags', select: 'firstName lastName email address avatar name description -_id' });
        res.status(200).json(fullEvent);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});

module.exports = router;
