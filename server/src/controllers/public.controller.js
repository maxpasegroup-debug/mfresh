import { query } from '../models/db.js';
import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, mobile, email, subject, message } = req.body;

  await query(
    `INSERT INTO contacts (name, mobile, email, subject, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, mobile, email || null, subject, message],
  );

  await notificationService.sendAdminNotification(
    `MFresh contact: ${name} (${mobile}) - ${subject}`,
  );

  res.status(201).json({ success: true });
});

export const createHotelEnquiry = asyncHandler(async (req, res) => {
  const { hotelName, ownerName, mobile, city, type } = req.body;

  await query(
    `INSERT INTO hotel_leads (hotel_name, owner_name, mobile, city, business_type)
     VALUES ($1, $2, $3, $4, $5)`,
    [hotelName, ownerName, mobile, city, type],
  );

  await notificationService.sendAdminNotification(
    `MFresh legacy hotel lead: ${hotelName}, ${ownerName}, ${mobile}, ${city}`,
  );

  res.status(201).json({ success: true });
});
