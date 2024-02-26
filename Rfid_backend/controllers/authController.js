const Teacher = require("./../models/Teacher");
const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

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

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {
    res.status(200).json({
      _id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      course: teacher.course,
      rfid: teacher.rfid
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
    });
  }
});

// // @desc Auth Logout
// // @route POST /auth/logout
// // @access Public
// const logout = asyncHandler(async (req, res) => {});

module.exports = { teacherLogin, studentLogin };
