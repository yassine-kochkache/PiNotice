const mongoose = require('mongoose');
const { Schema } = mongoose;


const eventTypeSchema = new Schema({
    title:{type:String, required:true},
}, {
    timestamps: true,
    versionKey: false
})

const EventType = mongoose.model('EvenetType', eventTypeSchema)
module.exports = EventType