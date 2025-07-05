import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    console.error(`Error ${statusCode}: ${message}`);
    console.error(error.stack);

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
    error.statusCode = 404;
    next(error);
};
