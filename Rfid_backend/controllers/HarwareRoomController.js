const asyncHandler = require("express-async-handler");


const Student = require("./../models/Student");
const Teacher = require("../models/Teacher");
const axios = require('axios');


const HardwareRfidSwipe = require("../models/HardwareRfidSwipe")

const HardwareRFid = asyncHandler(async (req, res) => {
    const { rfid, geoLocation, Ip, ucurrentTime } = req.body;
    console.log(rfid)
    console.log(geoLocation)
    console.log(Ip)
    console.log(ucurrentTime);
    const currentTttime = new Date();
    console.log("Apna : ",currentTttime);

    // Call the / endpoint to get hardware details
    let hardwaredetails;
    try {
        const response = await axios.get('http://localhost:3500/Hardware');
        if (response.status === 200) {
            hardwaredetails = response.data.hardwaredetails;
            // console.log('Hardware details:', hardwaredetails);
        } else {
            console.log('Failed to fetch hardware details:', response.statusText);
        }
    } catch (error) {
        console.log('Error fetching hardware details:', error.message);
        // Handle the case where hardwaredetails are not fetched
        hardwaredetails = null; // Set hardwaredetails to null to indicate it's not available
    }

    // console.log(hardwaredetails._id);
    console.log(hardwaredetails);

    const student = await Student.findOne({ rfid }).lean().exec();
    const teacher = await Teacher.findOne({ rfid }).lean().exec();
    // console.log(student);
    // console.log(teacher);

    if (!hardwaredetails) {
        console.log("No hardware details")
        if (student) {
            console.log("student and no hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime : ucurrentTime,
                foundInCollection: 'student',
                details: student,
                hardwaredetails: null
            }
            // create and store the details
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for student` });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        } else if (teacher) {
            console.log("teacher and no hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime : ucurrentTime,
                foundInCollection: 'teacher',
                details: teacher,
                hardwaredetails: null
            }
            // create and store the details
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for teacher` });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        } else {
            console.log("anonymous and no hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime : ucurrentTime,
                foundInCollection: 'anonymous',
                hardwaredetails: null
            }
            // create and store the details
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for anonymous` });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        }
    } else {
        console.log("hardware details there")
        if (student) {
            console.log("student and hardware");
            if (student.course === hardwaredetails.course) {
                // console.log("Yes 1st")
                if (ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime) {
                    // console.log("Yes 2nd")
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime : ucurrentTime,
                        foundInCollection: 'Student',
                        details: student,
                        hardwaredetails: hardwaredetails,
                        attendance: "Present"
                    }
                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    if (lookup) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Present for this lecture for student` });
                    }
                }
                else {
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime : ucurrentTime,
                        foundInCollection: 'Student',
                        details: student,
                        hardwaredetails: hardwaredetails,
                        attendance: "Absent"
                    }
                    const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    if (lookup) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Absent for this lecture for student` });
                    }
                }
            }
            else {
                const HardwareRfidSwipesObj = {
                    rfid,
                    geoLocation,
                    Ip,
                    currentTime : ucurrentTime,
                    foundInCollection: 'Student',
                    details: student,
                    hardwaredetails: hardwaredetails,
                    attendance: "Not your Lecture"
                }
                const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                if (hardwareswipe) {
                    res.status(201).json({ message: `New document created in HardwareRfidSwipe for student with hardware details` });
                } else {
                    res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
                }
            }
        } else if (teacher) {
            console.log("teacher and hardware");
            if (teacher.course === hardwaredetails.course) {
                // console.log("Yes 1st")
                if (ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime) {
                    // console.log("Yes 2nd")
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime : ucurrentTime,
                        foundInCollection: 'Teacher',
                        details: teacher,
                        hardwaredetails: hardwaredetails,
                        attendance: "Present"
                    }
                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    if (lookup) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Present for this lecture for Teacher` });
                    }
                }
                else {
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime : ucurrentTime,
                        foundInCollection: 'Teacher',
                        details: teacher,
                        hardwaredetails: hardwaredetails,
                        attendance: "Absent"
                    }
                    const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    if (lookup) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Absent for this lecture for teacher` });
                    }
                }
            }
            else {
                const HardwareRfidSwipesObj = {
                    rfid,
                    geoLocation,
                    Ip,
                    currentTime : ucurrentTime,
                    foundInCollection: 'Teacher',
                    details: teacher,
                    hardwaredetails: hardwaredetails,
                    attendance: "Not your Lecture"
                }
                const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                if (hardwareswipe) {
                    res.status(201).json({ message: `New document created in HardwareRfidSwipe for teacher with hardware details` });
                } else {
                    res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
                }
            }
        } else {
            console.log("anonymous and hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime : ucurrentTime,
                foundInCollection: 'anonymous',
                hardwaredetails: hardwaredetails
            }
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for anonymousw with hardware details` });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        }
    }

});

module.exports = {
    HardwareRFid,
};