"use client";

import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

enum DeploymentStatus {
  NOT_STARTED = "NOT_STARTED",
  QUEUED = "QUEUED",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  FAIL = "FAIL",
}

interface DeployementProps {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  Url: string | null;
  status: DeploymentStatus;
}

const statusStyles: Record<DeploymentStatus, string> = {
  READY: "border-green-500 text-green-400",
  FAIL: "border-red-500 text-red-400",
  QUEUED: "border-yellow-500 text-yellow-400",
  IN_PROGRESS: "border-blue-500 text-blue-400",
  NOT_STARTED: "border-zinc-600 text-zinc-400",
};

export default function DeploymentsPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/auth/signin");
  }, [router]);

  /* ---------- Project ---------- */
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get(`/project/${projectId}`);
      return res.data.data.response;
    },
    enabled: !!projectId,
  });

  /* ---------- Deployments ---------- */
  const { data: deployments } = useQuery({
    queryKey: ["deployments", projectId],
    queryFn: async () => {
      const res = await api.get(`/deploy/${projectId}`);
      return res.data.response as DeployementProps[];
    },
    enabled: !!projectId,
    refetchInterval: 5000,
  });

  /* ---------- Deploy ---------- */
  const deployMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/deploy", { projectId });
      return res.data;
    },
    onSuccess: (data) => {
      router.push(`/dashboard/${projectId}/deployment/${data.id}`);
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 border-x-2 border-zinc-800 py-4">
      <div className=" mx-auto max-w-7xl border-t-2 border-zinc-800">
        {/* ================= HEADER ================= */}
        <div className="border-b-2 border-zinc-800 bg-zinc-950">
          <div className="border-b-2 px-6 py-2 border-zinc-800">
            <Link
              href={`/dashboard`}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
            >
              ← BACK TO DASHBOARD
            </Link>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="mt-2 text-xl font-bold uppercase tracking-wide">
                {project?.name || "Loading Project…"}
              </h1>
              {project && (
                <p className="mt-1 text-xs font-mono text-zinc-500">
                  <div className="flex-col pt-2">
                    <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
                      ID: {project.id}{" "}
                    </p>
                    <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
                      • Repo:{" "}
                      <a
                        href={project.gitUrl}
                        target="_blank"
                        className="text-indigo-400 hover:underline"
                      >
                        {project.gitUrl}
                      </a>{" "}
                    </p>
                    <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-wide">
                      • Subdomain: https://{project.subDomain}
                    </p>
                  </div>
                </p>
              )}
            </div>

            <button
              onClick={() => deployMutation.mutate()}
              disabled={deployMutation.isPending}
              className="
                border-2 border-indigo-500
                bg-indigo-600
                px-4 py-2
                text-xs font-mono uppercase
                hover:bg-indigo-500
                disabled:opacity-50
              "
            >
              {deployMutation.isPending ? "DEPLOYING…" : "DEPLOY"}
            </button>
          </div>
        </div>

        {/* ================= TABLE HEADER ================= */}
        <div className="grid grid-cols-[4px_1fr_auto_auto] border-b-2 border-zinc-800 bg-zinc-900 text-xs font-mono uppercase text-zinc-500">
          <div />
          <div className="px-4 py-2">Deployment</div>
          <div className="px-3 py-2">Status</div>
          <div className="px-4 py-2">Action</div>
        </div>

        {/* ================= DEPLOYMENTS ================= */}
        {deployments?.length ? (
          deployments.map((d: DeployementProps) => (
            <div
              key={d.id}
              className="grid grid-cols-[4px_1fr_auto_auto] items-center border-b-2 py-2 border-zinc-800 hover:bg-zinc-900/50"
            >
              {/* STATUS STRIP */}
              <div
                className={`${
                  d.status === "READY"
                    ? "bg-green-500"
                    : d.status === "FAIL"
                    ? "bg-red-500"
                    : d.status === "IN_PROGRESS"
                    ? "bg-blue-500"
                    : "bg-zinc-600"
                }`}
              />

              {/* INFO */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium mb-1">
                  Deployment{" "}
                  <span className="ml-2 text-xs font-mono text-zinc-500">
                    {d.id}
                  </span>
                </p>

                {d.Url && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <a
                      href={d.Url}
                      target="_blank"
                      className="text-indigo-400 hover:underline"
                    >
                      {d.Url}
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(d.Url!)}
                      className="px-2 py-0.5 border border-zinc-700 rounded text-zinc-300 hover:bg-zinc-800"
                      title="Copy URL"
                    >
                      Copy
                    </button>
                  </div>
                )}

                <p className="text-xs font-mono text-zinc-500 mt-4">
                  Updated {new Date(d.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* STATUS */}
              <div
                className={`
                  mx-3
                  border-2
                  px-2 py-1
                  text-[11px]
                  font-mono uppercase
                  ${statusStyles[d.status]}
                `}
              >
                {d.status}
              </div>

              {/* ACTION */}
              <button
                onClick={() =>
                  router.push(`/dashboard/${projectId}/deployment/${d.id}`)
                }
                className="
                  mx-4
                  border-2 border-zinc-700
                  bg-zinc-900
                  px-3 py-1
                  text-xs font-mono uppercase
                  hover:bg-zinc-800
                "
              >
                Logs
              </button>
            </div>
          ))
        ) : (
          <div className="px-6 py-4 text-xs font-mono text-zinc-500">
            No deployments yet
          </div>
        )}
      </div>
    </div>
  );
}
