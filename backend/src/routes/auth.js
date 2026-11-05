import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role')
  ],
  register
);
router.post('/login', [body('email').isEmail(), body('password').exists()], login);
router.get('/me', protect, getMe);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

export default router;

