import { useState, useEffect } from "react";

const getLocalStorageValue = (key, initialValue) => {
  const value = JSON.parse(localStorage.getItem(key));
  if (value) {
    return value;
  }
  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
};

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue(key, initialValue);
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};
