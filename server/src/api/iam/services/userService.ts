import bcrypt from 'bcryptjs';
import { userDao } from '../dao/userDao';
import { UpdateUserRequest, toUserResponse, UserResponse } from '../models/User';
import { ApiError } from '../../../middleware/errorHandler';

export class UserService {
    async getAllUsers(): Promise<UserResponse[]> {
        const users = await userDao.findAll();
        return users.map(toUserResponse);
    }

    async getUserById(id: string): Promise<UserResponse> {
        const user = await userDao.findById(id);
        if (!user) {
            const error = new Error('User not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        return toUserResponse(user);
    }

    async updateUser(id: string, updateData: UpdateUserRequest): Promise<UserResponse> {
        const existingUser = await userDao.findById(id);
        if (!existingUser) {
            const error = new Error('User not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        // Check if email is being updated and if it's already taken
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await userDao.existsByEmail(updateData.email);
            if (emailExists) {
                const error = new Error('Email is already taken') as ApiError;
                error.statusCode = 400;
                throw error;
            }
        }

        // Check if username is being updated and if it's already taken
        if (updateData.username && updateData.username !== existingUser.username) {
            const usernameExists = await userDao.existsByUsername(updateData.username);
            if (usernameExists) {
                const error = new Error('Username is already taken') as ApiError;
                error.statusCode = 400;
                throw error;
            }
        }

        // Hash password if it's being updated
        const dataToUpdate = { ...updateData };
        if (updateData.password) {
            dataToUpdate.password = await bcrypt.hash(updateData.password, 12);
        }

        const updatedUser = await userDao.update(id, dataToUpdate);
        return toUserResponse(updatedUser);
    }

    async deleteUser(id: string): Promise<void> {
        const existingUser = await userDao.findById(id);
        if (!existingUser) {
            const error = new Error('User not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        await userDao.delete(id);
    }
}

export const userService = new UserService();
