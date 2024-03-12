const mongoose = require("mongoose");

// Teacher Details
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "teacher",
  },
  Year: {
    type: String,
    required: true,
  }
  // isVerified: {
  //   type: String,
  //   required: true
  // },
  // otp: {
  //   type: Number,
  //   // required: true,
  // },
});

module.exports = mongoose.model("Teacher", teacherSchema);
