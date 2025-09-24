"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthState } from "@/types";



const useAuthStore = create<AuthState>((set) => ({
  // Initial states
  isAuthenticated: false,
  isLoading: true,
  verifyToken: async () => {
    try {
      const token = localStorage.getItem("admin_jwt");
      const expStr = localStorage.getItem("admin_jwt_exp");
      if (!token || !expStr) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }
      const exp = parseInt(expStr, 10);
      if (Number.isNaN(exp) || Date.now() >= exp) {
        localStorage.removeItem("admin_jwt");
        localStorage.removeItem("admin_jwt_exp");
        set({ isAuthenticated: false, isLoading: false });
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
      set({ isAuthenticated: ok, isLoading: false });
      console.log("isAuthenticated", ok);
      console.log("isLoading", false);
      return ok;
    } catch {
      set({ isAuthenticated: false, isLoading: false });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem("admin_jwt");
    localStorage.removeItem("admin_jwt_exp");
    set({ isAuthenticated: false });
  },
}));

export function useAuth() {
  
  const { isAuthenticated, isLoading, verifyToken, logout } = useAuthStore();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return { isAuthenticated, isLoading, logout };
}


