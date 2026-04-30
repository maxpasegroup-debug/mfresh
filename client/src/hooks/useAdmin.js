import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/http.js';
import { categoriesApi } from '../api/categories.api.js';
import { productsApi } from '../api/products.api.js';

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/stats');
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

export function useAdminVendors(params = {}) {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/vendors', { params: JSON.parse(key) });
      setVendors(response.data.vendors || []);
      setTotal(response.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { vendors, total, loading, refetch };
}

export function useAdminOrders(params = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/orders', { params: JSON.parse(key) });
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { orders, total, loading, refetch };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.list();
      setCategories(response.data.categories || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { categories, loading, refetch };
}

export function useAdminProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsApi.list(JSON.parse(key));
      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, total, loading, refetch };
}
