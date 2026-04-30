import { Router } from 'express';
import {
  getMe,
  loginWithPin,
  refreshToken,
  resetPin,
  sendOtp,
  setPin,
  verifyOtp,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/send-otp',
  validate({
    body: {
      mobile: { required: true, pattern: /^\d{10}$/ },
      purpose: { required: true, enum: ['login', 'register', 'forgot_pin'] },
    },
  }),
  sendOtp,
);
router.post(
  '/verify-otp',
  validate({
    body: {
      mobile: { required: true, pattern: /^\d{10}$/ },
      otp: { required: true, pattern: /^\d{6}$/ },
      purpose: { required: true, enum: ['login', 'register', 'forgot_pin'] },
    },
  }),
  verifyOtp,
);
router.post(
  '/set-pin',
  validate({
    body: {
      name: { required: true, type: 'string', min: 2, max: 100 },
      pin: { required: true, pattern: /^\d{4}$/ },
      mode: { required: true, enum: ['individual', 'hotel'] },
    },
  }),
  setPin,
);
router.post(
  '/login',
  validate({
    body: {
      mobile: { required: true, pattern: /^\d{10}$/ },
      pin: { required: true, pattern: /^\d{4}$/ },
    },
  }),
  loginWithPin,
);
router.post('/reset-pin', validate({ body: { pin: { required: true, pattern: /^\d{4}$/ } } }), resetPin);
router.post('/refresh', validate({ body: { refreshToken: { required: true, type: 'string' } } }), refreshToken);
router.get('/me', authenticate, getMe);

export default router;
