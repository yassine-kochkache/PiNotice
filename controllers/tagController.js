const Tag = require('../models/tagSchema');

// add new tag
exports.addTag = async (req, res) => {
    try {
        const tagData = {
            name: req.body.name.toLowerCase(),
            description: req.body.name.toLowerCase()
        }
        if (!("name" in req.body && "description" in req.body)) {
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
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update tag
exports.updateTag = async (req, res) => {
    try {
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Tag updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete tag
exports.deleteTag = async (req, res) => {
    try {
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get all tags
exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.status(200).json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get tag by id
exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id)
        if (tag) {
            res.status(200).json({ tag: tag })
        } else {
            res.status(404).json({ message: "Tag not found" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}