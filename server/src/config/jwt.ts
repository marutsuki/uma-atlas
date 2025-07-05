import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600000');

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.verify(token, secret) as JwtPayload;
};
