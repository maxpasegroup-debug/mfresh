const jwt = require('jsonwebtoken');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_min_32_characters';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars';

const mockProductModel = {
  list: jest.fn(),
  listByVendor: jest.fn(),
  findById: jest.fn(),
  findByIdWithVendor: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  countActiveByCategory: jest.fn(),
};

const mockCategoryModel = {
  findById: jest.fn(),
};

const mockVendorModel = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
};

const mockCloudinaryService = {
  uploadMultiple: jest.fn(),
  deleteImage: jest.fn(),
};

jest.mock('../src/models/product.model.js', () => mockProductModel);
jest.mock('../src/models/category.model.js', () => mockCategoryModel);
jest.mock('../src/models/vendor.model.js', () => mockVendorModel);
jest.mock('../src/services/cloudinary.service.js', () => mockCloudinaryService);

const app = require('../src/app.js').default;

function vendorToken(userId = 'user-vendor') {
  return jwt.sign(
    { userId, role: 'vendor', mode: 'individual' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

describe('product API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductModel.list.mockResolvedValue({
      products: [{ id: 'product-1', name: 'Milk', is_active: true }],
      total: 1,
    });
    mockCategoryModel.findById.mockResolvedValue({ id: 'category-1', name: 'Dairy' });
    mockVendorModel.findByUserId.mockResolvedValue({ id: 'vendor-1', user_id: 'user-vendor' });
    mockCloudinaryService.uploadMultiple.mockResolvedValue([
      { url: 'https://res.cloudinary.com/demo/image/upload/product.jpg', public_id: 'products/product' },
    ]);
  });

  test('listProducts returns paginated results', async () => {
    const response = await request(app).get('/api/products?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ total: 1, page: 1, totalPages: 1 });
    expect(response.body.products).toHaveLength(1);
  });

  test('listProducts supports category filter', async () => {
    await request(app).get('/api/products?category=dairy');

    expect(mockProductModel.list).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: 'dairy' }),
    );
  });

  test('listProducts supports search query', async () => {
    await request(app).get('/api/products?search=milk');

    expect(mockProductModel.list).toHaveBeenCalledWith(expect.objectContaining({ search: 'milk' }));
  });

  test('getProduct returns found product', async () => {
    mockProductModel.findByIdWithVendor.mockResolvedValue({
      id: 'product-1',
      name: 'Milk',
      is_active: true,
    });

    const response = await request(app).get('/api/products/product-1');

    expect(response.status).toBe(200);
    expect(response.body.product.id).toBe('product-1');
  });

  test('getProduct returns 404 when missing', async () => {
    mockProductModel.findByIdWithVendor.mockResolvedValue(null);

    const response = await request(app).get('/api/products/missing');

    expect(response.status).toBe(404);
  });

  test('createProduct accepts valid data with image', async () => {
    mockProductModel.create.mockResolvedValue({
      id: 'product-1',
      name: 'Milk',
      vendor_id: 'vendor-1',
      images: [{ public_id: 'products/product' }],
    });

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${vendorToken()}`)
      .field('name', 'Milk')
      .field('category_id', 'category-1')
      .field('price', '50')
      .field('mrp', '60')
      .field('unit', '1L')
      .field('stock', '10')
      .attach('images', Buffer.from('fake-image'), {
        filename: 'milk.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(201);
    expect(mockCloudinaryService.uploadMultiple).toHaveBeenCalled();
    expect(response.body.product.id).toBe('product-1');
  });

  test('createProduct rejects missing required fields', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${vendorToken()}`)
      .send({ name: 'Milk' });

    expect(response.status).toBe(400);
  });

  test('createProduct rejects price greater than MRP', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${vendorToken()}`)
      .send({
        name: 'Milk',
        category_id: 'category-1',
        price: 70,
        mrp: 60,
        unit: '1L',
        stock: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Price must be less than or equal to MRP');
  });

  test('updateProduct allows own product', async () => {
    mockProductModel.findById.mockResolvedValue({
      id: 'product-1',
      vendor_id: 'vendor-1',
      price: 50,
      mrp: 60,
      images: [],
    });
    mockProductModel.update.mockResolvedValue({ id: 'product-1', name: 'New Milk' });

    const response = await request(app)
      .put('/api/products/product-1')
      .set('Authorization', `Bearer ${vendorToken()}`)
      .send({ name: 'New Milk' });

    expect(response.status).toBe(200);
    expect(response.body.product.name).toBe('New Milk');
  });

  test('updateProduct rejects another vendor product', async () => {
    mockProductModel.findById.mockResolvedValue({
      id: 'product-1',
      vendor_id: 'vendor-2',
      price: 50,
      mrp: 60,
      images: [],
    });

    const response = await request(app)
      .put('/api/products/product-1')
      .set('Authorization', `Bearer ${vendorToken()}`)
      .send({ name: 'New Milk' });

    expect(response.status).toBe(403);
  });

  test('deleteProduct performs a soft delete', async () => {
    mockProductModel.findById.mockResolvedValue({
      id: 'product-1',
      vendor_id: 'vendor-1',
    });
    mockProductModel.update.mockResolvedValue({ id: 'product-1', is_active: false });

    const response = await request(app)
      .delete('/api/products/product-1')
      .set('Authorization', `Bearer ${vendorToken()}`);

    expect(response.status).toBe(200);
    expect(mockProductModel.update).toHaveBeenCalledWith('product-1', { is_active: false });
  });
});
