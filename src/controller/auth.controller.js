import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import bcrypt from 'bcrypt';
import generateToken from '../services/token.service.js';
import cloudinary from '../config/cloudinary.config.js';
import { generateOTP } from '../utils/otp.util.js';
import { sendOtpEmail } from '../services/email.service.js';

function showSignup(req, res) {
    return res.render('signupPage', { message: null });
}

function showLogin(req, res) {
    return res.render('loginPage', { message: null });
}

async function handleSignup(req, res) {
    try {
        const { username, email, collegeEmail, password } = req.body;

        if (!username || !email || !collegeEmail || !password) {
            return res.render("signupPage", { message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.render("signupPage", { message: "Password must be atleast 6 characters long" });
        }

        const checkExistingUser = await User.findOne({ email });

        if (checkExistingUser) {
            return res.render("signupPage", { message: "User already exists" });
        }

        // Generate OTP
        const otp = generateOTP();

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Remove old OTP request for the same email if user is resubmitting
        await OTP.deleteOne({ collegeEmail });

        const otpRecord = new OTP({
            username,
            email,
            collegeEmail,
            password: hashPassword,
            otp
        });
        await otpRecord.save();

        const isEmailSent = await sendOtpEmail(collegeEmail, otp);
        if (!isEmailSent) {
            return res.render("signupPage", { message: "Failed to send OTP to the provided college email." });
        }

        return res.redirect(`/verify-otp?email=${encodeURIComponent(collegeEmail)}`);
    }
    catch (error) {
        console.log("error : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function showVerifyOtp(req, res) {
    const email = req.query.email || '';
    if (!email) {
        return res.redirect('/signup');
    }
    return res.render('verifyOtpPage', { message: null, email });
}

async function handleVerifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.render("verifyOtpPage", { message: "OTP and Email are required", email });
        }

        const otpRecord = await OTP.findOne({ collegeEmail: email, otp });

        if (!otpRecord) {
            return res.render("verifyOtpPage", { message: "Invalid or Expired OTP", email });
        }

        const user = new User({
            username: otpRecord.username,
            email: otpRecord.email,
            collegeEmail: otpRecord.collegeEmail,
            password: otpRecord.password,
        });

        await user.save();
        await OTP.deleteOne({ _id: otpRecord._id });

        generateToken(user, res);
        return res.redirect('/home');
    } catch (error) {
        console.log("verify otp error : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("loginPage", { message: "User not found" });
        }

        const passwordVerification = await bcrypt.compare(password, user.password);
        if (!passwordVerification) {
            return res.render("loginPage", { message: "Invalid Credentials" });
        }

        generateToken(user, res);

        return res.redirect('/home');
    }
    catch (error) {
        console.log("error : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function handleLogout(req, res) {
    try {
        res.clearCookie("UID", {
            httpOnly: true,
            sameSite: "strict"
        });
        return res.redirect('/login');
    }
    catch (error) {
        console.log("error : ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function updateProfile(req, res) {
    try {
        const { profilePic } = req.body;
        const userID = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }


        const uploadRes = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userID, {
            profilePic: uploadRes.secure_url
        }, { new: true })

        return res.status(200).json({ updatedUser })
    }
    catch (error) {
        console.log("error : ", error.message);
    }
}


export default {
    showSignup,
    showLogin,
    handleSignup,
    handleLogin,
    handleLogout,
    updateProfile,
    showVerifyOtp,
    handleVerifyOtp
};