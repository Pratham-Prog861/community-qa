"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export const Hero = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative mx-auto max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary backdrop-blur"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Join 10,000+ developers worldwide
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            Where developers
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              learn together
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mb-10 max-w-2xl text-lg text-slate-400 md:text-xl"
            variants={itemVariants}
          >
            Ask questions, share knowledge, and grow your skills in a community built by developers, for developers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            variants={itemVariants}
          >
            {!isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/signup"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                  >
                    <span className="relative z-10">Get Started Free</span>
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
                    href="/questions"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-slate-600 hover:bg-slate-900"
                  >
                    Explore Questions
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/ask"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                  >
                    <span className="relative z-10">Ask a Question</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/questions"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-slate-600 hover:bg-slate-900"
                  >
                    Browse Questions
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Floating cards */}
          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-3"
            variants={itemVariants}
          >
            <motion.div
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="mb-2 text-2xl">⚡</div>
              <div className="text-sm font-semibold text-white">Fast Answers</div>
              <div className="text-xs text-slate-400">Get responses in minutes</div>
            </motion.div>
            <motion.div
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur"
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <div className="mb-2 text-2xl">🎯</div>
              <div className="text-sm font-semibold text-white">Expert Community</div>
              <div className="text-xs text-slate-400">Learn from the best</div>
            </motion.div>
            <motion.div
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur"
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <div className="mb-2 text-2xl">🏆</div>
              <div className="text-sm font-semibold text-white">Earn Reputation</div>
              <div className="text-xs text-slate-400">Build your profile</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
