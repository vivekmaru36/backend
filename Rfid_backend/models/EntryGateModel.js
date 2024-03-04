const mongoose = require('mongoose');

const EntryGateSwipeSchema = new mongoose.Schema({
    rfid: {
        type: String,
        required: true
    },
    geoLocation: {
        type: String,
        required: true
    },
    Ip: {
        type: String,
        required: true
    },
    currentTime: {
        type: Date,
        // default: new Date(),  // current date and time
    },
    foundInCollection: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    Venue:{
        type:String,
        default:'Kc Entry Gate'
    } 
})

module.exports = mongoose.model('EntryGateSchema', EntryGateSwipeSchema);
