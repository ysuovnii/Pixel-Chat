import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import generateToken from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

function showSignup(req, res) {
    return res.render('signupPage', { message: null });
}

function showLogin(req, res) {
    return res.render('loginPage', { message: null });
}

async function handleSignup(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render("signupPage", { message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.render("signupPage", { message: "Password must be atleast 6 characters long" });
        }

        const checkExistingUser = await User.findOne({ email });

        if (checkExistingUser) {
            return res.render("signupPage", { message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashPassword,
        })
        await user.save();

        return res.redirect('/login');

    }
    catch (error) {
        console.log("error : ", error.message);
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
    updateProfile
};