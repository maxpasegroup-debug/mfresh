const jwt = require('jsonwebtoken');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_min_32_characters';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars';

const mockQuery = jest.fn();
const mockUserModel = {
  findByMobile: jest.fn(),
  create: jest.fn(),
  updateProfile: jest.fn(),
};
const mockVendorModel = {
  listAll: jest.fn(),
  create: jest.fn(),
};
const mockOtpService = { sendOtp: jest.fn() };

jest.mock('../src/models/db.js', () => ({
  query: mockQuery,
  pool: {},
  withTransaction: jest.fn(),
}));
jest.mock('../src/models/user.model.js', () => mockUserModel);
jest.mock('../src/models/vendor.model.js', () => mockVendorModel);
jest.mock('../src/services/otp.service.js', () => mockOtpService);

const app = require('../src/app.js').default;

function token(role = 'admin') {
  return jwt.sign(
    { userId: 'user-1', role, mode: 'individual' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

describe('admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          {
            today_orders: 1,
            today_revenue: 100,
            week_orders: 3,
            week_revenue: 300,
            month_orders: 10,
            month_revenue: 1000,
            total_orders: 30,
            total_revenue: 3000,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            total_users: 5,
            total_vendors: 2,
            total_products: 9,
            pending_vendor_approvals: 1,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'order-1', order_number: 'MB1' }] });
    mockVendorModel.create.mockResolvedValue({ id: 'vendor-1', shop_name: 'Fresh Shop' });
    mockUserModel.findByMobile.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({ id: 'user-1', mobile: '9876543210', role: 'vendor' });
    mockOtpService.sendOtp.mockResolvedValue({ success: true });
  });

  test('getStats returns dashboard shape', async () => {
    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token('admin')}`);

    expect(response.status).toBe(200);
    expect(response.body.today).toEqual({ orders: 1, revenue: 100 });
    expect(response.body.pending_vendor_approvals).toBe(1);
    expect(response.body.recent_orders).toHaveLength(1);
  });

  test('requireAdmin blocks non-admins', async () => {
    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token('user')}`);

    expect(response.status).toBe(403);
  });

  test('admin vendor onboarding creates approved vendor', async () => {
    const response = await request(app)
      .post('/api/admin/vendors/onboard')
      .set('Authorization', `Bearer ${token('admin')}`)
      .send({
        mobile: '9876543210',
        owner_name: 'Asha',
        shop_name: 'Fresh Shop',
        city: 'Kochi',
        pincode: '682001',
      });

    expect(response.status).toBe(201);
    expect(mockVendorModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ is_approved: true, is_active: true }),
    );
  });
});
