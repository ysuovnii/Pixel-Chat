import User from '../models/user.model.js';

async function showHome(req, res) {
    // Populate friends list so the view can filter online users
    const user = await User.findById(req.user._id).populate('friends', 'username profilePic');
    const friendsList = user.friends.map(f => f.username);
    return res.render('homePage', { user: req.user, friendsList });
}

async function showChat(req, res) {
    const chatPartner = req.params.username;

    // Verify the chat partner exists
    const partner = await User.findOne({ username: chatPartner });
    if (!partner) {
        return res.redirect('/home');
    }

    // Can't chat with yourself
    if (chatPartner === req.user.username) {
        return res.redirect('/home');
    }

    // Verify the chat partner is in the user's friends list
    const currentUser = await User.findById(req.user._id);
    const isFriend = currentUser.friends.some(
        fid => fid.toString() === partner._id.toString()
    );
    if (!isFriend) {
        return res.redirect('/home');
    }

    return res.render('chatPage', { user: req.user, chatPartner });
}

export default { showHome, showChat };