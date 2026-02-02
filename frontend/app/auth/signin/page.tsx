"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface SigninProps {
  token: string;
  data : {
    id : string;
    username : string;
    email : string;
  }
}

export default function Signin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await api.post<SigninProps>("/signin", {
        email: form.get("email"),
        password: form.get("password"),
      });
      setToken(res.data.token);
      localStorage.setItem("username", res.data.data.username);
      localStorage.setItem("id", res.data.data.id);
      localStorage.setItem("email",res.data.data.email);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-10 px-4 border-zinc-800 border-x-2">
      <div className="w-full max-w-md border-2 border-zinc-800 bg-zinc-950 rounded-2xl">
        {/* Header */}
        <div className="border-b-2 border-zinc-800 px-6 py-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide">Sign In</h1>
          <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
            Access your DeployX account
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
          <Input name="email" type="email" placeholder="Email address" required />
          <Input name="password" type="password" placeholder="Password" required />

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t-2 border-zinc-800 px-6 py-4 text-center text-xs font-mono text-zinc-500 uppercase tracking-wide">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-400 hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
