"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  subDomain: string;
  deployments?: { id: string; status: string; createdAt: string }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get<{ response: Project[] }>("/projects");
      return Array.isArray(res.data.response) ? res.data.response : [];
    },
    enabled: mounted && isAuthenticated(),
  });

  useEffect(() => {
    if (mounted && !isAuthenticated()) router.push("/auth/signin");
  }, [mounted, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 border-x-2 border-zinc-800 py-4 ">
      <div className="mx-auto max-w-7xl border-t-2 border-zinc-800">
        {/* ================= HEADER ================= */}
        <div className="border-b-2 border-zinc-800 bg-zinc-950">
          <div className="border-b-2 px-6 py-2 border-zinc-800">
            <Link
              href="/dashboard"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
            >
            DASHBOARD
            </Link>
          </div>
          <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">
                Projects
              </h1>
              <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
                Build · Deploy · Scale
              </p>
            </div>

            <Link href="/dashboard/new">
              <Button className="px-4 py-2 text-xs font-mono uppercase">
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* ================= PROJECT GRID ================= */}
        <div className="px-6 py-6             overflow-y-auto
">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 border-2 border-zinc-800 bg-zinc-900 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-zinc-800 bg-zinc-950 p-16 text-center"
            >
              <h3 className="text-lg font-bold uppercase tracking-wide">
                No projects
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-zinc-500 uppercase tracking-wide">
                Create your first project to get started
              </p>
              <Link href="/dashboard/new">
                <Button className="mt-8 px-4 py-2 text-xs font-mono uppercase">
                  Create Project
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                >
                  <ProjectCard
                    id={p.id}
                    name={p.name}
                    subDomain={p.subDomain}
                    deployments={p.deployments ?? []}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
