"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export const CallToAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        className="relative mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary backdrop-blur"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>✨</span>
          <span>Ready to get started?</span>
        </motion.div>

        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          Join thousands of developers
          <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
            building together
          </span>
        </h2>

        <p className="mb-10 text-lg text-slate-400 md:text-xl">
          Start asking questions, sharing knowledge, and growing your reputation today.
        </p>

        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!isAuthenticated ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                >
                  <span className="relative z-10">Create Free Account</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-slate-600 hover:bg-slate-900"
                >
                  Sign In
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/ask"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
              >
                <span className="relative z-10">Ask Your First Question</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
