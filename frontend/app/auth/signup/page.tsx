"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      await api.post("/signup", {
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
      });
      router.push("/auth/signin");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-10 px-4 border-x-2 border-zinc-800 ">
      <div className="w-full max-w-md border-2 border-zinc-800 bg-zinc-950 rounded-2xl">
        {/* Header */}
        <div className="border-b-2 border-zinc-800 px-6 py-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Create Account
          </h1>
          <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
            Start deploying in minutes
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="border-b-2 border-red-500 bg-red-500/10 px-6 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-5 p-6">
          <Input name="username" placeholder="Username" required />
          <Input name="email" type="email" placeholder="Email address" required />
          <Input name="password" type="password" placeholder="Password" required />

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t-2 border-zinc-800 px-6 py-4 text-center text-xs font-mono text-zinc-500 uppercase tracking-wide">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
