"use client";

import { useEffect, useRef } from "react";

export interface LogEntry {
  event_id: string;
  deployment_id: string;
  log: string;
  timestamp?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  autoScroll?: boolean;
  className?: string;
}

export function LogViewer({ logs, autoScroll = true, className = "" }: LogViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  if (logs.length === 0) {
    return (
      <div
        className={`font-mono text-sm text-zinc-500 p-6 ${className}`}
      >
        No logs yet. Deployment will stream logs here...
      </div>
    );
  }

  return (
    <div
      className={`font-mono text-sm text-green-400/90 bg-black overflow-auto p-6 h-full ${className}`}
    >
      {logs.map((l) => (
        <div key={l.event_id} className="whitespace-pre-wrap break-all py-0.5">
          <span className="text-zinc-500 select-none">$ </span>
          {l.log}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
