const MAIL_SETTINGS = {
    service: "gmail",
    auth: {
      user: "group14rfid@gmail.com",
      pass: "hucwoikawijavyil",
    },
  };
  
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport(MAIL_SETTINGS);
  
  module.exports.sendOTP = async (params) => {
    try {
      let info = await transporter.sendMail({
        from: MAIL_SETTINGS.auth.user,
        to: params.to,
        subject: "Hello 👋",
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>OTP</h2>
          <p style="margin-bottom: 30px;">THIS IS YOUR OTP</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
        </div>
      `,
      });
      return info;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  module.exports.sendResetMail = async (params) => {
    try {
      let info = await transporter.sendMail({
        from: MAIL_SETTINGS.auth.user,
        to: params.to,
        subject: `Hello `,
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Verify OTP.</h2>
     </div>
      `,
      });
      return info;
    } catch (error) {
      console.log(error);
      return false;
    }
  };