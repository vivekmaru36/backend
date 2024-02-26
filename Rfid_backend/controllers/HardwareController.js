const asyncHandler = require("express-async-handler");
const Teacher = require("../models/Teacher");
const Hardware = require("../models/Hardware");

// @desc set lec in hardware
// @route Post /HardwarePost
// @access Private

// const setLec = asyncHandler(async (req, res) => {
//     const { Teacher, Subject, stime, etime, date,rfid } = req.body;

//     // Confirm Data
//     if (!Teacher || !Subject || !stime || !etime || !date || !rfid) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     const HardwareObj = {
//         Teacher,
//         Subject,
//         stime,
//         etime,
//         date,
//         rfid
//     };

//     // Create and Store New Lec
//     const Lecdetails = await Hardware.create(HardwareObj);
//     if (Lecdetails) {
//         res.status(201).json({ message: `New Lec created by ${Teacher} in Hardware Lab` });
//     } else {
//         res.status(400).json({ message: "Invalid data received For Setting Lec Details" });
//     }

// });

const setLec = asyncHandler(async (req, res) => {
    const { Teacher, Subject, stime, etime, date, rfidno , course } = req.body;

    console.log(Teacher);
    console.log(Subject);
    console.log(stime);
    console.log(etime);
    console.log(date);
    console.log(rfidno);
    console.log(course);

    // Confirm Data
    if (!Teacher || !Subject || !stime || !etime || !date || !rfidno ||!course) {
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
    if (Lecdetails) {
        res.status(201).json({ message: `New Lec created by ${Teacher} in Hardware Lab` });
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


module.exports = {
    setLec,
    getLec
  };