import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,

  login: async (username, password) => {
    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ isAuthenticated: true });

      // You can persist login status to sessionStorage/localStorage if needed
      sessionStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      set({ isAuthenticated: false });
      throw new Error("Login failed");
    }
  },

  logout: () => {
    set({ isAuthenticated: false });
    sessionStorage.removeItem('isAuthenticated');
  },

  initializeAuth: () => {
    const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    set({ isAuthenticated: isAuth });
  },
}));
