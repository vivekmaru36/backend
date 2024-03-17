const mongoose = require("mongoose");

const temptransactionSchema = new mongoose.Schema({
    
    temp_trans_uid: {
        type: String,
    },
    rfid :{
        type: String,
        required : true
    },
    transactionDate:{
        type: String,
    },
    amount:{
        type: Number
    },
    transactionType:{
        type: String
    },
    availableBalance:{
        type: Number
    },
    email:{
        type: String
    }
});

module.exports = mongoose.model("Temptransactions", temptransactionSchema);
