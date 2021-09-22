const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController')

//  add new tag
router.post('/tags', tagController.addTag)

// update tag
router.put('/tags/:id', tagController.updateTag)

// delete tag 
router.delete('/tags/:id', tagController.deleteTag);

// get all atags
router.get('/tags', tagController.getTags);

// get tag byId 
router.get('/tags/:id', tagController.getTagById)

module.exports = router;
