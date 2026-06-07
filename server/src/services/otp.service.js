import bcrypt from 'bcrypt';
import axios from 'axios';

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(otp) {
  return bcrypt.hash(otp, 10);
}

export function verifyOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

export async function sendOtp(mobile, otp) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`MFresh OTP for ${mobile}: ${otp}`);
    return { success: true, dev: true, otp };
  }

  try {
    const response = await axios.post('https://api.msg91.com/api/v5/otp', null, {
      params: {
        authkey: process.env.MSG91_API_KEY,
        mobile: `91${mobile}`,
        otp,
        template_id: process.env.MSG91_TEMPLATE_ID,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to send OTP',
    };
  }
}
