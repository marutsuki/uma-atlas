import { BlueSparkType, PinkSparkType } from '@prisma/client';

export type SparkType = 'Blue' | 'Pink';

export interface CreateBlueSparkRequest {
    type: BlueSparkType;
    stars: number;
}

export interface CreatePinkSparkRequest {
    type: PinkSparkType;
    stars: number;
}

export interface CreateLegacyRequest {
    blueSpark?: CreateBlueSparkRequest;
    pinkSpark?: CreatePinkSparkRequest;
}

export interface UpdateBlueSparkRequest {
    type?: BlueSparkType;
    stars?: number;
}

export interface UpdatePinkSparkRequest {
    type?: PinkSparkType;
    stars?: number;
}

export interface UpdateLegacyRequest {
    active?: boolean;
    blueSpark?: UpdateBlueSparkRequest;
    pinkSpark?: UpdatePinkSparkRequest;
}

export interface BlueSparkResponse {
    type: BlueSparkType;
    stars: number;
}

export interface PinkSparkResponse {
    type: PinkSparkType;
    stars: number;
}

export interface LegacyResponse {
    id: string;
    active: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    blueSpark?: BlueSparkResponse;
    pinkSpark?: PinkSparkResponse;
    user?: {
        id: string;
        username: string;
        friendCode: string;
    };
}

export const toLegacyResponse = (legacy: any): LegacyResponse => {
    return {
        id: legacy.id,
        active: legacy.active,
        userId: legacy.userId,
        createdAt: legacy.createdAt,
        updatedAt: legacy.updatedAt,
        blueSpark: legacy.blueSpark ? {
            type: legacy.blueSpark.type,
            stars: legacy.blueSpark.stars,
        } : undefined,
        pinkSpark: legacy.pinkSpark ? {
            type: legacy.pinkSpark.type,
            stars: legacy.pinkSpark.stars,
        } : undefined,
        user: legacy.user ? {
            id: legacy.user.id,
            username: legacy.user.username,
            friendCode: legacy.user.friendCode,
        } : undefined,
    };
};
