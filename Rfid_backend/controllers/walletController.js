const asyncHandler = require("express-async-handler");
const Wallets = require("./../models/wallets");

const Wallet = asyncHandler(async (req, res) => {
    const { rfid } = req.body;

    try {
      const userWallet = await Wallets.findOne({ rfid: rfid });

      if (!userWallet) {
        const newWallet = new Wallets({
          totalBalance: 0,
          rfid: rfid
        });

        await newWallet.save();
        return res.status(200).json({ success: true, data:0 });
      }    
      

      return res.status(200).json({ success: true, data: userWallet.totalBalance });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = {
  Wallet
};
