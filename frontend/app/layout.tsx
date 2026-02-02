import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/providers";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeployX — Deploy like Vercel",
  description: "Git-based deployments with real-time logs and Kubernetes builds",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-[var(--background)] 
          text-[var(--foreground)]
        `}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <Navbar />

            {/* App Shell */}
            <div className="pt-[var(--navbar-height)] flex justify-center">
              <main className="w-full h-screen max-w-7xl md:px-8 border-x-2 border-x-[var(--card-border)]">
                <AuthGuard>{children}</AuthGuard>
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
