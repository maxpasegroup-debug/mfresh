import * as categoryModel from '../models/category.model.js';
import * as productModel from '../models/product.model.js';
import * as vendorModel from '../models/vendor.model.js';
import * as cloudinaryService from '../services/cloudinary.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pageParams(req) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  return { page, limit, offset: (page - 1) * limit };
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  return value === true || value === 'true';
}

async function resolveVendor(req, bodyVendorId) {
  if (req.user.role === 'admin' && bodyVendorId) {
    const vendor = await vendorModel.findById(bodyVendorId);
    if (!vendor) throw httpError(404, 'Vendor not found');
    return vendor;
  }

  const vendor = await vendorModel.findByUserId(req.user.userId);
  if (!vendor) throw httpError(403, 'Vendor profile required');
  return vendor;
}

async function ensureProductOwnership(req, product) {
  if (req.user.role === 'admin') return;
  const vendor = await vendorModel.findByUserId(req.user.userId);
  if (!vendor) throw httpError(403, 'Vendor profile required');

  if (product.vendor_id !== vendor.id) {
    throw httpError(403, 'Cannot modify another vendor product');
  }
}

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = pageParams(req);
  const category = req.query.category;
  const categoryIsUuid =
    typeof category === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category);
  const result = await productModel.list({
    categoryId: categoryIsUuid ? category : undefined,
    categorySlug: category && !categoryIsUuid ? category : undefined,
    vendorId: req.query.vendor,
    search: req.query.search,
    featured: parseBoolean(req.query.featured),
    sort: req.query.sort,
    limit,
    offset,
  });

  res.json({
    products: result.products,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
  });
});

export const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const result = await productModel.list({ featured: true, limit: 10, offset: 0 });
  res.json({ products: result.products, total: result.total, page: 1, totalPages: 1 });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findByIdWithVendor(req.params.id);

  if (!product || !product.is_active) {
    throw httpError(404, 'Product not found');
  }

  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const required = ['name', 'category_id', 'price', 'mrp', 'unit', 'stock'];
  const missing = required.filter((field) => req.body[field] === undefined || req.body[field] === '');

  if (missing.length > 0) {
    throw httpError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const category = await categoryModel.findById(req.body.category_id);
  if (!category) throw httpError(400, 'Invalid category');

  const price = Number(req.body.price);
  const mrp = Number(req.body.mrp);
  if (!Number.isFinite(price) || !Number.isFinite(mrp) || price > mrp) {
    throw httpError(400, 'Price must be less than or equal to MRP');
  }

  const vendor = await resolveVendor(req, req.body.vendor_id);
  const uploadedImages = req.files?.length
    ? await cloudinaryService.uploadMultiple(
        req.files.map((file) => file.buffer),
        'products',
      )
    : [];

  const product = await productModel.create({
    vendor_id: vendor.id,
    category_id: req.body.category_id,
    name: req.body.name.trim(),
    slug: `${slugify(req.body.name)}-${Date.now()}`,
    description: req.body.description,
    images: uploadedImages,
    price,
    mrp,
    unit: req.body.unit,
    stock: Number(req.body.stock),
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');

  await ensureProductOwnership(req, product);

  const data = {};
  const copyFields = ['name', 'description', 'category_id', 'unit', 'stock', 'is_featured', 'is_active'];
  copyFields.forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  if (req.body.name) {
    data.name = req.body.name.trim();
    data.slug = `${slugify(req.body.name)}-${Date.now()}`;
  }

  if (req.body.price !== undefined) data.price = Number(req.body.price);
  if (req.body.mrp !== undefined) data.mrp = Number(req.body.mrp);

  const nextPrice = data.price ?? Number(product.price);
  const nextMrp = data.mrp ?? Number(product.mrp);
  if (nextPrice > nextMrp) throw httpError(400, 'Price must be less than or equal to MRP');

  if (req.files?.length) {
    const newImages = await cloudinaryService.uploadMultiple(
      req.files.map((file) => file.buffer),
      'products',
    );
    data.images = [...(product.images || []), ...newImages];
  }

  const updated = await productModel.update(req.params.id, data);
  res.json({ product: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');

  await ensureProductOwnership(req, product);

  await productModel.update(req.params.id, { is_active: false });
  res.json({ success: true });
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw httpError(400, 'publicId is required');

  const product = await productModel.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');

  await ensureProductOwnership(req, product);

  await cloudinaryService.deleteImage(publicId);
  const images = (product.images || []).filter((image) => image.public_id !== publicId);
  const updated = await productModel.update(req.params.id, { images });

  res.json({ product: updated });
});
