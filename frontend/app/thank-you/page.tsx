
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black text-[var(--foreground)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full border border-zinc-800 rounded-2xl p-10 bg-zinc-900/40"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-4">🎉 You’re all set!</h1>
        <p className="text-zinc-400 mb-8">
          Thank you for signing up. Your account has been successfully created
          and you're now ready to deploy production-grade applications.
        </p>

        {/* CONFIRMATION */}
        <div className="mb-10">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-zinc-400 space-y-2 list-disc list-inside">
            <li>Create your first project</li>
            <li>Connect your Git repository</li>
            <li>Deploy instantly and view real-time logs</li>
          </ul>
        </div>

        {/* MINI SURVEY (SEGMENTATION) */}
        <div className="mb-10">
          <h3 className="font-semibold mb-3">Help us personalize your experience</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <select className="bg-black border border-zinc-800 rounded-lg px-4 py-3">
              <option>Role</option>
              <option>Student</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Founder</option>
            </select>
            <select className="bg-black border border-zinc-800 rounded-lg px-4 py-3">
              <option>Primary Goal</option>
              <option>Side Projects</option>
              <option>Startup MVP</option>
              <option>Learning DevOps</option>
            </select>
          </div>
        </div>

        {/* SOCIAL PROOF */}
        <div className="mb-10">
          <blockquote className="border-l-4 border-purple-500 pl-4 text-zinc-300 italic">
            “This feels exactly like Vercel, but I control everything.”
            <span className="block text-sm text-zinc-500 mt-2">— Early User</span>
          </blockquote>
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <a
            href="https://twitter.com"
            target="_blank"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">Share on Twitter</Button>
          </a>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-zinc-500 mt-8">
          Pro tip: Bookmark your dashboard to monitor deployments faster 🚀
        </p>
      </motion.div>
    </div>
  );
}

/* =====================================================
   DESIGN INTENT
===================================================== */

// Audience: Developers, students, indie hackers, founders
// Offer: Vercel-like deployment platform
// Primary Objective: Activation + Retention
// Expectation after conversion: Confirmation + Clear next steps

// This thank-you page reinforces decision confidence,
// collects segmentation data, and pushes users toward activation
