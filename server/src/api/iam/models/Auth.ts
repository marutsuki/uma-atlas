export interface AuthTokens {
    accessToken: string;
    expiresIn: string;
}

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    role: string;
}

export interface AuthResponse {
    user: AuthUser;
    tokens: AuthTokens;
}
