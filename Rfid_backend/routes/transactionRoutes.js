const express = require("express");
const router = express.Router();
const Transactions = require("./../models/transactions");

/* fetch transaction details */

router.post("/",async (req,res) => {
    const {rfid} = req.body;
    try{
        const transactions = await Transactions.aggregate([
            {
                $match: { rfid: rfid }
            }
        ]);
        
        
        res.status(200).json({success:true,transactions:transactions});

    }catch(err){
        console.log(err);
    }
})

module.exports = router;
