import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY;

function generateToken(user, res) {
    const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_KEY,
        { expiresIn: "7d" }
    );

    res.cookie("UID", token, {
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, 
        sameSite : "strict",
    });
    
    return token; 
}

export default generateToken;