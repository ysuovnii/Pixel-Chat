import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    collegeEmail: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document automatically deleted after 5 minutes
    }
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
