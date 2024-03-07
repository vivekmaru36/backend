const asyncHandler = require("express-async-handler");
const axios = require('axios');

const HardwareRfidSwipe = require("../models/HardwareRfidSwipe")
const HardwareHistory = require("../models/HardwareHistory");
const Student = require("../models/Student");

const TotalLec = asyncHandler(async (req, res) => {
    const { rfid } = req.body;
    // console.log(rfid);

    const TotalLecs = await HardwareHistory.find({ rfidno: rfid })
        .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
        .lean()
        .exec();

    console.log("Document for total lecs : ", TotalLecs);

    if (TotalLecs) {
        // If a document is found, send it as the response
        return res.status(200).json({ TotalLecs });
    } else {
        // If no document is found, send a 404 Not Found response
        return res.status(404).json({ message: "No recent Lectures records found for the given RFID." });
    }


});

const ids = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    console.log(ids);

    const TotalLecsdetails = await HardwareRfidSwipe.find({ "hardwaredetails._id": { $in: ids } })
        .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
        .lean()
        .exec();

    console.log("Document for total lecs here : ", TotalLecsdetails);


    if (TotalLecsdetails) {
        // If a document is found, send it as the response
        return res.status(200).json({ TotalLecsdetails });
    } else {
        // If no document is found, send a 404 Not Found response
        return res.status(404).json({ message: "No recent Lectures records found for the given RFID." });
    }

});

const StudentInYourCourse = asyncHandler(async (req, res) => {
    const { rfid,course } = req.body;
    console.log(rfid);
    console.log(course);

    const studentsFirstYear = await Student.find({ course: course, Year: '1st' })
        .select('-password -otp -isVerified')
        .lean()
        .exec();

    console.log("Document for first year students: ", studentsFirstYear);

    const studentsSecondYear = await Student.find({ course: course, Year: '2nd' })
        .select('-password -otp -isVerified')
        .lean()
        .exec();

    console.log("Document for second year students: ", studentsSecondYear);

    const studentsThirdYear = await Student.find({ course: course, Year: '3rd' })
        .select('-password -otp -isVerified')
        .lean()
        .exec();

    console.log("Document for third year students: ", studentsThirdYear);

    // console.log("Document for total students : ", Totalstudents);
    return res.status(200).json({
        studentsFirstYear,
        studentsSecondYear,
        studentsThirdYear
    });
});

module.exports = {
    TotalLec,
    ids,
    StudentInYourCourse
};