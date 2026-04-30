import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api/orders.api.js';
import { productsApi } from '../api/products.api.js';
import { vendorsApi } from '../api/vendors.api.js';
import { useAuthStore } from '../store/authStore.js';
import { useUiStore } from '../store/uiStore.js';

export function useVendorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorsApi.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, loading, error, refetch };
}

export function useVendorOrders(params = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getVendorOrders(params);
      setOrders(response.data.orders || []);
      setTotal(response.data.total || response.data.orders?.length || 0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { orders, total, loading, refetch };
}

export function useVendorProducts() {
  const vendor = useAuthStore((state) => state.vendor);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!vendor?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await productsApi.list({ vendor: vendor.id, limit: 50 });
      setProducts(response.data.products || []);
    } finally {
      setLoading(false);
    }
  }, [vendor?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, refetch };
}

export function useAddProduct(refetchProducts) {
  const showToast = useUiStore((state) => state.showToast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.create(formData);
        showToast('Product added', 'success');
        await refetchProducts?.();
        return response.data.product;
      } catch (err) {
        setError(err);
        showToast(err.response?.data?.message || 'Could not add product', 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refetchProducts, showToast],
  );

  return { addProduct, loading, error };
}

export function useUpdateProduct(refetchProducts) {
  const showToast = useUiStore((state) => state.showToast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduct = useCallback(
    async (id, formData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.update(id, formData);
        showToast('Product updated', 'success');
        await refetchProducts?.();
        return response.data.product;
      } catch (err) {
        setError(err);
        showToast(err.response?.data?.message || 'Could not update product', 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refetchProducts, showToast],
  );

  return { updateProduct, loading, error };
}
