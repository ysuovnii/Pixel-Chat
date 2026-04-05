import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authVerify = async (req, res, next) => {
    try {
        const token = req.cookies?.UID

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No Token Provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User Not Found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Auth error:", error.message);
        return res.status(401).json({
            message: "Unauthorized - Invalid Token"
        });
    }
};

const authPage = async (req, res, next) => {
    const token = req.cookies?.UID;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decode.id).select("-password");
        if(!user) {
            return res.redirect("/login");
        }
        req.user = user;
        next();
    } catch {
        return res.redirect("/login");
    }
};

const redirectIfLoggedIn = (req, res, next) => {
    try{
        if (req.cookies?.UID) {
            return res.redirect("/home");
        }
    }
    catch (error) {
        console.log("redirectIfLoggedIn error: ", error.message);
    }
    next();
};

export default {
    authVerify,
    authPage,
    redirectIfLoggedIn, 
};