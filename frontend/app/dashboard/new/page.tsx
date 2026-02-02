"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function NewProject() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await api.post<{ project: { id: string } }>("/project", {
        name: form.get("name"),
        gitUrl: form.get("gitUrl"),
        subDomain: form.get("subDomain"),
        customDomain: form.get("customDomain") || undefined,
      });

      const projectId = res.data.project.id;

      const deployRes = await api.post<{ id: string; url: string }>("/deploy", {
        projectId,
      });

      if (deployRes.data.url) {
        router.push(`/dashboard/${projectId}`);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      setError(msg || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 border-x-2 border-zinc-800 py-4">
      <div className="mx-auto max-w-7xl border-t-2 border-zinc-800">
        {/* ================= HEADER ================= */}
        <div className="border-b-2 border-zinc-800 bg-zinc-950">
          <div className="border-b-2 px-6 py-2 border-zinc-800">
            <Link
              href="/dashboard"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
            >
              ← BACK TO DASHBOARD
              </Link>
          </div>
          <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">
              New Project
              </h1>
              <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
              Create & deploy a new application
              </p>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="border-b-2 border-red-500 bg-red-500/10 px-6 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={submit} className="space-y-5 p-6">
          <Input
            name="name"
            label="Project Name"
            placeholder="my-app"
            required
          />

          <Input
            name="gitUrl"
            label="Git Repository URL"
            placeholder="https://github.com/user/repo"
            required
          />

          <Input
            name="subDomain"
            label="Subdomain"
            placeholder="myapp.localhost"
            required
          />

          <Input
            name="customDomain"
            label="Custom Domain (optional)"
            placeholder="app.example.com"
          />

          <div className=" px-6 py-4 w-full border-y-2 border-zinc-800">
            <Button type="submit" isLoading={loading}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
