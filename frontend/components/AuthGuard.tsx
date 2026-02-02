"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false); // prevent flicker

  useEffect(() => {
    const auth = isAuthenticated();

    // Redirect logged-in users away from auth pages
    if (auth && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
      router.replace("/dashboard");
    }
    // Redirect non-logged-in users away from protected pages
    else if (!auth && (pathname.startsWith("/dashboard"))) {
      router.replace("/auth/signin");
    } else {
      setReady(true); // safe to render children
    }
  }, [pathname, router]);

  if (!ready) return null; // or a loading spinner

  return <>{children}</>;
}
