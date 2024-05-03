
const nodemailer=require('nodemailer');
function sendOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'juluridineshkumar@gmail.com',
        pass: 'dvld pxzt zsfm tbkh',
      },
    });
  
    const mailOptions = {
      from: 'juluridineshkumar@gmail.com',
      to: email,
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  module.exports=sendOTPEmail;
  
