import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, requireAdmin } from '../../../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', requireAdmin, userController.getAllUsers.bind(userController));

// Protected routes (user can access their own data, admin can access any)
router.get('/:id', userController.getUserById.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;
