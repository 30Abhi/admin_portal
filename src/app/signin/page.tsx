"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }
      const { token, expiresIn } = data as { token: string; expiresIn: number };
      const expMs = Date.now() + expiresIn * 1000;
      localStorage.setItem("admin_jwt", token);
      localStorage.setItem("admin_jwt_exp", String(expMs));
      toast.success("Signed in successfully");
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-xl p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Admin Sign In</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email</span>
          <input
            className="border rounded-md px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Password</span>
          <input
            className="border rounded-md px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-md py-2 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}


