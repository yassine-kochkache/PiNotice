const express = require('express');
const router = express.Router();
const Tag = require('../models/tagSchema');

//  add new tag
router.post('/tags', async (req, res) => {

    const tagData = req.body
    if (!("name" in tagData && "description" in tagData)) {
        res.status(400).json({ message: "Empty Field !" })
    } else {
        const foundTag = await Tag.findOne({ name: tagData.name })
        if (foundTag) {
            res.status(400).json({ message: "this tag already exists" })
        } else {
            const newTag = await Tag.create(tagData)
            res.status(200).json({ message: "tag created successfully" })
        }
    }
})

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
