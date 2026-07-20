import rateLimit from 'express-rate-limit';
import config from '../config';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimiter.window,
  max: config.rateLimiter.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});
