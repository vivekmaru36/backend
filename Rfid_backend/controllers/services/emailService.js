const MAIL_SETTINGS = {
  service: "gmail",
  auth: {
    user: "group14rfid@gmail.com",
    pass: "hucwoikawijavyil",
  },
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);


// function of date conversion

function convertToIST12HourFormatWithDate(timestampString) {
  // Parse the input timestamp string
  const timestampUTC = new Date(timestampString);

  console.log(timestampUTC);

  // // Set the time zone to Indian Standard Time (IST)
  // timestampUTC.setUTCHours(timestampUTC.getUTCHours() + 5);
  // timestampUTC.setUTCMinutes(timestampUTC.getUTCMinutes() + 30);

  // Format the date and time in 12-hour format with AM/PM
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'short',
    minute: 'short',
    second: 'short',
    hour12: true,
  };
  const istTime12HourFormatWithDate = timestampUTC.toLocaleString('en-US',);

  return istTime12HourFormatWithDate;
}

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


module.exports.sendLecSetMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Hello You have setted lecture in Hardware Lab on ${convertToIST12HourFormatWithDate(params.lecdetails.Lecdate)} `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Your Lecture has been allotted in hardware lab</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};


module.exports.sendRfidSwipeMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Hello You have swiped Rfid in Hardware Lab on ${convertToIST12HourFormatWithDate(params.details)} `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>You swipped rfid at hardware lab on and ${params.message}</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.sendRfidSwipeMail2 = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Hello You have swiped Rfid in Kc Gate on ${convertToIST12HourFormatWithDate(params.details)} `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>You swipped rfid and ${params.message}</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.sendRfidSwipeMail3 = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Hello You have swiped Rfid in Library on ${convertToIST12HourFormatWithDate(params.details)} `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>You swipped rfid and ${params.message}</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};


module.exports.sendRfidSwipeMail4 = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Hello You have swiped Rfid in Auditorium on ${convertToIST12HourFormatWithDate(params.details)} `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>You swipped rfid and ${params.message}</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};


module.exports.sendRegisterdetails = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `Your Details For Login are  `,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Your Password is : ${params.password}</h2>
          <h2>Your email is : ${params.student.email}</h2>
          <h2>Your Rfid is : ${params.student.rfid}</h2>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};