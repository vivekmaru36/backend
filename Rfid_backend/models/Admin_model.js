const mongoose = require("mongoose");

// Teacher Details
const Adminnew = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  
});

module.exports = mongoose.model("Adminnew", Adminnew);
