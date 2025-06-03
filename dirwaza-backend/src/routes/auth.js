import express from 'express';
import { register, login, checkCode, resendCode, logout } from '../controllers/authController.js';

const router = express.Router();

// تسجيل مستخدم جديد بعد التحقق من OTP
router.post('/register', register);
router.post('/login', login);
router.post('/check_code', checkCode);
router.post('/resend_code', resendCode);
router.post('/logout', logout);

export default router;
