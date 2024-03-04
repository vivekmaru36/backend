const asyncHandler = require("express-async-handler");
const Teacher = require("../models/Teacher");
const Hardware = require("../models/Hardware");
const HardwaresHistorySchema = require("../models/HardwareHistory")

const { sendLecSetMail } = require("./services/emailService");

const setLec = asyncHandler(async (req, res) => {
    const { Teacher, Subject, stime, etime, date, rfidno, course,email } = req.body;

    // console.log(Teacher);
    // console.log(Subject);
    // console.log(stime);
    // console.log(etime);
    // console.log(date);
    // console.log(rfidno);
    // console.log(course);

    // Confirm Data
    if (!Teacher || !Subject || !stime || !etime || !date || !rfidno || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Convert string dates to Date objects
    const Lecdate = new Date(date);
    const sTime = new Date(stime);
    const eTime = new Date(etime);

    const HardwareObj = {
        Teacher,
        Subject,
        Lecdate, // Use converted Date object
        sTime, // Use converted Date object
        eTime, // Use converted Date object
        rfidno,
        course
    };

    const existingDocument = await Hardware.findOne();

    if (existingDocument) {
        // Document already exists, send an error response
        return res.status(400).json({ success: false, message: 'A document already exists. Only one document is allowed.' });
    }

    // Create and Store New Lec
    const Lecdetails = await Hardware.create(HardwareObj);

    // Store _id of Lecdetails
    const lecId = Lecdetails._id;

    // history
    // const HardwaresHistory = await HardwaresHistorySchema.create(HardwareObj);
    const HardwaresHistory = await HardwaresHistorySchema.create({ ...HardwareObj, _id: lecId._id });


    if (Lecdetails) {
        res.status(201).json({ message: `New Lec created by ${Teacher} in Hardware Lab` });
        const emailsend = await sendLecSetMail({ lecdetails:HardwareObj, to:email });

    } else {
        res.status(400).json({ message: "Invalid data received For Setting Lec Details" });
    }
});


const getLec = asyncHandler(async (req, res) => {
    try {
        // Check if a document already exists
        const hardwaredetails = await Hardware.findOne();

        if (!hardwaredetails) {
            // NO Document exists, send an error response
            return res.status(404).json({ success: false, message: 'No hardware details available.' });
        }

        // Document found, send the details in the response
        res.status(200).json({ success: true, hardwaredetails });
    } catch (error) {
        console.error('Error Fetching lec1 details:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


const forceDeLec = asyncHandler(async (req, res) => {
    const { rfid } = req.body;
    try {
        // Check if the user is a teacher and present in hardware
        const isTeacher = await Hardware.findOne({ rfidno: rfid });
        // console.log(rfid);
        // console.log(isTeacher);

        if (isTeacher) {
            // If the user is a teacher, delete all data from the hardware collection
            await Hardware.deleteMany({ rfidno: rfid });

            return res.status(200).json({ success: true, message: 'Hardware data deleted successfully.' });
        } else {
            return res.status(403).json({ success: false, message: 'Access forbidden. Only teachers can delete hardware data.' });
        }
    } catch (error) {
        console.error('Error deleting hardware data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

const AutoDel = asyncHandler(async (req, res) => {
    const { etime } = req.body;
    try {
        // Check if the user is a teacher and present in hardware
        const result = await Hardware.deleteMany({});
        console.log(etime);
        return res.status(200).json({ success: true, message: `All Hardware data deleted successfully.` });
        
        
    } catch (error) {
        console.error('Error deleting hardware data Automatically : ', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = {
    setLec,
    getLec,
    forceDeLec,
    AutoDel
};