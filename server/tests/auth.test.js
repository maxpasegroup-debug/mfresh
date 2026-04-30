const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_min_32_characters';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars';

const mockOtpModel = {
  create: jest.fn(),
  findValid: jest.fn(),
  markVerified: jest.fn(),
  countRecentByMobile: jest.fn(),
};

const mockUserModel = {
  findByMobile: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updatePin: jest.fn(),
};

const mockVendorModel = {
  findByUserId: jest.fn(),
};

const mockOtpService = {
  generateOtp: jest.fn(),
  hashOtp: jest.fn(),
  verifyOtp: jest.fn(),
  sendOtp: jest.fn(),
};

jest.mock('../src/models/otp.model.js', () => mockOtpModel);
jest.mock('../src/models/user.model.js', () => mockUserModel);
jest.mock('../src/models/vendor.model.js', () => mockVendorModel);
jest.mock('../src/services/otp.service.js', () => mockOtpService);

const app = require('../src/app.js').default;

function otpToken(mobile = '9876543210', purpose = 'login') {
  return jwt.sign({ mobile, purpose, verified: true }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function accessToken(userId = 'user-1') {
  return jwt.sign(
    { userId, role: 'user', mode: 'individual' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function expiredAccessToken(userId = 'user-1') {
  return jwt.sign(
    { userId, role: 'user', mode: 'individual' },
    process.env.JWT_SECRET,
    { expiresIn: '-1s' },
  );
}

describe('auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpService.generateOtp.mockReturnValue('123456');
    mockOtpService.hashOtp.mockResolvedValue('hashed-otp');
    mockOtpService.verifyOtp.mockResolvedValue(true);
    mockOtpService.sendOtp.mockResolvedValue({ success: true, dev: true, otp: '123456' });
    mockOtpModel.create.mockResolvedValue({ id: 'otp-1' });
    mockOtpModel.countRecentByMobile.mockResolvedValue(0);
    mockOtpModel.markVerified.mockResolvedValue({ id: 'otp-1', verified: true });
  });

  test('sendOtp accepts a valid mobile', async () => {
    const response = await request(app)
      .post('/api/auth/send-otp')
      .send({ mobile: '9876543210', purpose: 'login' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, expiresIn: 600, otp: '123456' });
    expect(mockOtpModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mobile: '9876543210',
        otp_hash: 'hashed-otp',
        purpose: 'login',
      }),
    );
  });

  test('sendOtp rejects an invalid mobile', async () => {
    const response = await request(app)
      .post('/api/auth/send-otp')
      .send({ mobile: '98765', purpose: 'login' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('sendOtp rate limits after three requests in ten minutes', async () => {
    mockOtpModel.countRecentByMobile.mockResolvedValue(3);

    const response = await request(app)
      .post('/api/auth/send-otp')
      .send({ mobile: '9876543210', purpose: 'login' });

    expect(response.status).toBe(429);
  });

  test('verifyOtp accepts a valid OTP', async () => {
    mockOtpModel.findValid.mockResolvedValue({ id: 'otp-1', otp_hash: 'hashed-otp' });
    mockUserModel.findByMobile.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/verify-otp')
      .send({ mobile: '9876543210', otp: '123456', purpose: 'register' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.isNewUser).toBe(true);
    expect(response.body.otpToken).toEqual(expect.any(String));
  });

  test('verifyOtp rejects a wrong OTP', async () => {
    mockOtpModel.findValid.mockResolvedValue({ id: 'otp-1', otp_hash: 'hashed-otp' });
    mockOtpService.verifyOtp.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/verify-otp')
      .send({ mobile: '9876543210', otp: '111111', purpose: 'login' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid or expired OTP');
  });

  test('verifyOtp rejects an expired OTP', async () => {
    mockOtpModel.findValid.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/verify-otp')
      .send({ mobile: '9876543210', otp: '123456', purpose: 'login' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid or expired OTP');
  });

  test('loginWithPin accepts the correct PIN', async () => {
    const pinHash = await bcrypt.hash('1234', 12);
    mockUserModel.findByMobile.mockResolvedValue({
      id: 'user-1',
      mobile: '9876543210',
      name: 'Arun',
      role: 'user',
      mode: 'individual',
      is_active: true,
      pin_hash: pinHash,
    });

    const response = await request(app)
      .post('/api/auth/login')
      .set('Authorization', `Bearer ${otpToken()}`)
      .send({ mobile: '9876543210', pin: '1234' });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
  });

  test('loginWithPin rejects the wrong PIN', async () => {
    const pinHash = await bcrypt.hash('1234', 12);
    mockUserModel.findByMobile.mockResolvedValue({
      id: 'user-1',
      mobile: '9876543210',
      role: 'user',
      mode: 'individual',
      is_active: true,
      pin_hash: pinHash,
    });

    const response = await request(app)
      .post('/api/auth/login')
      .set('Authorization', `Bearer ${otpToken()}`)
      .send({ mobile: '9876543210', pin: '9999' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid PIN');
  });

  test('authenticate middleware accepts a valid token', async () => {
    mockUserModel.findById.mockResolvedValue({
      id: 'user-1',
      mobile: '9876543210',
      name: 'Arun',
      role: 'user',
      mode: 'individual',
      is_active: true,
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('user-1');
  });

  test('authenticate middleware rejects a missing token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });

  test('authenticate middleware rejects an expired token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredAccessToken()}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token expired');
  });
});
