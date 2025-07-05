import { Role } from '@prisma/client';

export interface CreateUserRequest {
    email: string;
    username: string;
    password: string;
    role?: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    email?: string;
    username?: string;
    password?: string;
    role?: Role;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginResponse {
    user: UserResponse;
    token: string;
}

export const toUserResponse = (user: any): UserResponse => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
