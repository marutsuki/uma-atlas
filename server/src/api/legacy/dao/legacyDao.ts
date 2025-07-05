import prisma from '../../../config/database';
import { Legacy, BlueSpark, PinkSpark } from '@prisma/client';
import { CreateLegacyRequest, UpdateLegacyRequest } from '../models/Legacy';

export type LegacyWithSparks = Legacy & {
    blueSpark?: BlueSpark | null;
    pinkSpark?: PinkSpark | null;
    user?: {
        id: string;
        username: string;
        friendCode: string;
    };
};

export class LegacyDao {
    async findAll(): Promise<LegacyWithSparks[]> {
        return await prisma.legacy.findMany({
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }) as LegacyWithSparks[];
    }

    async findById(id: string): Promise<LegacyWithSparks | null> {
        return await prisma.legacy.findUnique({
            where: { id },
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            }
        }) as LegacyWithSparks | null;
    }

    async findByUserId(userId: string): Promise<LegacyWithSparks[]> {
        return await prisma.legacy.findMany({
            where: { userId },
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }) as LegacyWithSparks[];
    }

    async findActiveByUserId(userId: string): Promise<LegacyWithSparks | null> {
        return await prisma.legacy.findFirst({
            where: {
                userId,
                active: true
            } as any,
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            }
        }) as LegacyWithSparks | null;
    }

    async deactivateUserLegacies(userId: string): Promise<void> {
        await prisma.legacy.updateMany({
            where: {
                userId,
                active: true
            } as any,
            data: { active: false } as any
        });
    }

    async create(userId: string, legacyData: CreateLegacyRequest): Promise<LegacyWithSparks> {
        return await prisma.legacy.create({
            data: {
                userId,
                active: true,
                blueSpark: legacyData.blueSpark ? {
                    create: {
                        type: legacyData.blueSpark.type,
                        stars: legacyData.blueSpark.stars,
                    }
                } : undefined,
                pinkSpark: legacyData.pinkSpark ? {
                    create: {
                        type: legacyData.pinkSpark.type,
                        stars: legacyData.pinkSpark.stars,
                    }
                } : undefined,
            } as any,
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            }
        }) as LegacyWithSparks;
    }

    async update(id: string, updateData: UpdateLegacyRequest): Promise<LegacyWithSparks> {
        // Handle spark updates separately due to one-to-one relationship constraints
        const updateOperations: any = {};

        if (updateData.active !== undefined) {
            updateOperations.active = updateData.active;
        }

        // Update the legacy first
        const updatedLegacy = await prisma.legacy.update({
            where: { id },
            data: updateOperations,
            include: {
                blueSpark: true,
                pinkSpark: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        friendCode: true,
                    }
                }
            }
        }) as LegacyWithSparks;

        // Handle BlueSpark update/creation
        if (updateData.blueSpark) {
            if (updatedLegacy.blueSpark) {
                // Update existing BlueSpark
                await prisma.blueSpark.update({
                    where: { legacyId: id },
                    data: {
                        ...(updateData.blueSpark.type && { type: updateData.blueSpark.type }),
                        ...(updateData.blueSpark.stars !== undefined && { stars: updateData.blueSpark.stars }),
                    }
                });
            } else {
                // Create new BlueSpark
                await prisma.blueSpark.create({
                    data: {
                        legacyId: id,
                        type: updateData.blueSpark.type!,
                        stars: updateData.blueSpark.stars!,
                    }
                });
            }
        }

        // Handle PinkSpark update/creation
        if (updateData.pinkSpark) {
            if (updatedLegacy.pinkSpark) {
                // Update existing PinkSpark
                await prisma.pinkSpark.update({
                    where: { legacyId: id },
                    data: {
                        ...(updateData.pinkSpark.type && { type: updateData.pinkSpark.type }),
                        ...(updateData.pinkSpark.stars !== undefined && { stars: updateData.pinkSpark.stars }),
                    }
                });
            } else {
                // Create new PinkSpark
                await prisma.pinkSpark.create({
                    data: {
                        legacyId: id,
                        type: updateData.pinkSpark.type!,
                        stars: updateData.pinkSpark.stars!,
                    }
                });
            }
        }

        // Return the updated legacy with all relations
        return await this.findById(id) as LegacyWithSparks;
    }

    async delete(id: string): Promise<Legacy> {
        // Delete related sparks first (cascade should handle this, but being explicit)
        await prisma.blueSpark.deleteMany({
            where: { legacyId: id }
        });

        await prisma.pinkSpark.deleteMany({
            where: { legacyId: id }
        });

        return await prisma.legacy.delete({
            where: { id }
        });
    }

    async exists(id: string): Promise<boolean> {
        const legacy = await prisma.legacy.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!legacy;
    }
}

export const legacyDao = new LegacyDao();
