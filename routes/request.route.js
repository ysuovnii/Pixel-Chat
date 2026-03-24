import express from 'express';
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    searchUsers,
    getPendingRequests
} from '../controller/request.controller.js';

const router = express.Router();

// Page route
router.get('/search', (req, res) => {
    return res.render('searchPage', { user: req.user, activePage: 'search' });
});

// API routes
router.get('/api/users/search', searchUsers);
router.post('/api/request/send/:receiverId', sendRequest);
router.post('/api/request/accept/:requestId', acceptRequest);
router.post('/api/request/reject/:requestId', rejectRequest);
router.get('/api/request/pending', getPendingRequests);

export default router;
