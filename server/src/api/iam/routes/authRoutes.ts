import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../../../middleware/auth';
import { authLimiter } from '../../../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

export default router;
