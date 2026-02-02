import Link from "next/link";

interface Deployment {
  id: string;
  status: string;
  createdAt: string;
}

interface ProjectCardProps {
  id: string;
  name: string;
  subDomain: string;
  deployments?: Deployment[];
}

const statusStyles: Record<string, string> = {
  QUEUED: "border-amber-500 text-amber-400",
  IN_PROGRESS: "border-blue-500 text-blue-400",
  READY: "border-green-500 text-green-400",
  FAIL: "border-red-500 text-red-400",
  NOT_STARTED: "border-zinc-600 text-zinc-500",
};

export function ProjectCard({
  id,
  name,
  subDomain,
  deployments = [],
}: ProjectCardProps) {
  const latest = deployments[0];
  const statusClass = latest
    ? statusStyles[latest.status] ?? statusStyles.NOT_STARTED
    : statusStyles.NOT_STARTED;

  return (
    <Link
      href={`/dashboard/${id}`}
      className="
      h-[200px]
        block
        border-2 border-zinc-800
        bg-zinc-950
        hover:border-zinc-600
        transition
      "
    >
      {/* Header */}
      <div className="p-4 border-b-2 h-[70%] border-zinc-800 flex justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">
            {name}
          </h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            {subDomain}
          </p>
        </div>

        <span
          className={`
            text-[10px]
            px-2 py-1
            border
            uppercase tracking-widest
            h-fit
            ${statusClass}
          `}
        >
          {latest?.status ?? "NOT_STARTED"}
        </span>
      </div>

      {/* Footer */}
      <div className="p-3 flex h-[30%] items-center justify-between text-xs text-zinc-500">
        <span>
          {deployments.length} deployment
          {deployments.length !== 1 && "s"}
        </span>

        <span className="uppercase tracking-wide text-zinc-600">
          Open →
        </span>
      </div>
    </Link>
  );
}
