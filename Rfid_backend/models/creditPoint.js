const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  rfid :{
    type: String,
    required : true
  },
  credit_point: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Credits", creditSchema);
