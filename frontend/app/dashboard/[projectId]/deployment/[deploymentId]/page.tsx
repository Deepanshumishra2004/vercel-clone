"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { LogViewer, type LogEntry } from "@/components/LogViewer";

export default function DeploymentLogsPage() {
  const router = useRouter();
  const { projectId, deploymentId } = useParams<{
    projectId: string;
    deploymentId: string;
  }>();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/auth/signin");
  }, [router]);

  const { data, isLoading } = useQuery<LogEntry[]>({
    queryKey: ["logs", deploymentId],
    queryFn: async () => {
      const res = await api.get<{ logs: LogEntry[] }>(
        `/deployment/${deploymentId}`
      );
      return res.data.logs;
    },
    enabled: !!deploymentId && isAuthenticated(),
    refetchInterval: (query) => {
      const logs = query.state.data as LogEntry[] | undefined;
      return logs?.some((l) =>
        l.log.includes("DEPLOYMENT_DONE:SUCCESS")
      )
        ? false
        : 2000;
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 border-x-2 border-zinc-800 py-4">

      <div className="mx-auto max-w-7xl border-t-2 border-zinc-800">
        {/* ================= HEADER ================= */}
        <div className="border-b-2 border-zinc-800 bg-zinc-950">
              <div className="border-b-2 px-6 py-2 border-zinc-800">
                <Link
                    href={`/dashboard/${projectId}`}
                    className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
                    >
                    ← BACK TO DASHBOARD
                </Link>
              </div>
          <div className="px-6 py-4 flex items-center justify-between">
              {/* FIXED BACK BUTTON */}

            <div>

              <h1 className="mt-2 text-sm font-bold uppercase tracking-wide">
                Deployment Logs
              </h1>

              <p className="mt-1 text-xs font-mono text-zinc-500">
                {deploymentId}
              </p>
            </div>

            {/* STATUS */}
            <div
              className="
                border-2 border-emerald-500
                px-3 py-1
                text-xs font-mono uppercase
                text-emerald-400
              "
            >
              Live
            </div>
          </div>
        </div>

        {/* ================= LOG HEADER ================= */}
        <div className="px-6 py-2 border-b-2 border-zinc-800 bg-zinc-900 text-xs font-mono uppercase text-zinc-500">
          Output
        </div>

        {/* ================= LOG VIEWER ================= */}
        <div className="border-b-2 border-zinc-800 bg-black">
          {isLoading ? (
            <div className="px-6 py-4 text-xs font-mono text-zinc-500">
              Loading logs…
            </div>
          ) : (
            <div className="h-[70vh] overflow-auto">
              <LogViewer logs={data || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
