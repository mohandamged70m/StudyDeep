"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // localStorage unavailable
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      });
    } catch {
      setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
    }
  };

  return [storedValue, setValue];
}
