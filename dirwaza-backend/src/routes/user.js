import express from 'express';
import User from '../models/User.js';
import languageService from '../services/languageService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: languageService.getText('auth.tokenRequired', req.language)
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: languageService.getText('auth.invalidToken', req.language)
    });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: languageService.getText('user.notFound', req.language)
      });
    }

    // Format user data
    const userProfile = {
      name: user.name || '',
      phone: user.phone || '',
      image: user.image || '/icons/profile.svg',
      email: user.email || '',
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      message: languageService.getText('user.profileRetrieved', req.language),
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('user.profileError', req.language),
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, image } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: languageService.getText('user.notFound', req.language)
      });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image;

    await user.save();

    res.json({
      success: true,
      message: languageService.getText('user.profileUpdated', req.language),
      data: {
        name: user.name,
        email: user.email,
        image: user.image || '/icons/profile.svg'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('user.profileUpdateError', req.language),
      error: error.message
    });
  }
});

export default router;
