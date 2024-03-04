const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const { generateOTP } = require("./services/otp");
const { sendOTP, sendResetMail } = require("./services/emailService");






// @desc Create New Teacher
// @route POST /Teacher
// @access Private
const createNewTeacher = asyncHandler(async (req, res) => {
  const { name, email, rfid, course, password, roles } =
    req.body;

  // Confirm Data
  if (
    !name ||
    !email ||
    !rfid ||
    !course ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Teacher.findOne({ rfid }).lean().exec();
  const duplicates = await Student.findOne({ rfid }).lean().exec();
  const duplicateEmail = await Student.findOne({ email }).lean().exec();
  const duplicateEmailT = await Teacher.findOne({ email }).lean().exec()

  if (duplicate || duplicates || duplicateEmail || duplicateEmailT) {
    return res.status(409).json({ message: "Rfid or Email Already Registered" });
  }
  const OTP = generateOTP();
  const emailRes = await sendOTP({ OTP, to: email });

  if (emailRes.rejected.length != 0)
    return res.status(500).json({
      message: "Something went wrong! with otp sending Try Again",
    });

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const teacherObj = {
    name,
    email,
    rfid,
    course,
    password: hashedPwd,
    roles,
    otp: OTP,
    isVerified: false
  };

  // Create and Store New teacher
  const teacher = await Teacher.create(teacherObj);

  if (teacher) {
    res.status(201).json({ message: `New Teacher ${name} Registered` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});



// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID required" });
  }

  const teacher = await Teacher.findById(id).exec();

  if (!teacher) {
    return res.status(400).json({ message: "Teacher not found" });
  }

  const result = await teacher.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

// @desc Get Teacher
// @route GET /teacher
// @access Private
const getTeacher = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const teacher = await Teacher.findById(req.params.id)
    .select("-password -otp -_id -__v")
    .lean();
  if (!teacher) {
    return res.status(404).json({ message: "No Teacher Found." });
  }
  res.json(teacher);
});

module.exports = {
  
  createNewTeacher,
  
  deleteTeacher,
  getTeacher
};
