import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsApi } from '../api/products.api.js';
import { categoriesApi } from '../api/categories.api.js';

let cachedCategories = null;

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(params.page) || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stableParams = useMemo(() => ({ ...params, page }), [params, page]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsApi.list(stableParams);
      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, loading, error, refetch: fetchProducts, page, setPage };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    productsApi
      .getFeatured()
      .then((response) => {
        if (active) setProducts(response.data.products || []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    productsApi
      .getById(id)
      .then((response) => {
        if (active) setProduct(response.data.product);
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

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) return;
    let active = true;

    categoriesApi
      .list()
      .then((response) => {
        cachedCategories = response.data.categories || [];
        if (active) setCategories(cachedCategories);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}
