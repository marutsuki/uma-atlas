import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { generalLimiter } from '../middleware/rateLimiter';
import { errorHandler, notFound } from '../middleware/errorHandler';

// Import routes
import authRoutes from './iam/routes/authRoutes';
import userRoutes from './iam/routes/userRoutes';
import { PORT } from '@/config/api';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/iam/auth', authRoutes);
app.use('/api/iam/users', userRoutes);


console.log(`📊 Health check: http://localhost:${PORT}/health`);
console.log(`🔐 Auth API: http://localhost:${PORT}/api/iam/auth`);
console.log(`👥 Users API: http://localhost:${PORT}/api/iam/users`);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;
