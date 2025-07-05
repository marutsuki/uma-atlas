export type Role = "USER" | "ADMIN"

export type User = {
    id: string,
    email: string,
    username: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
};

export type AuthResponse = {
    user: User;
    token: string;
}

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
}