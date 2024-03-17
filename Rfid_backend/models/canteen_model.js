const mongoose = require("mongoose");

const canteenSchema = new mongoose.Schema({
    
    order_no: {
        type: String,
    },
    rfid :{
        type: Number,
        required : true
    },
    transactionDate:{
        type: String,
    },
    product_details:{
        type: Array
    }
});

module.exports = mongoose.model("Canteen", canteenSchema);
