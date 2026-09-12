"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@canaryinn.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-ivory tracking-tightest">Canary Inn</div>
          <div className="mt-1 text-eyebrow uppercase tracking-widest text-ivory/50">Staff Console</div>
        </div>
        <form onSubmit={onSubmit} className="bg-ivory text-coal rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-ember" />
            <h1 className="font-serif text-2xl">Sign in</h1>
          </div>
          <div className="space-y-4">
            <div>
              <label className="eyebrow block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-sm text-ember">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coal text-ivory py-3 rounded-full text-sm uppercase tracking-widest hover:bg-ember transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}