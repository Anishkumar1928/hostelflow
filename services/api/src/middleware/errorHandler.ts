import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiResponse';
import logger from '../utils/logger';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
