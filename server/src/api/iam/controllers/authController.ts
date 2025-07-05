import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { CreateUserRequest, LoginRequest } from '../models/User';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData: CreateUserRequest = req.body;

            // Basic validation
            if (!userData.email || !userData.username || !userData.password) {
                res.status(400).json({ error: 'Email, username, and password are required' });
                return;
            }

            const result = await authService.register(userData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loginData: LoginRequest = req.body;

            // Basic validation
            if (!loginData.email || !loginData.password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const result = await authService.login(loginData);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            const user = await authService.getCurrentUser(req.user.userId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
