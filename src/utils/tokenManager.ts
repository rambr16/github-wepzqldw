import { useState, useEffect } from 'react';

// Token storage key
const TOKEN_KEY = 'app_token';

// Get token from storage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token in storage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from storage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Custom hook for token management
export const useToken = () => {
  const [token, setTokenState] = useState<string | null>(getToken());

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      setToken(newToken);
    } else {
      removeToken();
    }
    setTokenState(newToken);
  };

  return {
    token,
    updateToken,
    removeToken: () => updateToken(null),
  };
};