const mongoose = require("mongoose");

const walletsSchema = new mongoose.Schema({
  rfid :{
    type: String,
    required : true
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Wallets", walletsSchema);
