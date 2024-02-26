const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Manage OTP & Reset Email
const { generateOTP } = require("./services/otp");
const { sendOTP, sendResetMail } = require("./services/emailService");
const Teacher = require("../models/Teacher");

// @desc Get all Student
// @route GET /Student
// @access Private
const getStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const student = await Student.findById(req.params.id)
    .select("-password -_id -__v")
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

  // Check for Duplicates
  const duplicate = await Student.findOne({ rfid }).lean().exec();
  const duplicatet = await Teacher.findOne({ rfid }).lean().exec();

  if (duplicate || duplicatet) {
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
    otp:OTP,
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

module.exports = {
  getStudent,
  getAllStudents,
  createNewStudent,
  updateStudent,
  deleteStudent,
};
