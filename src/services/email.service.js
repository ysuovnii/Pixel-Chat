import transporter from '../config/nodemailer.config.js';
import dotenv from 'dotenv';
dotenv.config();

export const sendOtpEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: `"IETSphere Registration" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Verify your College Email - IETSphere',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #6C5CE7; text-align: center;">IETSphere - Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for initiating the process to register for IETSphere.</p>
                    <p>Your one-time password (OTP) for verification is:</p>
                    <div style="font-size: 32px; font-weight: bold; background: #f4f4f5; border-radius: 8px; padding: 16px; text-align: center; letter-spacing: 4px; color: #d63384;">
                        ${otp}
                    </div>
                    <p style="margin-top: 24px;">This OTP is valid for <strong>5 minutes</strong>. If you did not initiate this request, please ignore this email.</p>
                    <br/>
                    <p>Thank you for choosing IETSphere,<br/>The IETSphere Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP Email: ', error);
        return false;
    }
};
