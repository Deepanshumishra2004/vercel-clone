"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      onClick={toggle}
      className="
        font-mono
        text-xs
        border-2 border-[var(--card-border)]
        px-3 py-2
        rounded-xl

        hover:shadow-md
        transition-all
        bg-[var(--background)] text-[var(--foreground)]
      "
      title="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
