import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/http.js';

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/addresses');
      setAddresses(response.data.addresses || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { addresses, loading, refetch };
}

export function useCreateAddress() {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/api/addresses', data);
      return response.data.address;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading };
}
