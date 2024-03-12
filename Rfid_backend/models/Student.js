const mongoose = require("mongoose");

// Student Details
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    // required: true,
  },
  isVerified: {
    type: String,
    // required: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
