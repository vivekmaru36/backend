const asyncHandler = require("express-async-handler");

const Student = require("./../models/Student");
const Teacher = require("../models/Teacher");

const otp = asyncHandler(async (req, res) => {
    const { otp,rfid } = req.body;
    console.log("This is otp : ",otp);
    console.log("This is rfid : ",rfid);
   
      const student = await Student.findOne({ rfid }).lean().exec();
      const teacher = await Teacher.findOne({ rfid }).lean().exec();
      // console.log("Real otp : ",student.otp)
      if (student && student.otp === otp) {
        await Student.updateOne({ rfid }, { $set: { isVerified: true } });
        return res.status(200).json({ success: true ,message:"Otp Verified Succesfull Please Login"});
      }
      else if (teacher && teacher.otp === otp) {
        await Teacher.updateOne({ rfid }, { $set: { isVerified: true } });
        return res.status(200).json({ success: true ,message:"Otp Verified Succesfull Please Login"});
      } 
      else {
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