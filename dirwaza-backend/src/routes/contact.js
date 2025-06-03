import express from 'express';
import { sendContactMessage, getAllContacts, deleteContact } from '../controllers/contactController.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// إرسال رسالة تواصل (مفتوح)
router.post('/', sendContactMessage);
// جلب جميع الرسائل (للأدمن)
router.get('/', isAdmin, getAllContacts);
// حذف رسالة (للأدمن)
router.delete('/:id', isAdmin, deleteContact);

export default router;
