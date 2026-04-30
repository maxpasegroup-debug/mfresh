import * as offerModel from '../models/offer.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalize(body) {
  return {
    title: body.title,
    type: body.type,
    code: body.code || null,
    discount_pct: body.discount_pct === '' ? null : body.discount_pct,
    discount_flat: body.discount_flat === '' ? null : body.discount_flat,
    min_order_value: body.min_order_value || 0,
    max_discount: body.max_discount === '' ? null : body.max_discount,
    applies_to: body.applies_to || 'all',
    reference_id: body.reference_id || null,
    valid_from: body.valid_from || null,
    valid_to: body.valid_to || null,
    usage_limit: Number(body.usage_limit || 0) || null,
    is_active: body.is_active === undefined ? true : body.is_active === true || body.is_active === 'true',
  };
}

export const listOffers = asyncHandler(async (req, res) => {
  if (req.query.code) {
    const offer = await offerModel.findActiveByCode(req.query.code);
    return res.json({ offer });
  }

  const offers = req.user?.role === 'admin' ? await offerModel.listAll() : await offerModel.listActive();
  return res.json({ offers });
});

export const validateCode = asyncHandler(async (req, res) => {
  if (!req.query.code) throw httpError(400, 'code is required');
  const offer = await offerModel.findActiveByCode(req.query.code);
  if (!offer) throw httpError(404, 'Offer not found');
  res.json({ offer });
});

export const createOffer = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.type) throw httpError(400, 'Title and type are required');
  const offer = await offerModel.create(normalize(req.body));
  res.status(201).json({ offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await offerModel.update(req.params.id, normalize(req.body));
  if (!offer) throw httpError(404, 'Offer not found');
  res.json({ offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await offerModel.delete(req.params.id);
  if (!offer) throw httpError(404, 'Offer not found');
  res.json({ success: true });
});
