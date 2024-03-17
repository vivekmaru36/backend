const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51LXj5pSGfxW1ffEfL26M8soNhhLqkdXwU26Wni6jtG1Ea8T54x2Pa0Bp5ExUpvinEBH2sAeesPnifRdZnAZR1N5h00Az15HQE2")
const Wallets = require("../models/wallets");
const Temptransactions = require("../models/temporaryTransaction");
const {v4 : uuidv4} = require('uuid')
const nodemailer = require('nodemailer'); 
const Transactions = require("../models/transactions");
const Credits = require("../models/creditPoint");

// what this file contains
// fetch credit
// adding credit point to wallet



router.post("/", async (req, res) => {
    const { rfid } = req.body;
    try {
        
        const credit = await Credits.findOne({rfid:rfid});

        if (!credit){
            const newCredit = new Credits({
                rfid:rfid,
                credit_point:0
            })
            await newCredit.save();

            return res.status(200).json({ success: true, creditpoint:0 });
        }
        return res.status(200).json({ success: true,creditpoint:credit.credit_point});
    } catch (err) {
        console.log(err);
    }
})

// once it is over money would be added in wallet

router.post("/placeOrder",async (req,res) => {
    const {creditPoint,rfid,email} = req.body;
    try {
        
        const transactionId = uuidv4()
        const currentDate = new Date();
        const transactionDate = currentDate.toLocaleDateString('en-GB').toString();
        const userWallet = await Wallets.findOne({rfid: rfid});

        const tempTransactions = new Temptransactions({
            temp_trans_uid: transactionId,
            rfid: rfid,
            transactionDate:transactionDate,
            amount:creditPoint,
            transactionType: "credit",
            availableBalance: userWallet.totalBalance,
            email: email
        })

        await tempTransactions.save();
        return res.status(200).json({ success: true,transactionId:transactionId,amount:creditPoint});


    } catch (err) {
        console.log(err);
    }
        
})


module.exports = router;
