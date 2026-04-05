import FriendRequest from "../models/request.model.js";
import User from "../models/user.model.js";

export const sendRequest = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;

        if (senderId.toString() === receiverId) {
            return res.status(400).json({ error: "Cannot send request to yourself" });
        }

        // Check if already friends
        const sender = await User.findById(senderId);
        if (sender.friends.map(f => f.toString()).includes(receiverId)) {
            return res.status(400).json({ error: "Already friends" });
        }

        // Check for existing request in either direction
        const existing = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId, status: "pending" },
                { sender: receiverId, receiver: senderId, status: "pending" }
            ]
        });

        if (existing) {
            return res.status(400).json({ error: "Request already exists" });
        }

        const request = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        res.json(request);
    } catch (error) {
        console.error("sendRequest error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const request = await FriendRequest.findById(req.params.requestId);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Only the receiver can accept
        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }

        request.status = "accepted";
        await request.save();

        await User.findByIdAndUpdate(request.sender, {
            $addToSet: { friends: request.receiver }
        });

        await User.findByIdAndUpdate(request.receiver, {
            $addToSet: { friends: request.sender }
        });

        res.json({ msg: "Friend added" });
    } catch (error) {
        console.error("acceptRequest error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const request = await FriendRequest.findById(req.params.requestId);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Only the receiver can reject
        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await FriendRequest.findByIdAndDelete(req.params.requestId);

        res.json({ msg: "Request rejected" });
    } catch (error) {
        console.error("rejectRequest error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q || "";
        if (!query.trim()) {
            return res.json([]);
        }

        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);
        const friendIds = currentUser.friends.map(f => f.toString());

        // Find users matching the query (exclude current user)
        const users = await User.find({
            username: { $regex: query, $options: "i" },
            _id: { $ne: currentUserId }
        }).select("username profilePic _id").limit(20);

        // Get pending requests sent by current user
        const sentRequests = await FriendRequest.find({
            sender: currentUserId,
            status: "pending"
        });
        const sentToIds = sentRequests.map(r => r.receiver.toString());

        // Get pending requests received by current user
        const receivedRequests = await FriendRequest.find({
            receiver: currentUserId,
            status: "pending"
        });
        const receivedFromIds = receivedRequests.map(r => r.sender.toString());

        const results = users.map(u => {
            let status = "none";
            const uid = u._id.toString();
            if (friendIds.includes(uid)) status = "friends";
            else if (sentToIds.includes(uid)) status = "sent";
            else if (receivedFromIds.includes(uid)) status = "received";
            return {
                _id: u._id,
                username: u.username,
                profilePic: u.profilePic,
                status
            };
        });

        res.json(results);
    } catch (error) {
        console.error("searchUsers error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            receiver: req.user._id,
            status: "pending"
        }).populate("sender", "username profilePic");

        res.json(requests);
    } catch (error) {
        console.error("getPendingRequests error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};