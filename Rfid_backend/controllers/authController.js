const Teacher = require("./../models/Teacher");
const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

  if (teacher.isVerified === false) {
    await Teacher.findByIdAndDelete(teacher._id);
    return res.status(501).json({ message: "Please register again, you were not verified" });
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  
  res.status(200).json({
    _id: teacher.id,
    name: teacher.name,
    role: teacher.role,
    course: teacher.course,
    rfid: teacher.rfid
  });
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

  if (student.isVerified === false) {
    await Student.findByIdAndDelete(student._id);
    return res.status(501).json({ message: "Please register again, you were not verified" });
  } else {
    res.status(200).json({
      _id: student.id,
      name: student.name,
      role: "student",
      rfid: student.rfid
    });
  }
});

// @desc Forgot Password
// @route POST /auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Student.findOne({ email });

    if (!user) {
      user = await Teacher.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or Not existing mail' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save token and expiry in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'group14rfid@gmail.com', // Replace with your email
        pass: 'hucwoikawijavyil', // Replace with your email password or App Password
      },
    });

    // Send the reset link to the user's email
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: 'group14rfid@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    });

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @desc Reset Password
// @route POST /auth/reset-password/:token
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {

    const user = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }) || await Teacher.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user password and clear reset token fields
    user.password = await bcrypt.hash(password, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { teacherLogin, studentLogin, forgotPassword, resetPassword };
