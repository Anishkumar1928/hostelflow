import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiResponse';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, source: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new ApiError(400, message));
      }
      next(error);
    }
  };
};
