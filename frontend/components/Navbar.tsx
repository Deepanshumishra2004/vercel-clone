"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { isAuthenticated, removeToken } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const auth = isAuthenticated();
  const router = useRouter();

  const [data,setData] = useState({
    email : "",
    username : ""
  });

  useEffect(()=>{
    function Data(){

      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      setData({
        email : email!,
        username : username!
      })
    }
    Data()
  },[auth])

  return (
<motion.header
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.25 }}
  className="fixed top-0 z-50 w-full border-b-2 border-b-[var(--card-border)]"
  style={{
    height: "var(--navbar-height)",
    backgroundColor: "var(--color-navbar-bg)",
    color: "var(--color-navbar-text)",
  }}
>
  <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between bg-[var(--background)] text-[var(--foreground)] border-b-[var(--card-border)]"
  >
    {/* Logo */}
    <Link href="/" className="flex items-center gap-2">
      <span className="text-sm font-bold tracking-widest uppercase">
        Deploy<span className="text-zinc-500">X</span>
      </span>
    </Link>

    {/* Right section */}
    <div className="flex items-center gap-4">
      {auth ? (
        <>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1"
               style={{ borderColor: "var(--color-navbar-border)", color: "var(--color-navbar-text)", backgroundColor: "var(--card)" }}>
            <span className="text-xs font-mono">{data.username}</span>
          </div>

          <NavLink
            href="/dashboard"
            active={pathname.startsWith("/dashboard")}
          >
            Dashboard
          </NavLink>

          <button
            onClick={() => {
              removeToken();
              router.push("/");
            }}
            className="text-xs font-mono uppercase border px-3 py-1 rounded transition"
            style={{ borderColor: "var(--color-navbar-border)" }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <NavLink
            href="/auth/signin"
            active={pathname === "/auth/signin"}
          >
            Sign in
          </NavLink>

          <Link
            href="/auth/signup"
            className="text-xs font-mono uppercase border-2 px-4 py-1 rounded transition"
            style={{ borderColor: "var(--color-navbar-border)", color: "var(--color-navbar-text)" }}
          >
            Get started
          </Link>
        </>
      )}

      <ThemeToggle />
    </div>
  </div>
</motion.header>

  );
}

/* ---------- NavLink ---------- */
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        text-xs font-mono uppercase tracking-wide px-3 py-1 rounded
        border-2
        ${active ? "border-white text-white bg-zinc-900" : "border-transparent text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900"}
        transition
      `}
    >
      {children}
    </Link>
  );
}
