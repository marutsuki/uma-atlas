import app from './api/app';
import { PORT } from './config/api';
import prisma from './config/database';

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
});

startServer();
