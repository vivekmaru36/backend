const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    
    trans_uid: {
        type: String,
    },
    rfid :{
        type: String,
        required : true
    },
    transactionDate:{
        type: String,
    },

    credit:{
        type: Number
    },
    debit:{
        type: Number
    },
    forWhat:{
        type: String
    },
    totalBalance: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Transactions", transactionSchema);
