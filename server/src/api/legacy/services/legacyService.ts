import { legacyDao } from '../dao/legacyDao';
import { CreateLegacyRequest, UpdateLegacyRequest, toLegacyResponse, LegacyResponse, SparkType, CreateBlueSparkRequest, CreatePinkSparkRequest, UpdateBlueSparkRequest, UpdatePinkSparkRequest } from '../models/Legacy';
import { ApiError } from '../../../middleware/errorHandler';
import { MIN_STARS, MAX_STARS } from '../../../constants/legacy';
import { BlueSparkType, PinkSparkType } from '@prisma/client';

export class LegacyService {
    async getAllLegacies(): Promise<LegacyResponse[]> {
        const legacies = await legacyDao.findAll();
        return legacies.map(toLegacyResponse);
    }

    async getLegacyById(id: string): Promise<LegacyResponse> {
        const legacy = await legacyDao.findById(id);
        if (!legacy) {
            const error = new Error('Legacy not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        return toLegacyResponse(legacy);
    }

    async getLegaciesByUserId(userId: string): Promise<LegacyResponse[]> {
        const legacies = await legacyDao.findByUserId(userId);
        return legacies.map(toLegacyResponse);
    }

    async getActiveLegacyByUserId(userId: string): Promise<LegacyResponse | null> {
        const legacy = await legacyDao.findActiveByUserId(userId);
        return legacy ? toLegacyResponse(legacy) : null;
    }

    async createLegacy(userId: string, legacyData: CreateLegacyRequest): Promise<LegacyResponse> {
        if (!legacyData.blueSpark && !legacyData.pinkSpark) {
            const error = new Error('At least one spark (blue or pink) must be provided') as ApiError;
            error.statusCode = 400;
            throw error;
        }

        if (legacyData.blueSpark) {
            if (!legacyData.blueSpark.stars || !legacyData.blueSpark.type) {
                const error = new Error('Create Blue Spark request must include both the [stars] and [type] properties') as ApiError;
                error.statusCode = 400;
                throw error;
            }
            this.validateSpark('Blue', legacyData.blueSpark);
        }
        if (legacyData.pinkSpark) {
            if (!legacyData.pinkSpark.stars || !legacyData.pinkSpark.type) {
                const error = new Error('Create Blue Spark request must include both the [stars] and [type] properties') as ApiError;
                error.statusCode = 400;
                throw error;
            }
            this.validateSpark('Pink', legacyData.pinkSpark);
        }

        // Deactivate existing active legacies for the user
        await legacyDao.deactivateUserLegacies(userId);

        try {
            const newLegacy = await legacyDao.create(userId, legacyData);
            return toLegacyResponse(newLegacy);
        } catch (error: unknown) {
            console.error('Failed to create legacy, payload:', legacyData);
            throw new Error('Failed to create legacy');
        }
    }

    async updateLegacy(id: string, updateData: UpdateLegacyRequest, requestingUserId: string, isAdmin: boolean): Promise<LegacyResponse> {
        const existingLegacy = await legacyDao.findById(id);
        if (!existingLegacy) {
            const error = new Error('Legacy not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        // Check ownership or admin privileges
        if (!isAdmin && existingLegacy.userId !== requestingUserId) {
            const error = new Error('You can only update your own legacies') as ApiError;
            error.statusCode = 403;
            throw error;
        }

        // Validate spark star values if provided
        updateData.blueSpark && this.validateSpark('Blue', updateData.blueSpark);
        updateData.pinkSpark && this.validateSpark('Pink', updateData.pinkSpark);

        // If setting this legacy as active, deactivate other legacies for the user
        if (updateData.active === true) {
            await legacyDao.deactivateUserLegacies(existingLegacy.userId);
        }

        // Update the legacy
        const updatedLegacy = await legacyDao.update(id, updateData);
        return toLegacyResponse(updatedLegacy);
    }

    async deleteLegacy(id: string, requestingUserId: string, isAdmin: boolean): Promise<void> {
        const existingLegacy = await legacyDao.findById(id);
        if (!existingLegacy) {
            const error = new Error('Legacy not found') as ApiError;
            error.statusCode = 404;
            throw error;
        }

        // Check ownership or admin privileges
        if (!isAdmin && existingLegacy.userId !== requestingUserId) {
            const error = new Error('You can only delete your own legacies') as ApiError;
            error.statusCode = 403;
            throw error;
        }

        await legacyDao.delete(id);
    }

    private validateSpark(sparkType: SparkType, payload: CreateBlueSparkRequest | CreatePinkSparkRequest | UpdateBlueSparkRequest | UpdatePinkSparkRequest): void {
        if (payload.stars) {
            const stars = payload.stars;
            if (!Number.isInteger(stars) || stars < MIN_STARS || stars > MAX_STARS) {
                const error = new Error(`Stars must be between ${MIN_STARS} and ${MAX_STARS}`) as ApiError;
                error.statusCode = 400;
                throw error;
            }
        }

        if (payload.type) {
            const type = payload.type;

            switch (sparkType) {
                case 'Blue':
                    if (!(type in BlueSparkType)) {
                        const error = new Error(`BlueSparkType must be one of the following: ${Object.values(BlueSparkType)}`) as ApiError;
                        error.statusCode = 400;
                        throw error;
                    }
                    break;
                case 'Pink':
                    if (!(type in PinkSparkType)) {
                        const error = new Error(`BlueSparkType must be one of the following: ${Object.values(PinkSparkType)}`) as ApiError;
                        error.statusCode = 400;
                        throw error;
                    }
                    break;
            }
        }
    }
}

export const legacyService = new LegacyService();
