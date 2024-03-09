// Teacher Updating the hardware room

const mongoose = require("mongoose");

const Hardwareschema = new mongoose.Schema({
    Teacher:{
        type:String,
        required: true,
    },
    Lecdate :{
        type:Date,
        required:true,
    },
    sTime:{
        type:Date,
        required:true,
    },
    eTime:{
        type:Date,
        required:true,
    },
    currentTime:{
        type:Date,
        default: new Date(),  // current date and time
    },
    venue:{
        type:String,
        default:'Hardware Lab',
    },
    course:{
        type:String,
        required:true,
    },
    Subject:{
        type : String
    },
    rfidno: {
        type: String,
        required: true,
    },
    Year: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Hardware", Hardwareschema);