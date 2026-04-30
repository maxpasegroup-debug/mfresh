import * as categoryModel from '../models/category.model.js';
import * as productModel from '../models/product.model.js';
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

function publicIdFromCloudinaryUrl(url) {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
  return match?.[1] || null;
}

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryModel.listAll();
  res.json({ categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    throw httpError(404, 'Category not found');
  }

  res.json({ category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, sort_order } = req.body;

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw httpError(400, 'Category name is required');
  }

  const data = {
    name: name.trim(),
    slug: slugify(name),
    sort_order: sort_order === undefined ? 0 : Number(sort_order),
  };

  if (req.file) {
    const image = await cloudinaryService.uploadImage(req.file.buffer, 'categories');
    data.image_url = image.url;
  }

  const category = await categoryModel.create(data);
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    throw httpError(404, 'Category not found');
  }

  const data = {};

  if (req.body.name !== undefined) {
    if (typeof req.body.name !== 'string' || req.body.name.trim().length < 2) {
      throw httpError(400, 'Category name is invalid');
    }
    data.name = req.body.name.trim();
    data.slug = slugify(req.body.name);
  }

  if (req.body.sort_order !== undefined) {
    data.sort_order = Number(req.body.sort_order);
  }

  if (req.body.is_active !== undefined) {
    data.is_active = req.body.is_active === true || req.body.is_active === 'true';
  }

  if (req.file) {
    const oldPublicId = publicIdFromCloudinaryUrl(category.image_url);
    if (oldPublicId) {
      await cloudinaryService.deleteImage(oldPublicId);
    }
    const image = await cloudinaryService.uploadImage(req.file.buffer, 'categories');
    data.image_url = image.url;
  }

  const updated = await categoryModel.update(req.params.id, data);
  res.json({ category: updated });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await productModel.countActiveByCategory(req.params.id);

  if (productCount > 0) {
    throw httpError(400, 'Cannot delete: products exist');
  }

  const deleted = await categoryModel.delete(req.params.id);

  if (!deleted) {
    throw httpError(404, 'Category not found');
  }

  res.json({ success: true });
});
