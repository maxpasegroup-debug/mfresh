import rateLimit from 'express-rate-limit';

function message(text) {
  return { success: false, message: text };
}

const skipInTest = () => process.env.NODE_ENV === 'test';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: message('Too many requests. Try again later.'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: message('Too many auth requests. Try again later.'),
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: message('Too many OTP requests. Try again later.'),
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: message('Too many uploads. Try again later.'),
});
