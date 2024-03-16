const mongoose = require("mongoose");

// Schema for a single schedule entry
const scheduleEntrySchema = new mongoose.Schema({
  venue: {
    type: String,
    required: false // Assuming venue is not always required
  },
  teacher: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: false // Assuming subject is not always required
  }
});

// Schema for a day's schedule
const dayScheduleSchema = new mongoose.Schema({
  type: {scheduleEntrySchema} // Assuming each entry can have multiple schedules for the same time slot
});

// Schema for the overall schedule
const timeScheduleSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Adminnew" // Assuming reference to Admin model
  },
  schedule: {
    type: mongoose.Schema.Types.Mixed 
  },
  Week: {
    type: String,
    required: true
  },
  Year: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Time_Schedule", timeScheduleSchema);
