import * as addressModel from '../models/address.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function cleanAddress(body) {
  const data = {
    label: body.label?.trim() || 'Home',
    line1: body.line1?.trim(),
    line2: body.line2?.trim() || null,
    city: body.city?.trim(),
    pincode: body.pincode?.trim(),
  };

  if (!data.line1 || data.line1.length < 3) throw httpError(400, 'Address line 1 is required');
  if (!data.city || data.city.length < 2) throw httpError(400, 'City is required');
  if (!/^\d{6}$/.test(data.pincode || '')) throw httpError(400, 'Valid pincode is required');

  return data;
}

async function ensureOwnAddress(id, userId) {
  const addresses = await addressModel.findByUser(userId);
  const address = addresses.find((item) => item.id === id);
  if (!address) throw httpError(404, 'Address not found');
  return address;
}

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressModel.findByUser(req.user.userId);
  res.json({ addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  const existing = await addressModel.findByUser(req.user.userId);
  const address = await addressModel.create({
    ...cleanAddress(req.body),
    user_id: req.user.userId,
    is_default: existing.length === 0,
  });
  res.status(201).json({ address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  await ensureOwnAddress(req.params.id, req.user.userId);
  const address = await addressModel.update(req.params.id, cleanAddress(req.body));
  res.json({ address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await ensureOwnAddress(req.params.id, req.user.userId);
  await addressModel.delete(req.params.id);
  res.json({ success: true });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressModel.setDefault(req.params.id, req.user.userId);
  if (!address) throw httpError(404, 'Address not found');
  res.json({ address });
});
