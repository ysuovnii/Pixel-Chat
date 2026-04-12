import express from 'express';
import authController from '../controller/auth.controller.js';
import ml from '../middleware/auth.middleware.js';

const { redirectIfLoggedIn } = ml;

const router = express.Router();
const { showSignup, showLogin, handleSignup, handleLogin, handleLogout, showVerifyOtp, handleVerifyOtp } = authController

router.post('/signup', handleSignup);
router.post('/verify-otp', handleVerifyOtp);
router.post('/login', handleLogin);

router.get('/signup', showSignup);
router.get('/verify-otp', showVerifyOtp);
router.get('/login', redirectIfLoggedIn, showLogin);
router.get('/logout', handleLogout);

export default router;