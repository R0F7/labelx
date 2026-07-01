import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

export function useAsyncSearch<T>(endpoint: string, delay = 500) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<T[]>([]);
  const debouncedQuery = useDebounce(searchQuery, delay);

  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery.trim()) {
        setData([]);
        return;
      }
      try {
        const res = await fetch(`${endpoint}?query=${encodeURIComponent(debouncedQuery)}`);
        const resData = await res.json();
        setData(resData.data || []);
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
      }
    };

    fetchData();
  }, [debouncedQuery, endpoint]);

  return {
    searchQuery,
    setSearchQuery,
    data,
  };
}