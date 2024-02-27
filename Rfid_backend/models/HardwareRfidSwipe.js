const mongoose = require('mongoose');


const HardwareRfidSwipeSchema = new mongoose.Schema({
    rfid :{
       type: String,
       required : true
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
    hardwaredetails: {
        type: mongoose.Schema.Types.Mixed  // Add another field for hardwaredetails
    },
    attendance: {
        type: String  // Add field for attendance
    },
    attendance_count:{
        type: Number
    },
    Venue:{
        type:String,
        default:'Hardware Lab'
    } 
})

module.exports = mongoose.model('HardwareRfidSwipe',HardwareRfidSwipeSchema)