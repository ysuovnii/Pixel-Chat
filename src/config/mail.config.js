import nodemailer from 'nodemailer';

const transporter = nodemailer.createTestAccount({
    service : "gmail", 
    auth : {
        user : process.env.EMAIL_USER, 
        pass : process.env.EMAIL_PASS, 
    }
});

export default transporter;