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

// update tag
router.put('/tags/:id', async (req, res) => {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTag);
})

// delete tag 
router.delete('/tags/:id', async (req, res) => {
    const deletedTag = await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag deleted successfully' });
});


module.exports = router;
