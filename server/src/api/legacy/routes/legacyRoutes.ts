import { Router } from 'express';
import { legacyController } from '../controllers/legacyController';
import { authenticate } from '../../../middleware/auth';

const router = Router();

// All legacy routes require authentication
router.use(authenticate);

// Public read routes (any authenticated user can view any legacy)
router.get('/', legacyController.getAllLegacies.bind(legacyController));
router.get('/user/:userId', legacyController.getLegaciesByUserId.bind(legacyController));
router.get('/user/:userId/active', legacyController.getActiveLegacyByUserId.bind(legacyController));
router.get('/:id', legacyController.getLegacyById.bind(legacyController));

// Protected write routes (user can modify their own, admin can modify any)
router.post('/', legacyController.createLegacy.bind(legacyController));
router.put('/:id', legacyController.updateLegacy.bind(legacyController));
router.delete('/:id', legacyController.deleteLegacy.bind(legacyController));

export default router;
