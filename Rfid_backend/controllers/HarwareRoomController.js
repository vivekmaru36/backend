const asyncHandler = require("express-async-handler");


const Student = require("./../models/Student");
const Teacher = require("../models/Teacher");
const axios = require('axios');
const Credits = require("./../models/creditPoint");

const { sendRfidSwipeMail, sendRfidSwipeMail2, sendRfidSwipeMail3, sendRfidSwipeMail4 } = require("./services/emailService");



const HardwareRfidSwipe = require("../models/HardwareRfidSwipe")

const EntryGateModel = require("../models/EntryGateModel");
const LibraryModel = require("../models/LibraryModel");
const AuditoriumModel = require("../models/AuditoriumModel");

const HardwareRFid = asyncHandler(async (req, res) => {
    const { rfid, geoLocation, Ip, ucurrentTime } = req.body;
    console.log(rfid)
    console.log(geoLocation)
    console.log(Ip)
    console.log(ucurrentTime);
    const currentTttime = new Date();
    console.log("Apna : ", currentTttime);

    // const ipcheck = "Your ip here";
    // const geocheck = "Your geo location here";
    // if (ipcheck!==Ip && geocheck!==geoLocation){
    //     res.status(400).json({ message: "Request came from somewhere else" });
    // }

    // Call the / endpoint to get hardware details
    let hardwaredetails;
    try {
        const response = await axios.get('http://localhost:3500/Hardware');
        if (response.status === 200) {
            hardwaredetails = response.data.hardwaredetails;
            console.log('Hardware details:', hardwaredetails);
        } else {
            console.log('Failed to fetch hardware details:', response.statusText);
        }
    } catch (error) {
        console.log('Error fetching hardware details:', error.message);
        // Handle the case where hardwaredetails are not fetched
        hardwaredetails = null; // Set hardwaredetails to null to indicate it's not available
    }

    // console.log(hardwaredetails._id);

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
                currentTime: ucurrentTime,
                foundInCollection: 'student',
                details: student,
                hardwaredetails: null
            }
            

            // create and store the details
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for student` });
                const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'New document created in HardwareRfidSwipe for student' });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        } else if (teacher) {
            console.log("teacher and no hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime: ucurrentTime,
                foundInCollection: 'teacher',
                details: teacher,
                hardwaredetails: null
            }
            // create and store the details
            const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
            if (hardwareswipe) {
                res.status(201).json({ message: `New document created in HardwareRfidSwipe for teacher` });
                const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'New document created in HardwareRfidSwipe for teacher' });
            } else {
                res.status(400).json({ message: "Invalid data received For creating new doc in HardwareRfidSwipe" });
            }
        } else {
            console.log("anonymous and no hardware");
            const HardwareRfidSwipesObj = {
                rfid,
                geoLocation,
                Ip,
                currentTime: ucurrentTime,
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
            if (student.course === hardwaredetails.course && student.Year === hardwaredetails.Year) {
                // console.log("Yes 1st")
                if (ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime) {
                    // console.log("Yes 2nd")
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime: ucurrentTime,
                        foundInCollection: 'Student',
                        details: student,
                        hardwaredetails: hardwaredetails,
                        attendance: "Present"
                    }

                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    
                    /* Add credit point once lectures has been marked presnet  */
                    
                    /* logic is for every lecture marked present one credit point is added */
                    /* if you want any complex logic you can add here */

                    const creditPoint = await Credits.findOne({ rfid: rfid });
                    if (!creditPoint){
                        const newCreditPoint = new Credits({
                            credit_point: 1,
                            rfid: rfid
                        });
                  
                        await newCreditPoint.save();
                    }
                    else{
                        await creditPoint.updateOne({
                            rfid: rfid
                        },{
                            $inc:{
                                credit_point: 1
                            }
                        })
                    }

                    /* ------------- code end here bhoomika ------------------- */
                    
                    if (lookup && !(ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime)) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'Your attendance has been marked Present for this lecture' });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Present for this lecture for student` });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'Attendace marked Present for this lecture for student' });
                    }
                }
                else {
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime: ucurrentTime,
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
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'Your attendance has been marked for this lecture' });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Absent for this lecture for student` });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'Your attendance has been marked Absent for this lecture' });
                    }
                }
            }
            else {
                const HardwareRfidSwipesObj = {
                    rfid,
                    geoLocation,
                    Ip,
                    currentTime: ucurrentTime,
                    foundInCollection: 'Student',
                    details: student,
                    hardwaredetails: hardwaredetails,
                    attendance: "Not your Lecture"
                }
                const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                if (hardwareswipe) {
                    res.status(201).json({ message: `New document created in HardwareRfidSwipe for student with hardware details` });
                    const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: student.email, message: 'Your card has been swwiped but its not your lecture' });
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
                        currentTime: ucurrentTime,
                        foundInCollection: 'Teacher',
                        details: teacher,
                        hardwaredetails: hardwaredetails,
                        attendance: "Present"
                    }
                    // lookup for same insertion
                    const lookup = await HardwareRfidSwipe.findOne({ "hardwaredetails._id": hardwaredetails._id, "rfid": rfid });
                    if (lookup) {
                        res.status(400).json({ message: "Your attendance has been marked for this lecture" });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'Your attendance has been already marked for this lecture' });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Present for this lecture for Teacher` });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'Your attendance has been marked Present for this lecture' });
                    }
                }
                else {
                    const HardwareRfidSwipesObj = {
                        rfid,
                        geoLocation,
                        Ip,
                        currentTime: ucurrentTime,
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
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'Your attendance has been marked for this lecture' });
                    } else {
                        const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                        res.status(201).json({ message: `Attendace marked Absent for this lecture for teacher` });
                        const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'Your attendance has been marked Absent for this lecture' });
                    }
                }
            }
            else {
                const HardwareRfidSwipesObj = {
                    rfid,
                    geoLocation,
                    Ip,
                    currentTime: ucurrentTime,
                    foundInCollection: 'Teacher',
                    details: teacher,
                    hardwaredetails: hardwaredetails,
                    attendance: "Not your Lecture"
                }
                const hardwareswipe = await HardwareRfidSwipe.create(HardwareRfidSwipesObj);
                if (hardwareswipe) {
                    res.status(201).json({ message: `New document created in HardwareRfidSwipe for teacher with hardware details` });
                    const emailsend = await sendRfidSwipeMail({ details: ucurrentTime, to: teacher.email, message: 'Card Swpped but no your lecture' });
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
                currentTime: ucurrentTime,
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

const EntryGate = asyncHandler(async (req, res) => {
    const { rfid, geoLocation, Ip, ucurrentTime } = req.body;
    console.log(rfid)
    console.log(geoLocation)
    console.log(Ip)
    console.log(ucurrentTime);
    const currentTttime = new Date();

    const student = await Student.findOne({ rfid }).lean().exec();
    const teacher = await Teacher.findOne({ rfid }).lean().exec();

    if (student) {
        console.log("Student and at Kc Gate");
        const KcGateEntyrRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'student',
            details: student,
        }
        const KcGateSwipe = await EntryGateModel.create(KcGateEntyrRfidSwipesObj);

        if (KcGateSwipe) {
            res.status(201).json({ message: `New document created in EntryGate for student` });
            const emailsend2 = await sendRfidSwipeMail2({ details: ucurrentTime, to: student.email, message: 'You were preesent at kc gate' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in EntryGate" });
        }
    } else if (teacher) {
        console.log("Teacher and at Kc Gate");
        const KcGateEntyrRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'teacher',
            details: teacher,
        }
        const KcGateSwipe = await EntryGateModel.create(KcGateEntyrRfidSwipesObj);

        if (KcGateSwipe) {
            res.status(201).json({ message: `New document created in EntryGate for teacher` });
            const emailsend2 = await sendRfidSwipeMail2({ details: ucurrentTime, to: teacher.email, message: 'You were Present at Kc gate' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in EntryGate" });
        }
    } else {
        console.log("Annonymous");
        const KcGateEntyrRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'anonymous',
        }
        const KcGateSwipe = await EntryGateModel.create(KcGateEntyrRfidSwipesObj);

        if (KcGateSwipe) {
            res.status(201).json({ message: `New document created in EntryGate for Anonymous` });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in EntryGate" });
        }
    }

});

const Library = asyncHandler(async (req, res) => {
    const { rfid, geoLocation, Ip, ucurrentTime } = req.body;
    console.log(rfid)
    console.log(geoLocation)
    console.log(Ip)
    console.log(ucurrentTime);
    const currentTttime = new Date();

    const student = await Student.findOne({ rfid }).lean().exec();
    const teacher = await Teacher.findOne({ rfid }).lean().exec();

    if (student) {
        console.log("Student and at Library");
        const LibraryRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'student',
            details: student,
        }
        const LibrarySwipe = await LibraryModel.create(LibraryRfidSwipesObj);

        if (LibrarySwipe) {
            res.status(201).json({ message: `New document created in library for student` });
            const emailsend2 = await sendRfidSwipeMail3({ details: ucurrentTime, to: student.email, message: 'You were present at Library' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in library" });
        }
    } else if (teacher) {
        console.log("Teacher and at Kc Gate");
        const LibraryRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'teacher',
            details: teacher,
        }
        const LibrarySwipe = await LibraryModel.create(LibraryRfidSwipesObj);

        if (LibrarySwipe) {
            res.status(201).json({ message: `New document created in library for teacher` });
            const emailsend2 = await sendRfidSwipeMail3({ details: ucurrentTime, to: teacher.email, message: 'You were Present at Library' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in Library" });
        }
    } else {
        console.log("Annonymous");
        const LibraryRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'anonymous',
        }
        const LibrarySwipe = await LibraryModel.create(LibraryRfidSwipesObj);

        if (LibrarySwipe) {
            res.status(201).json({ message: `New document created in Library for Anonymous` });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in Library" });
        }
    }

});

const Auditorium = asyncHandler(async (req, res) => {
    const { rfid, geoLocation, Ip, ucurrentTime } = req.body;
    console.log(rfid)
    console.log(geoLocation)
    console.log(Ip)
    console.log(ucurrentTime);
    const currentTttime = new Date();

    const student = await Student.findOne({ rfid }).lean().exec();
    const teacher = await Teacher.findOne({ rfid }).lean().exec();

    if (student) {
        console.log("Student and at Auditorium");
        const AuditoriumRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'student',
            details: student,
        }
        const AuditoriumSwipe = await AuditoriumModel.create(AuditoriumRfidSwipesObj);

        if (AuditoriumSwipe) {
            res.status(201).json({ message: `New document created in Auditorium for student` });
            const emailsend2 = await sendRfidSwipeMail4({ details: ucurrentTime, to: student.email, message: 'You were present at Auditorium' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in Auditorium" });
        }
    } else if (teacher) {
        console.log("Teacher and at Auditorium");
        const AuditoriumRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'teacher',
            details: teacher,
        }
        const AuditoriumSwipe = await AuditoriumModel.create(AuditoriumRfidSwipesObj);

        if (AuditoriumSwipe) {
            res.status(201).json({ message: `New document created in Auditorium for teacher` });
            const emailsend2 = await sendRfidSwipeMail4({ details: ucurrentTime, to: teacher.email, message: 'You were Present at Auditorium' });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in Auditorium" });
        }
    } else {
        console.log("Annonymous");
        const AuditoriumRfidSwipesObj = {
            rfid,
            geoLocation,
            Ip,
            currentTime: ucurrentTime,
            foundInCollection: 'anonymous',
        }
        const AuditoriumSwipe = await AuditoriumModel.create(AuditoriumRfidSwipesObj);

        if (AuditoriumSwipe) {
            res.status(201).json({ message: `New document created in Auditorium for Anonymous` });
        } else {
            res.status(400).json({ message: "Invalid data received For creating new doc in Auditorium" });
        }
    }

});

module.exports = {
    HardwareRFid,
    EntryGate,
    Library,
    Auditorium
};