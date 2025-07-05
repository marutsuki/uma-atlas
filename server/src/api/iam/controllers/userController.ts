import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { UpdateUserRequest } from '../models/User';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class UserController {
    async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateUserRequest = req.body;

            // Check if user is updating their own profile or is an admin
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            if (req.user.userId !== id && req.user.role !== 'ADMIN') {
                res.status(403).json({ error: 'You can only update your own profile' });
                return;
            }

            const updatedUser = await userService.updateUser(id, updateData);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            // Check if user is deleting their own profile or is an admin
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            if (req.user.userId !== id && req.user.role !== 'ADMIN') {
                res.status(403).json({ error: 'You can only delete your own profile' });
                return;
            }

            await userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
