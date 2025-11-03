import { useState, useEffect } from 'react';

export function useStorage(key, defaultValue = null) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    setLoading(true);
    const result = await chrome.storage.local.get(key);
    setValue(result[key] || defaultValue);
    setLoading(false);
  };

  const saveValue = async (newValue) => {
    await chrome.storage.local.set({ [key]: newValue });
    setValue(newValue);
  };

  return [value, saveValue, loading];
}