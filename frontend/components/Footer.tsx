"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-[var(--background)] text-[var(--foreground)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mx-auto max-w-7xl px-6 py-20"
            >
                <div className="grid gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight">
                            Deploy<span className="text-zinc-400">X</span>
                        </h3>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
                            Git-based deployment platform powered by Kubernetes.
                            Build, deploy, and scale without friction.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Product</h4>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                            <li>
                                <Link href="#features" className="hover:text-[var(--foreground)] transition">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-[var(--foreground)] transition">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Company</h4>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources / Social */}
                    <div>
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Resources</h4>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                            <li>
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    className="hover:text-[var(--foreground)] transition"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://twitter.com/"
                                    target="_blank"
                                    className="hover:text-[var(--foreground)] transition"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--foreground)] transition">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-sm text-zinc-500">
                        © {new Date().getFullYear()} DeployX. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm text-zinc-500">
                        <Link href="#" className="hover:text-[var(--foreground)] transition">
                            Privacy
                        </Link>
                        <Link href="#" className="hover:text-[var(--foreground)] transition">
                            Terms
                        </Link>
                        <Link href="#" className="hover:text-[var(--foreground)] transition">
                            Security
                        </Link>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
