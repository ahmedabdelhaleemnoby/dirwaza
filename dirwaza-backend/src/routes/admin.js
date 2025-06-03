import express from 'express';
import { adminLogin, createUser, deleteUser, getUsers, updateUser } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', adminLogin);

// إدارة المستخدمين (محميّة)
router.post('/users', isAdmin, createUser);
router.get('/users', isAdmin, getUsers);
router.put('/users/:id', isAdmin, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);

export default router;
