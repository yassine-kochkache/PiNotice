const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController')
const verifyToken = require('../middlewares/authorizationToken')


//  add new eventType
router.post('/eventType', verifyToken, eventTypeController.addEvenetType)

// update eventType
router.put('/eventType/:id', verifyToken, eventTypeController.updateEventType)

// delete eventType 
router.delete('/eventType/:id', verifyToken, eventTypeController.deleteEventType);

// get all aeventType
router.get('/eventType', verifyToken, eventTypeController.getEventTypes);

// get eventType byId 
router.get('/eventType/:id', verifyToken, eventTypeController.getEventTypeById)

module.exports = router;
