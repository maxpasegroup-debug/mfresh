import crypto from 'node:crypto';
import axios from 'axios';
import Razorpay from 'razorpay';

let instance;

function getInstance() {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return instance;
}

function razorpayAuth() {
  return {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_KEY_SECRET,
  };
}

export function createOrder({ amount, currency = 'INR', receipt, notes }) {
  return getInstance().orders.create({ amount, currency, receipt, notes });
}

export function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return expectedSignature === razorpay_signature;
}

export function capturePayment(paymentId, amount) {
  return getInstance().payments.capture(paymentId, amount);
}

export function initiateRefund(paymentId, amount, notes) {
  return getInstance().payments.refund(paymentId, { amount, notes });
}

export async function createContact({ name, mobile, vendor_id }) {
  const response = await axios.post(
    'https://api.razorpay.com/v1/contacts',
    {
      name,
      contact: mobile,
      type: 'vendor',
      reference_id: vendor_id,
    },
    { auth: razorpayAuth() },
  );
  return response.data;
}

export async function createFundAccount({
  contactId,
  bank_account_name,
  bank_account_number,
  bank_ifsc,
}) {
  const response = await axios.post(
    'https://api.razorpay.com/v1/fund_accounts',
    {
      contact_id: contactId,
      account_type: 'bank_account',
      bank_account: {
        name: bank_account_name,
        account_number: bank_account_number,
        ifsc: bank_ifsc,
      },
    },
    { auth: razorpayAuth() },
  );
  return response.data;
}

export async function createPayout({ fund_account_id, amount, purpose, narration }) {
  const response = await axios.post(
    'https://api.razorpay.com/v1/payouts',
    {
      account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
      fund_account_id,
      amount,
      currency: 'INR',
      mode: 'IMPS',
      purpose,
      narration,
      queue_if_low_balance: true,
    },
    { auth: razorpayAuth() },
  );
  return response.data;
}
