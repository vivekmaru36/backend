const asyncHandler = require("express-async-handler");
const Student = require("./../models/Student");
const Teacher = require("../models/Teacher");
const axios = require('axios');
const HardwareRfidSwipe = require("../models/HardwareRfidSwipe")


const RecentRecordsoOnRfid = asyncHandler(async (req, res) => {
    const { rfid } = req.body;
    console.log(rfid);

    // const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 }).lean().exec();
    const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 })
        .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
        .lean()
        .exec();

    console.log("Document : ", document);

    if (document) {
        // If a document is found, send it as the response
        return res.status(200).json({ document });
    } else {
        // If no document is found, send a 404 Not Found response
        return res.status(404).json({ message: "No recent records found for the given RFID." });
    }

});

module.exports = {
    RecentRecordsoOnRfid,
};