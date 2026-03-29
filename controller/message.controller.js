import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverID } = req.params;

        const senderID = req.user._id;

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
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

        console.log("Messages found:", messages);

        res.json(messages);

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