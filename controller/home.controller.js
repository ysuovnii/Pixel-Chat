import User from '../models/user.model.js';

function showHome(req, res) {
    return res.render('homePage', { user: req.user });
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
    return res.render('chatPage', { user: req.user, chatPartner });
}

export default { showHome, showChat };