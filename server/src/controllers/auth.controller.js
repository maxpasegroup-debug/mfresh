import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as otpModel from '../models/otp.model.js';
import * as userModel from '../models/user.model.js';
import * as vendorModel from '../models/vendor.model.js';
import * as otpService from '../services/otp.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

const purposes = ['login', 'register', 'forgot_pin'];
const modes = ['individual', 'hotel'];

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateMobile(mobile) {
  return typeof mobile === 'string' && /^\d{10}$/.test(mobile);
}

function validateOtp(otp) {
  return typeof otp === 'string' && /^\d{6}$/.test(otp);
}

function validatePin(pin) {
  return typeof pin === 'string' && /^\d{4}$/.test(pin);
}

function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100;
}

function validatePurpose(purpose) {
  return purposes.includes(purpose);
}

function signOtpToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw httpError(500, 'JWT_SECRET is required');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function verifyOtpToken(req, expectedPurpose) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw httpError(401, 'OTP token required');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded.verified || decoded.purpose !== expectedPurpose || !validateMobile(decoded.mobile)) {
    throw httpError(401, 'Invalid OTP token');
  }

  return decoded;
}

function publicUser(user) {
  return {
    id: user.id,
    mobile: user.mobile,
    name: user.name,
    role: user.role,
    mode: user.mode,
  };
}

function issueTokens(user) {
  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    mode: user.mode,
  });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return { accessToken, refreshToken };
}

export const sendOtp = asyncHandler(async (req, res) => {
  const { mobile, purpose } = req.body;

  if (!validateMobile(mobile)) {
    throw httpError(400, 'Mobile must be exactly 10 digits');
  }

  if (!validatePurpose(purpose)) {
    throw httpError(400, 'Invalid purpose');
  }

  const recentCount = await otpModel.countRecentByMobile(mobile, 10);

  if (recentCount >= 3) {
    throw httpError(429, 'Too many OTP requests. Try again later.');
  }

  const otp = otpService.generateOtp();
  const otp_hash = await otpService.hashOtp(otp);
  const expires_at = new Date(Date.now() + 10 * 60 * 1000);

  await otpModel.create({ mobile, otp_hash, purpose, expires_at });

  const result = await otpService.sendOtp(mobile, otp);

  if (!result.success) {
    throw httpError(502, result.error || 'Failed to send OTP');
  }

  res.json({
    success: true,
    expiresIn: 600,
    ...(process.env.NODE_ENV !== 'production' ? { otp } : {}),
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp, purpose } = req.body;

  if (!validateMobile(mobile)) {
    throw httpError(400, 'Mobile must be exactly 10 digits');
  }

  if (!validateOtp(otp)) {
    throw httpError(400, 'OTP must be exactly 6 digits');
  }

  if (!validatePurpose(purpose)) {
    throw httpError(400, 'Invalid purpose');
  }

  const otpRecord = await otpModel.findValid(mobile, purpose);

  if (!otpRecord) {
    throw httpError(400, 'Invalid or expired OTP');
  }

  const isValid = await otpService.verifyOtp(otp, otpRecord.otp_hash);

  if (!isValid) {
    throw httpError(400, 'Invalid or expired OTP');
  }

  await otpModel.markVerified(otpRecord.id);

  const user = await userModel.findByMobile(mobile);
  const otpToken = signOtpToken({ mobile, purpose, verified: true });

  res.json({
    success: true,
    isNewUser: !user,
    otpToken,
  });
});

export const setPin = asyncHandler(async (req, res) => {
  const { name, pin, mode = 'individual' } = req.body;
  const token = verifyOtpToken(req, 'register');
  const trimmedName = typeof name === 'string' ? name.trim() : '';

  if (!validateName(trimmedName)) {
    throw httpError(400, 'Name must be 2-100 characters');
  }

  if (!validatePin(pin)) {
    throw httpError(400, 'PIN must be exactly 4 digits');
  }

  if (!modes.includes(mode)) {
    throw httpError(400, 'Invalid mode');
  }

  const existingUser = await userModel.findByMobile(token.mobile);

  if (existingUser) {
    throw httpError(409, 'User already exists');
  }

  const pin_hash = await bcrypt.hash(pin, 12);
  const user = await userModel.create({
    mobile: token.mobile,
    name: trimmedName,
    pin_hash,
    role: 'user',
    mode,
  });
  const tokens = issueTokens(user);

  res.status(201).json({
    success: true,
    user: publicUser(user),
    ...tokens,
  });
});

export const loginWithPin = asyncHandler(async (req, res) => {
  const { mobile, pin } = req.body;
  const token = verifyOtpToken(req, 'login');

  if (!validateMobile(mobile) || mobile !== token.mobile) {
    throw httpError(400, 'Mobile must match verified OTP');
  }

  if (!validatePin(pin)) {
    throw httpError(400, 'PIN must be exactly 4 digits');
  }

  const user = await userModel.findByMobile(mobile);

  if (!user) {
    throw httpError(404, 'User not found');
  }

  const isPinValid = user.pin_hash ? await bcrypt.compare(pin, user.pin_hash) : false;

  if (!isPinValid) {
    throw httpError(401, 'Invalid PIN');
  }

  if (!user.is_active) {
    throw httpError(403, 'Account suspended');
  }

  const tokens = issueTokens(user);

  res.json({
    success: true,
    user: publicUser(user),
    ...tokens,
  });
});

export const resetPin = asyncHandler(async (req, res) => {
  const { pin } = req.body;
  const token = verifyOtpToken(req, 'forgot_pin');

  if (!validatePin(pin)) {
    throw httpError(400, 'PIN must be exactly 4 digits');
  }

  const user = await userModel.findByMobile(token.mobile);

  if (!user) {
    throw httpError(404, 'User not found');
  }

  const pin_hash = await bcrypt.hash(pin, 12);
  await userModel.updatePin(user.id, pin_hash);

  res.json({ success: true, message: 'PIN updated' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw httpError(400, 'Refresh token required');
  }

  const decoded = verifyRefreshToken(token);
  const user = await userModel.findById(decoded.userId);

  if (!user || !user.is_active) {
    throw httpError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    mode: user.mode,
  });

  res.json({ accessToken });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.userId);

  if (!user || !user.is_active) {
    throw httpError(401, 'User not found');
  }

  const response = { user: publicUser(user) };

  if (user.role === 'vendor') {
    response.vendor = await vendorModel.findByUserId(user.id);
  }

  res.json(response);
});
