import express from 'express';
import homeController from '../controller/home.controller.js';
import authController from '../controller/auth.controller.js';

const router = express.Router();

router.get('/home', homeController.showHome);
router.get('/chat/:username', homeController.showChat);

router.get('/profile', (req, res) => {
    return res.render('profileSettingPage', { user: req.user });
});

router.put('/profile/update', authController.updateProfile);

export default router;
