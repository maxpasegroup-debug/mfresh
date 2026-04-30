import { useEffect, useState } from 'react';
import { vendorsApi } from '../api/vendors.api.js';

export function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    vendorsApi
      .list()
      .then((response) => {
        if (active) setVendors(response.data.vendors || []);
      })
      .catch(() => {
        if (active) setVendors([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { vendors, loading };
}

export function useVendor(id) {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    vendorsApi
      .getById(id)
      .then((response) => {
        if (!active) return;
        setVendor(response.data.vendor);
        setProducts(response.data.products || []);
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

  return { vendor, products, loading, error };
}
