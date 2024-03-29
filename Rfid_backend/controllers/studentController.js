const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Manage OTP & Reset Email
const { generateOTP } = require("./services/otp");
const { sendOTP, sendResetMail } = require("./services/emailService");
const Teacher = require("../models/Teacher");

const HardwareRfidSwipe = require("../models/HardwareRfidSwipe");

const HardwareHistory = require("../models/HardwareHistory");

// @desc Get all Student
// @route GET /Student
// @access Private
const getStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const student = await Student.findById(req.params.id)
    .select("-password -otp -_id -__v")
    .exec();
  if (!student) {
    return res.status(400).json({ message: "Student Not Found." });
  }
  res.json(student);
});

// @desc Get all Student
// @route GET /Student
// @access Private
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password").lean();
  if (!students?.length) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students);
});


// @desc Create New Student
// @route POST /Student
// @access Private
const createNewStudent = asyncHandler(async (req, res) => {
  const { name, course, email, rfid, password, Year } = req.body;

  // Confirm Data
  if (!name || !email || !course || !rfid || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // name check
  const nameRegex = /[a-zA-Z]+$/;
  if (!nameRegex.test(name.trim())) {
    return res.status(400).json({ message: "Name Should contain only letters" });
  }

  // email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: "Invalid Email format" });
  }

  // Check for 
  const duplicateEmail = await Student.findOne({ email }).lean().exec();
  const duplicateEmailT = await Teacher.findOne({ email }).lean().exec();
  const duplicate = await Student.findOne({ rfid }).lean().exec();
  const duplicatet = await Teacher.findOne({ rfid }).lean().exec();

  if (duplicate || duplicatet || duplicateEmailT || duplicateEmail) {
    return res.status(409).json({ message: "Already Registered" });
  }
  const OTP = generateOTP();
  const emailRes = await sendOTP({ OTP, to: email });

  if (emailRes.rejected.length != 0)
    return res.status(500).json({
      message: "Something went wrong! with otp sending Try Again",
    });

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const studentObj = {
    name,
    course,
    email,
    rfid,
    password: hashedPwd,
    Year: Year,
    otp: OTP,
    isVerified: false
  };

  // Create and Store New student
  const student = await Student.create(studentObj);

  if (student) {
    res.status(201).json({ message: `New Student ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Student
// @route PATCH /Student
// @access Private
const updateStudent = asyncHandler(async (req, res) => {
  const { id, name, email, username, password } = req.body;

  // Confirm Data
  if (!id || !name || !email || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Student
  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await Student.findOne({ username }).lean().exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  student.name = name;
  student.email = email;
  student.username = username;

  if (password) {
    // Hash Pwd
    student.password = await bcrypt.hash(password, 10);
  }

  await student.save();

  res.json({ message: "User Updated" });
});

// @desc Delete Student
// @route DELETE /Student
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "Student not found" });
  }

  const result = await student.deleteOne();

  res.json({ message: `${result.username} deleted` });
});


// @desc GetAttendance
// @route POST /getAttendance
// @access Private
const getAttendance = asyncHandler(async (req, res) => {
  const { rfid, course, Year } = req.body;
  console.log(rfid)
  console.log(course)

  const AllLecs = await HardwareHistory.find({ course: course, Year: Year })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  console.log("AllLecs : ", AllLecs);

  const CountAllLecs = await HardwareHistory.countDocuments({ course: course, Year: Year })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  // const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 }).lean().exec();
  const attendance = await HardwareRfidSwipe.find({ rfid: rfid, hardwaredetails: { $ne: null }, 'hardwaredetails.course': course, 'hardwaredetails.Year': Year }, { geoLocation: 0, Ip: 0 })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  const countA = await HardwareRfidSwipe.countDocuments({ rfid: rfid, hardwaredetails: { $ne: null }, 'hardwaredetails.course': course, 'hardwaredetails.Year': Year }, { geoLocation: 0, Ip: 0 })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  console.log("Attendance : ", attendance);
  console.log("Total Count of Attendance : ", countA);

  // yaha

  // Create a new array to store total lectures with attendance status
  const lecturesWithAttendance = AllLecs.map(lec => {
    console.log("AllLecs sTime:", AllLecs.map(lec => lec.sTime));
    console.log("Attendance sTime:", attendance.map(att => att.hardwaredetails.sTime));
    const foundAttendance = attendance.find(att => att.hardwaredetails.sTime   === lec.sTime.toISOString());
    return {
      ...lec,
      attendance: foundAttendance ? foundAttendance.attendance : 'Absent'
    };
  });

  console.log("Damn : ",lecturesWithAttendance);

  if (lecturesWithAttendance) {
    // If a document is found, send it as the response
    return res.status(200).json({ lecturesWithAttendance, countA });
  } else {
    // If no document is found, send a 404 Not Found response
    return res.status(404).json({ message: "No recent records found for the given RFID." });
  }

});


// @desc GetAttendance
// @route POST /getAllLecs
// @access Private
const getAllLecs = asyncHandler(async (req, res) => {
  const { rfid, course, Year } = req.body;
  console.log(rfid)
  console.log(course)

  // const document = await HardwareRfidSwipe.find({ rfid }, { geoLocation: 0, Ip: 0 }).lean().exec();
  const AllLecs = await HardwareHistory.find({ course: course, Year: Year })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  console.log("AllLecs : ", AllLecs);

  const CountAllLecs = await HardwareHistory.countDocuments({ course: course, Year: Year })
    .sort({ currentTime: -1 }) // 1 for ascending order, -1 for descending order
    .lean()
    .exec();

  console.log("CountAllLecs : ", CountAllLecs);

  if (AllLecs) {
    // If a document is found, send it as the response
    return res.status(200).json({ AllLecs, CountAllLecs });
  } else {
    // If no document is found, send a 404 Not Found response
    return res.status(404).json({ message: "No Lectures found" });
  }

});


module.exports = {
  getStudent,
  getAllStudents,
  createNewStudent,
  updateStudent,
  deleteStudent,
  getAttendance,
  getAllLecs
};
