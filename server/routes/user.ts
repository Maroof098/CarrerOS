import express from 'express';
import { getProfile, updateProfile, getStats } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);

export default router;
