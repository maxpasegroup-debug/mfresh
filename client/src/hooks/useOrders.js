import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders.api.js';
import { useCartStore } from '../store/cartStore.js';
import { useUiStore } from '../store/uiStore.js';

export function useOrders(params = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ordersApi.list(params);
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, total, loading, error, refetch: fetchOrders };
}

export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    ordersApi
      .getById(id)
      .then((response) => {
        if (active) setOrder(response.data.order);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { order, loading, error };
}

export function useCreateOrder() {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await ordersApi.create(data);
        clearCart();
        navigate(`/orders/${response.data.order.id}`);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearCart, navigate],
  );

  return { createOrder, loading, error };
}

export function useRazorpay() {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useUiStore((state) => state.showToast);

  const openRazorpay = useCallback(
    (razorpayConfig, orderId) => {
      if (!window.Razorpay) {
        showToast('Razorpay is not available. Check your connection.', 'error');
        return;
      }

      const checkout = new window.Razorpay({
        ...razorpayConfig,
        handler: async (paymentResponse) => {
          try {
            await ordersApi.verifyPayment(orderId, paymentResponse);
            clearCart();
            showToast('Payment successful', 'success');
            navigate(`/orders/${orderId}`);
          } catch {
            showToast('Payment verification failed', 'error');
          }
        },
        modal: {
          ondismiss: () => showToast('Payment cancelled', 'info'),
        },
      });

      checkout.on('payment.failed', () => showToast('Payment failed', 'error'));
      checkout.open();
    },
    [clearCart, navigate, showToast],
  );

  return { openRazorpay };
}
