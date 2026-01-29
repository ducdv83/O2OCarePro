import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

const webStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof localStorage === 'undefined') return null;
    return Promise.resolve(localStorage.getItem(name));
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(name, value);
    return Promise.resolve();
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(name);
    return Promise.resolve();
  },
};

const storage = Platform.OS === 'web' ? webStorage : secureStorage;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);

