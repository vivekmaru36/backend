const Teacher = require("./../models/Teacher");
const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Admin_model = require("../models/Admin_model");

// @desc Auth Login
// @route POST /auth/login/teacher
// @access Public
const teacherLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const teacher = await Teacher.findOne({ email }).exec();

  if (!teacher) {
    return res.status(404).json({ message: "User not found" });
  }
  // if (!teacher.role) {
  //   return res.status(418).json({ message: "User not Approved" });
  // }

  if (teacher.isVerified === "false") {
    // Delete the particular student
    await Teacher.findByIdAndDelete(teacher._id);

    return res.status(501).json({ message: "Please register again, you were not verified" });
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {
    res.status(200).json({
      _id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      course: teacher.course,
      rfid: teacher.rfid,
      email:teacher.email
    });
  }
});

// @desc Auth Login
// @route POST /auth/login/student
// @access Public
const studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const student = await Student.findOne({ email }).exec();

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, student.password);
  // console.log('user sended :' ,password);
  // console.log('decrypt :',student.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });


  if (student.isVerified === "false") {
    // Delete the particular student
    await Student.findByIdAndDelete(student._id);

    return res.status(501).json({ message: "Please register again, you were not verified" });
  }

  else {
    res.status(200).json({
      _id: student.id,
      name: student.name,
      role: "student",
      rfid : student.rfid,
      course:student.course,
      email:student.email,
      Year:student.Year
    });
  }
});

// // @desc Auth Logout
// // @route POST /auth/logout
// // @access Public
// const logout = asyncHandler(async (req, res) => {});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const admin = await Admin_model.findOne({ email }).exec();

  if (!admin) {
    return res.status(404).json({ message: "User not found" });
  }

  // const match = await bcrypt.compare(password, admin.password);
  // console.log('user sended :' ,password);
  // console.log('decrypt :',student.password);
  // if (!match) return res.status(401).json({ message: "Incorrect Password" });


  if (!admin) {
    // Delete the particular student
    return res.status(501).json({ message: "Admin Not Found" });
  }

  else {
    res.status(200).json({
      _id: admin.id,
      name: admin.name,
      role: "admin",
      // rfid : student.rfid,
      // course:student.course,
      email:admin.email,
      // Year:student.Year
    });
  }
});


module.exports = { teacherLogin, studentLogin,adminLogin };
