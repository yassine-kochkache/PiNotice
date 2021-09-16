const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorizationToken')
const upload = require('../middlewares/uploadEventImage')
const eventController = require('../controllers/eventController')

//  add new event
router.post('/events/:connectedUserId', verifyToken, upload.single('image'), eventController.addEvent);

// update events
router.put('/events/:id', eventController.updateEvent)

// delete event 
router.delete('/events/:eventId/:connectedUserId', eventController.deleteEvent);
// affect owner manually
router.put('/events/affectOwner/:idEevent/:idOwner', eventController.affectOwner);

// desaffect owner
router.put('/events/desaffectOwner/:idEvent', eventController.desaffectOwner);

// affect tag
router.put('/events/affectTag/:idEvent/:idTag', eventController.affectTag)
// desaffect tag
router.put('/events/desaffectTag/:idEvent/:idTag', eventController.desaffectTag)

// get all full events 
router.get('/fullEvents', eventController.getAllFullEvents);

// get full event by id
router.get('/fullEvent/:id', eventController.getEvent);

module.exports = router;
