import axios from 'axios';

async function sendSms(mobile, message) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Malabarii SMS to ${mobile}: ${message}`);
    return { success: true, dev: true };
  }

  try {
    const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
      authkey: process.env.MSG91_API_KEY,
      sender: process.env.MSG91_SENDER_ID,
      mobiles: `91${mobile}`,
      message,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export const notificationService = {
  sendOrderConfirmation(mobile, orderNumber, total) {
    return sendSms(
      mobile,
      `Malabarii: Your order ${orderNumber} worth ₹${total} is confirmed! Track at malabarii.com/orders`,
    );
  },

  sendOrderStatusUpdate(mobile, orderNumber, status) {
    return sendSms(mobile, `Malabarii: Order ${orderNumber} is now ${status}.`);
  },

  sendVendorNewOrder(mobile, orderNumber, amount) {
    return sendSms(
      mobile,
      `Malabarii: New order ${orderNumber} worth ₹${amount} received. Open vendor app to confirm.`,
    );
  },

  sendVendorApproval(mobile, shopName) {
    return sendSms(
      mobile,
      `Malabarii: Congratulations! ${shopName} is now live on Malabarii. Start selling today!`,
    );
  },
};
