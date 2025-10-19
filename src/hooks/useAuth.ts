"use client";

import { create } from "zustand";
import { useEffect } from "react";
import type { AuthState } from "@/types";

type AuthStore = AuthState & {
  currentUserEmail: string | null;
  setCurrentUserEmail: (email: string | null) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  // Initial states
  isAuthenticated: false,
  isLoading: true,
  currentUserEmail: null,
  verifyToken: async () => {
    try {
      const token = localStorage.getItem("admin_jwt");
      const expStr = localStorage.getItem("admin_jwt_exp");
      if (!token || !expStr) {
        set({ isAuthenticated: false, isLoading: false, currentUserEmail: null });
        return false;
      }
      const exp = parseInt(expStr, 10);
      if (Number.isNaN(exp) || Date.now() >= exp) {
        localStorage.removeItem("admin_jwt");
        localStorage.removeItem("admin_jwt_exp");
        set({ isAuthenticated: false, isLoading: false, currentUserEmail: null });
        return false;
      }
      const res = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const ok = !!data?.authenticated;
      
      // Extract email from token for current user identification
      let email: string | null = null;
      if (ok && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          email = payload.email || null;
        } catch {
          // Token parsing failed, but authentication succeeded
        }
      }
      
      set({ isAuthenticated: ok, isLoading: false, currentUserEmail: email });
      console.log("isAuthenticated", ok);
      console.log("isLoading", false);
      return ok;
    } catch {
      set({ isAuthenticated: false, isLoading: false, currentUserEmail: null });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem("admin_jwt");
    localStorage.removeItem("admin_jwt_exp");
    set({ isAuthenticated: false, currentUserEmail: null });
  },
  setCurrentUserEmail: (email) => set({ currentUserEmail: email }),
}));

export function useAuth() {
  
  const { isAuthenticated, isLoading, verifyToken, logout, currentUserEmail, setCurrentUserEmail } = useAuthStore();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return { isAuthenticated, isLoading, logout, verifyToken, currentUserEmail, setCurrentUserEmail };
}


