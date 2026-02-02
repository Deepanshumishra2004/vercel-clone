"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

import heroImg3 from "@/public/images/3.png";
import heroImg1 from "@/public/images/1.jpg";
import heroImg2 from "@/public/images/2.jpg";
import heroImg4 from "@/public/images/4.jpg";
// Use a relative path string for the video file
const vercelDemoVideo = "/video/vercelDemoVideo.webm";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-[72px]">
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-40">
        <div className="grid items-center gap-16 md:grid-cols-2 py-10">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300 backdrop-blur">
              ⚡ Git → Kubernetes → Live
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Deploy apps
              <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                without friction
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm text-zinc-400 font-mono">
              A Vercel-like platform powered by Kubernetes. Push to Git, stream
              logs live, scale automatically.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-block rounded-xl border-2 border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-mono font-semibold text-white hover:bg-zinc-900 transition"
              >
                Start for free
              </Link>

              <Link
                href="#features"
                className="inline-block rounded-xl border-2 border-zinc-800 px-6 py-3 text-sm font-mono font-semibold text-zinc-400 hover:bg-zinc-900 transition"
              >
                See how it works
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-40 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative group border-2 border-zinc-800 rounded-2xl bg-zinc-950 p-2 shadow-2xl"
            >
              {/* Floating + subtle rotate loop */}
              <motion.div
                animate={{
                  y: [0, -12, 0], // float up and down
                  rotate: [0, 2, 0, -2, 0], // slow 3D tilt effect
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                className="rounded-xl overflow-hidden"
              >
                <Image
                  src={heroImg3}
                  alt="DeployX dashboard"
                  className="rounded-xl shadow-xl"
                />
              </motion.div>

              {/* Glow overlay */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-purple-500/20 pointer-events-none"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </section>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-40 flex justify-center perspective-1000">
        <motion.div
          className="relative group border-2 border-zinc-800 rounded-2xl bg-zinc-950 p-2 shadow-2xl"
        >
          {/* Floating + small tilt for depth */}
          <motion.div

            className="rounded-xl overflow-hidden"
          >
          <video
            src={vercelDemoVideo}
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl shadow-xl w-full h-auto"
          />
          </motion.div>

          {/* Glow overlay */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r  pointer-events-none"

          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border-2 border-zinc-800 rounded-2xl bg-zinc-950 p-4 font-mono text-zinc-100 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-zinc-800 shadow-inner">
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 text-xl font-bold">{f.title}</h3>
              <p className="mt-1 text-xs text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-6 pb-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-2 border-zinc-800 rounded-2xl bg-zinc-950 p-12 font-mono text-zinc-100 shadow-lg hover:shadow-2xl transition"
        >
          <h2 className="text-2xl font-bold">Ship faster. Stay focused.</h2>
          <p className="mt-2 text-xs text-zinc-400">
            We handle infra, builds, logs, and scaling — you ship code.
          </p>

          <Link
            href="/auth/signup"
            className="mt-6 inline-block border-2 border-zinc-800 rounded-xl bg-zinc-950 px-8 py-3 font-mono font-semibold text-white hover:bg-zinc-900 transition"
          >
            Create your account
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

const FEATURES = [
  {
    image: heroImg2,
    title: "Instant Deployments",
    desc: "Every push triggers a clean, isolated Kubernetes build.",
  },
  {
    image: heroImg1,
    title: "Live Logs",
    desc: "Stream container logs in real time during build and runtime.",
  },
  {
    image: heroImg4,
    title: "Kubernetes Native",
    desc: "Built on containers for reliability, scalability, and control.",
  },
];
