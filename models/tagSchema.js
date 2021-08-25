const mongoose = require('mongoose');
const { Schema } = mongoose;


const tagSchema = new schema({
    name: String,
    description: String
})

const Event = mongoose.model('Tag', tagSchema)