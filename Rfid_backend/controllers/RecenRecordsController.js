const asyncHandler = require("express-async-handler");
const Student = require("./../models/Student");
const Teacher = require("../models/Teacher");
const axios = require('axios');
const HardwareRfidSwipe = require("../models/HardwareRfidSwipe");
const EntryGateModel = require("../models/EntryGateModel");


const RecentRecordsoOnRfid = asyncHandler(async (req, res) => {
    const { rfid } = req.body;
    console.log(rfid);

    // const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 }).lean().exec();
    const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 })
        .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
        .lean()
        .exec();

    // console.log("Document 1 : ", document);

    const document2 = await EntryGateModel.find({ rfid }, { geoLocation: 0, Ip: 0 })
        .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
        .lean()
        .exec();
    
    // console.log("Document 2 : ", document2);

    // Combine both document1 and document2 arrays into a single array
    const document3 = [...document, ...document2]

    // Sort the combined array based on currentTime in descending order
    document3.sort((a, b) => new Date(b.currentTime) - new Date(a.currentTime));

    // console.log("Document 3 : ", document3);

    // if (document) {
    //     // If a document is found, send it as the response
    //     return res.status(200).json({ document });
    // } else {
    //     // If no document is found, send a 404 Not Found response
    //     return res.status(404).json({ message: "No recent records found for the given RFID." });
    // }

    if (document3.length > 0) {
        // If documents are found, send the sorted combined array as the response
        return res.status(200).json({ document: document3 });
    } else {
        // If no documents are found, send a 404 Not Found response
        return res.status(404).json({ message: "No recent records found for the given RFID." });
    }

});

module.exports = {
    RecentRecordsoOnRfid,
};