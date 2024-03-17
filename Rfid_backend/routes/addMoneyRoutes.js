const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51OufCySGj8IwMIKi34LIgciq5ueL1v7U2q0ennEDW50XnxBXbnVXk7MJaDGEmIFv743ahiCaJeioWpeai3hEWXq600PFF060yd")
const Wallets = require("./../models/wallets");
const Transactions = require("./../models/transactions");
const {v4 : uuidv4} = require('uuid');
const nodemailer = require('nodemailer'); 



router.post("/", async (req, res) => {
    const { userId, rfid, money, email, name, address } = req.body;
    const response = {};
    try {
        console.log(money);
        console.log(rfid);
        const line_items = {
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Money Transfer"
                },
                unit_amount: Math.round(money * 100),
            },
            quantity: 1,
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            line_items: [line_items],
            mode: "payment",
            success_url: `http://localhost:3000/success/${userId}/${rfid}/${money}`,
            cancel_url: "http://localhost:3000/dash/cancel",
            invoice_creation: {
                enabled: true,
            },
            shipping_address_collection:{
                allowed_countries: ['US']
            }
        })
        console.log(session);
        response.message = "Money added successfully";
        response.statusText = "OK";
        response.session = session;
        res.status(200).json({ session: session, success: true });

    } catch (err) {
        console.log(err);
    }
})

// once it is over money would be added in wallet

router.post("/sucess",async (req,res) => {
    const {userId,rfid,email} = req.body;
    try{
        console.log(userId);
        console.log(rfid);
        const money = parseFloat(req.body.money);
        
        const transactionId = uuidv4()

        const userWallet = await Wallets.findOne({rfid: rfid});
        await Wallets.updateOne(
            { rfid: rfid },
            {
                $set: {
                    totalBalance: userWallet.totalBalance + money,
                },
            }
        );
        
        const updatedUserWallet = await Wallets.findOne({rfid: rfid});

        const currentDate = new Date();
        const transactionDate = currentDate.toLocaleDateString('en-GB').toString();
    
        const newTransactions = new Transactions({
            trans_uid: transactionId,
            rfid: rfid,
            transactionDate:transactionDate,
            credit:money,
            debit: 0,
            forWhat:"Money added to Wallet!",
            totalBalance: updatedUserWallet.totalBalance
        })

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
            html: `<p>Dear User,</p><p>Your invoice for the transaction with ID: ${transactionId} has been generated.</p><b></b><p>Amount: ${money} has been credited in your accout</p><b></b>Transaction Date: ${transactionDate}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        await newTransactions.save();
        return res.status(200).json({ success: true });

    }catch(err){
        console.log(err);
        return res.status(400).json({ success: false });
    }
})


module.exports = router;
