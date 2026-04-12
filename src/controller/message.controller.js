import Message from '../models/message.model.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;

        const {cipherText, iv} = encrypt(text);

        const newMessage = new Message({
            senderID,
            receiverID,
            cipherText, 
            iv
        });

        await newMessage.save();

        res.status(200).json(newMessage);
    }
    catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getMessages = async (req, res) => {
    try {

        const currentUser = req.user.username;
        const otherUser = req.params.user;

        const messages = await Message.find({
            $or: [
                { senderID: currentUser, receiverID: otherUser },
                { senderID: otherUser, receiverID: currentUser }
            ]
        }).sort({ createdAt: 1 });

        const decryptMsg = messages.map(msg => ({
            senderID : msg.senderID,
            receiverID : msg.receiverID, 
            createdAt: msg.createdAt,
            message : decrypt(msg.cipherText, msg.iv)
        }))

        res.json(decryptMsg);

    } catch (error) {
        console.error("getMessages error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteMessages = async (req, res) => {
    try {
        const currentUser = req.user.username;
        const otherUser = req.params.user;

        await Message.deleteMany({
            $or: [
                { senderID: currentUser, receiverID: otherUser },
                { senderID: otherUser, receiverID: currentUser }
            ]
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("deleteMessages error:", error);
        res.status(500).json({ error: "Failed to clear chat" });
    }
};