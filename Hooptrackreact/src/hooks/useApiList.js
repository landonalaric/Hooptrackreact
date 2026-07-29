import { useCallback, useEffect, useState } from "react";
import client, { extractError } from "../api/client";

export default function useApiList(endpoint, { auto = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    setError("");
    return client
      .get(endpoint)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    if (auto) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const create = useCallback(
    async (payload) => {
      const res = await client.post(endpoint, payload);
      setItems((prev) => [res.data, ...prev]);
      return res.data;
    },
    [endpoint]
  );

  const patch = useCallback(
    async (id, payload) => {
      const res = await client.patch(`${endpoint}${id}/`, payload);
      setItems((prev) => prev.map((it) => (it.id === id ? res.data : it)));
      return res.data;
    },
    [endpoint]
  );

  const remove = useCallback(
    async (id) => {
      await client.delete(`${endpoint}${id}/`);
      setItems((prev) => prev.filter((it) => it.id !== id));
    },
    [endpoint]
  );

  return { items, loading, error, refresh, create, patch, remove, setError };
}
