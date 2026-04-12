import crypto from 'crypto';

export const generateOTP = () => {
    // Generates a 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999);
    return String(otp);
};
