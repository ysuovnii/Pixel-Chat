import Message from '../models/message.model.js';
import { encrypt, decrypt } from '../lib/encryption.js';

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverID } = req.params;

        const senderID = req.user._id;

        const encryptedText = encrypt(text);

        const newMessage = new Message({
            senderID,
            receiverID,
            text: encryptedText
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

        console.log("Current user:", currentUser);
        console.log("Other user:", otherUser);

        const messages = await Message.find({
            $or: [
                { senderID: currentUser, receiverID: otherUser },
                { senderID: otherUser, receiverID: currentUser }
            ]
        }).sort({ createdAt: 1 });

        // Decrypt message text before sending to client
        const decryptedMessages = messages.map(msg => {
            const msgObj = msg.toObject();
            try {
                msgObj.text = decrypt(msgObj.text);
            } catch (e) {
                // If decryption fails (e.g. old unencrypted messages), return as-is
                console.warn("Could not decrypt message:", msgObj._id);
            }
            return msgObj;
        });

        console.log("Messages found:", decryptedMessages.length);

        res.json(decryptedMessages);

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