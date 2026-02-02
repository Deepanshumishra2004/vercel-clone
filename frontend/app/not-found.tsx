"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-zinc-100 px-4">
      <motion.h1
        className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        404
      </motion.h1>

      <motion.p
        className="mt-4 text-xl text-zinc-400 max-w-md text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Oops! The page you’re looking for doesn’t exist. Maybe try going back home?
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition"
        >
          Go Home
        </Link>
      </motion.div>

      {/* Optional cute element */}
      <motion.div
        className="mt-12 w-24 h-24 rounded-full bg-indigo-600 animate-bounce"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      />
    </div>
  );
}
