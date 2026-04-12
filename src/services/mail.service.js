import transporter from '../config/mail.config';

async function sendOTP(email, otp) {
    const mailOption = {
        from : process.env.EMAIL_USER, 
        to : email, 
        subject : "Your OTP Code", 
        text : `Your OTP is ${otp}`
    }; 

    await transporter.sendMail(mailOption);
}

export default {sendOTP};