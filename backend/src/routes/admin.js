import express from 'express';
import { body, param } from 'express-validator';
import { getAllUsers, updateUser, deleteUser, getSpecialties, getAllAppointments } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.use(protect, requireRole(['admin']));

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id', [param('id').isMongoId(), body('name').optional().isString(), body('email').optional().isEmail(), body('role').optional().isIn(['patient','doctor','admin'])], updateUser);
router.delete('/users/:id', [param('id').isMongoId()], deleteUser);

// Specialties
router.get('/specialties', getSpecialties);

// Appointments overview
router.get('/appointments', getAllAppointments);

export default router;

