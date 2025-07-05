import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@uma-atlas.com' },
        update: {},
        create: {
            email: 'admin@uma-atlas.com',
            username: 'admin',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@uma-atlas.com' },
        update: {},
        create: {
            email: 'user@uma-atlas.com',
            username: 'testuser',
            password: userPassword,
            role: Role.USER,
        },
    });

    console.log('✅ Seed completed successfully');
    console.log('👤 Admin user:', { id: admin.id, email: admin.email, username: admin.username });
    console.log('👤 Test user:', { id: user.id, email: user.email, username: user.username });
    console.log('🔑 Default passwords: admin123 (admin), user123 (user)');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
