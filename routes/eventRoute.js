const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorizationToken')
const upload = require('../middlewares/uploadEventImage')
const eventController = require('../controllers/eventController')

//  add new event
router.post('/events/:connectedUserId', verifyToken, upload.single('image'), eventController.addEvent);

// update events
router.put('/events/:id', verifyToken, eventController.updateEvent)

// delete event 
router.delete('/events/:eventId/:connectedUserId', verifyToken, eventController.deleteEvent);

// update event's image
router.put('/events/image/:id', verifyToken, upload.single('image'), eventController.updateEventImage)

// affect owner manually
router.put('/events/affectOwner/:idEevent/:idOwner', verifyToken, eventController.affectOwner);

// desaffect owner
router.put('/events/desaffectOwner/:idEvent', verifyToken, eventController.desaffectOwner);

// affect tag
router.put('/events/affectTag/:idEvent/:idTag', verifyToken, eventController.affectTag)
// desaffect tag
router.put('/events/desaffectTag/:idEvent/:idTag', verifyToken, eventController.desaffectTag)

// get all full events 
router.get('/fullEvents', eventController.getAllFullEvents);

// get full event by id
router.get('/fullEvent/:id', eventController.getEvent);

module.exports = router;
