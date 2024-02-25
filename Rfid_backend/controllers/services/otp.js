const otpGenerator = require("otp-generator");
module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  return OTP;
};