import bcrypt from 'bcryptjs';
import { generateToken } from '../../../config/jwt';
import { userDao } from '../dao/userDao';
import { CreateUserRequest, LoginRequest, LoginResponse, toUserResponse } from '../models/User';
import { ApiError } from '../../../middleware/errorHandler';

export class AuthService {
    async register(userData: CreateUserRequest): Promise<LoginResponse> {
        // Check if user already exists
        const existingUserByEmail = await userDao.existsByEmail(userData.email);
        if (existingUserByEmail) {
            const error = new Error('User with this email already exists') as ApiError;
            error.statusCode = 400;
            throw error;
        }

        const existingUserByUsername = await userDao.existsByUsername(userData.username);
        if (existingUserByUsername) {
            const error = new Error('User with this username already exists') as ApiError;
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const user = await userDao.create({
            ...userData,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return {
            user: toUserResponse(user),
            token
        };
    }

    async login(loginData: LoginRequest): Promise<LoginResponse> {
        // Find user by email
        const user = await userDao.findByEmail(loginData.email);
        if (!user) {
            const error = new Error('Invalid email or password') as ApiError;
            error.statusCode = 401;
            throw error;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password') as ApiError;
            error.statusCode = 401;
            throw error;
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return {
            user: toUserResponse(user),
            token
        };
    }

    async getCurrentUser(userId: string): Promise<any> {
        const user = await userDao.findById(userId);
        if (!user) {
            const error = new Error('User not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        return toUserResponse(user);
    }
}

export const authService = new AuthService();
