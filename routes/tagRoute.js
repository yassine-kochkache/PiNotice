const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController')
const verifyToken = require('../middlewares/authorizationToken')


//  add new tag
router.post('/tags', verifyToken, tagController.addTag)

// update tag
router.put('/tags/:id', verifyToken, tagController.updateTag)

// delete tag 
router.delete('/tags/:id', verifyToken, tagController.deleteTag);

// get all atags
router.get('/tags', verifyToken, tagController.getTags);

// get tag byId 
router.get('/tags/:id', verifyToken, tagController.getTagById)

module.exports = router;
