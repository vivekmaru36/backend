const asyncHandler = require("express-async-handler");

const Student = require("./../models/Student");

const otp = asyncHandler(async (req, res) => {
    const { otp,rfid } = req.body;
    console.log("This is otp : ",otp);
    console.log("This is rfid : ",rfid);
   
      const student = await Student.findOne({ rfid }).lean().exec();
      if (student && student.otp === otp) {
        await Student.updateOne({ rfid }, { $set: { isVerified: true } });
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({
          message: "Invalid OTP",
          success: false
        });
      }
      // console.error('Error: ', error);
      // return res.status(500).json({ error: 'Internal Server Error' });
    
  });

module.exports = {
    otp
  };