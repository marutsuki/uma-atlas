import prisma from '../../../config/database';
import { User, Role } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';

export class UserDao {
    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { username }
        });
    }

    async findAll(): Promise<User[]> {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(userData: CreateUserRequest): Promise<User> {
        return await prisma.user.create({
            data: {
                email: userData.email,
                username: userData.username,
                password: userData.password,
                role: userData.role || Role.USER
            }
        });
    }

    async update(id: string, userData: UpdateUserRequest): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data: userData
        });
    }

    async delete(id: string): Promise<User> {
        return await prisma.user.delete({
            where: { id }
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return !!user;
    }

    async existsByUsername(username: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        });
        return !!user;
    }
}

export const userDao = new UserDao();
