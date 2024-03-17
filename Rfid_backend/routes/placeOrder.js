const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51LXj5pSGfxW1ffEfL26M8soNhhLqkdXwU26Wni6jtG1Ea8T54x2Pa0Bp5ExUpvinEBH2sAeesPnifRdZnAZR1N5h00Az15HQE2")
const Wallets = require("./../models/wallets");
const Temptransactions = require("./../models/temporaryTransaction");
const {v4 : uuidv4} = require('uuid')
const nodemailer = require('nodemailer'); 
const Transactions = require("./../models/transactions");

router.post("/", async (req, res) => {
    const { products, rfid, email } = req.body;
    try {
        const productsWithTotal = products.map(product => ({
            ...product,
            total: product.price * product.quantity
        }));

        const overallTotal = productsWithTotal.reduce((acc, product) => acc + product.total, 0);
        const transactionId = uuidv4()
        const currentDate = new Date();
        const transactionDate = currentDate.toLocaleDateString('en-GB').toString();
        const userWallet = await Wallets.findOne({rfid: rfid});

        const tempTransactions = new Temptransactions({
            temp_trans_uid: transactionId,
            rfid: rfid,
            transactionDate:transactionDate,
            amount:overallTotal,
            transactionType: "debit",
            availableBalance: userWallet.totalBalance,
            email: email
        })

        await tempTransactions.save();
        return res.status(200).json({ success: true,transactionId:transactionId,amount:overallTotal});


    } catch (err) {
        console.log(err);
    }
})

// once it is over money would be added in wallet

router.post("/sucess",async (req,res) => {
    const {transactionId,rfidNumber} = req.body;
    try{
        console.log(transactionId,);
        const tempTransactions = await Temptransactions.findOne({temp_trans_uid:transactionId});

        if (tempTransactions){
            const amount = parseFloat(tempTransactions.amount);
            const email = tempTransactions.email;
            const availableBalance = tempTransactions.availableBalance;

            if (rfidNumber === tempTransactions.rfid){
                const userWallet = await Wallets.findOne({rfid: rfidNumber});

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'group14rfid@gmail.com',
                        pass: 'hucwoikawijavyil'
                    }
                });

                const mailOptions = {
                    from: 'group14rfid@gmail.com',
                    to: email,
                    subject: 'Invoice',
                    html: `<p>Dear User,</p><p>Your invoice for the transaction with ID: ${transactionId} has been generated.</p><p>Amount: ${amount} is deducted from your account</p>`
                };

                const insufficientOptions = {
                    from: 'group14rfid@gmail.com',
                    to: email,
                    subject: 'Invoice',
                    html: `<p>Dear User,</p><p>Your account for RFID:${rfidNumber} has insufficient Amount!.</p>`
                };
            
                if (userWallet){
                    if (amount <= availableBalance ){
                        
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Error sending email:', error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        
                        await Wallets.updateOne(
                            { rfid: rfidNumber },
                            {
                                $inc: {
                                    totalBalance: -amount, 
                                },
                            }
                        );

                        //delete temporary transactions
                        await Temptransactions.deleteOne({ temp_trans_uid: transactionId });
                        
                        const trans_id = uuidv4()
                        const currentDate = new Date();
                        const transactionDate = currentDate.toLocaleDateString('en-GB').toString();
                        const updatedUserWallet = await Wallets.findOne({rfid: rfidNumber});

                        // create new transactions
                        const newTransactions = new Transactions({
                            trans_uid: trans_id,
                            rfid: rfidNumber,
                            transactionDate:transactionDate,
                            credit:0,
                            debit: amount,
                            forWhat:"Canteen money debited",
                            totalBalance: updatedUserWallet.totalBalance
                        })

                        await newTransactions.save();
                       
                        return res.status(200).json({success:true});

                    }
                    else{
                        transporter.sendMail(insufficientOptions, (error, info) => {
                            if (error) {
                                console.log('Error sending email:', error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        return res.status(200).json({success:true,message:"not sufficient money!"});

                    }
                }else{
                    return res.status(200).json({success:true,message:"wrong rfid!"});
                }
            }else{
                return res.status(200).json({success:true,message:"rfid is invalid. use your rfid!"});
            }
            
            
        }
        else{
            console.log("something went wrong!");
        }
         
        //return res.status(200).json({ success: true });

    }catch(err){
        console.log(err);
        return res.status(400).json({ success: false });
    }
})


module.exports = router;
