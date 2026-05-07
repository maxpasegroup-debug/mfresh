import { Router } from 'express';
import { createContact, createHotelEnquiry } from '../controllers/public.controller.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/contact',
  validate({
    body: {
      name: { required: true, type: 'string', min: 2, max: 100 },
      mobile: { required: true, type: 'string', min: 10, max: 15 },
      email: { type: 'string', max: 150 },
      subject: { required: true, type: 'string', max: 60 },
      message: { required: true, type: 'string', min: 5, max: 2000 },
    },
  }),
  createContact,
);

router.post(
  '/vendors/hotel-enquiry',
  validate({
    body: {
      hotelName: { required: true, type: 'string', min: 2, max: 150 },
      ownerName: { required: true, type: 'string', min: 2, max: 100 },
      mobile: { required: true, type: 'string', min: 10, max: 15 },
      city: { required: true, type: 'string', min: 2, max: 100 },
      type: { required: true, type: 'string', enum: ['restaurant', 'hotel', 'canteen'] },
    },
  }),
  createHotelEnquiry,
);

export default router;
