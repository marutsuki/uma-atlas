import { Request, Response, NextFunction } from 'express';
import { legacyService } from '../services/legacyService';
import { CreateLegacyRequest, UpdateLegacyRequest } from '../models/Legacy';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class LegacyController {
    async getAllLegacies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const legacies = await legacyService.getAllLegacies();
            res.status(200).json(legacies);
        } catch (error) {
            next(error);
        }
    }

    async getLegacyById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const legacy = await legacyService.getLegacyById(id);
            res.status(200).json(legacy);
        } catch (error) {
            next(error);
        }
    }

    async getLegaciesByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const legacies = await legacyService.getLegaciesByUserId(userId);
            res.status(200).json(legacies);
        } catch (error) {
            next(error);
        }
    }

    async getActiveLegacyByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const legacy = await legacyService.getActiveLegacyByUserId(userId);

            if (!legacy) {
                res.status(404).json({ error: 'No active legacy found for this user' });
                return;
            }

            res.status(200).json(legacy);
        } catch (error) {
            next(error);
        }
    }

    async createLegacy(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            const legacyData: CreateLegacyRequest = req.body;
            const newLegacy = await legacyService.createLegacy(req.user.userId, legacyData);
            res.status(201).json(newLegacy);
        } catch (error) {
            next(error);
        }
    }

    async updateLegacy(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            const { id } = req.params;
            const updateData: UpdateLegacyRequest = req.body;
            const isAdmin = req.user.role === 'ADMIN';

            const updatedLegacy = await legacyService.updateLegacy(id, updateData, req.user.userId, isAdmin);
            res.status(200).json(updatedLegacy);
        } catch (error) {
            next(error);
        }
    }

    async deleteLegacy(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            const { id } = req.params;
            const isAdmin = req.user.role === 'ADMIN';

            await legacyService.deleteLegacy(id, req.user.userId, isAdmin);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const legacyController = new LegacyController();
