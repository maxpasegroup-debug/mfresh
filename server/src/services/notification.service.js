import axios from 'axios';

async function sendSms(mobile, message) {
  if (!process.env.MSG91_API_KEY || process.env.NODE_ENV !== 'production') {
    console.log(`MFresh SMS to ${mobile}: ${message}`);
    return { success: true, mock: true };
  }

  try {
    const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
      authkey: process.env.MSG91_API_KEY,
      sender: process.env.MSG91_SENDER_ID,
      mobiles: mobile,
      message,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

export const notificationService = {
  sendOrderConfirmation(mobile, orderNumber, total) {
    return sendSms(
      mobile,
      `MFresh: Your order ${orderNumber} worth Rs ${total} is confirmed. We will deliver it in your selected slot.`,
    );
  },

  sendOrderStatusUpdate(mobile, orderNumber, status) {
    return sendSms(mobile, `MFresh: Order ${orderNumber} is now ${status}.`);
  },

  sendVendorNewOrder(mobile, orderNumber, amount) {
    return sendSms(
      mobile,
      `MFresh: New seafood order ${orderNumber} worth Rs ${amount} received.`,
    );
  },

  sendVendorApproval(mobile, shopName) {
    return sendSms(
      mobile,
      `MFresh: ${shopName} is approved for internal seafood operations.`,
    );
  },

  sendAdminNotification(message) {
    if (!process.env.ADMIN_MOBILE) {
      console.log(`MFresh admin notification: ${message}`);
      return Promise.resolve({ success: true, mock: true });
    }
    return sendSms(process.env.ADMIN_MOBILE, message);
  },
};
