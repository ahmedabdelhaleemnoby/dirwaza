import express from 'express';
import {
  getExperiences,
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experiencesController.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// للمستخدمين والزوار
router.get('/', getExperiences);
router.get('/:id', getExperienceById);

// للأدمن فقط
router.get('/all', isAdmin, getAllExperiences);
router.post('/', isAdmin, createExperience);
router.put('/:id', isAdmin, updateExperience);
router.delete('/:id', isAdmin, deleteExperience);

export default router;
