"use client";

import { motion } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Ask with context",
    description: "Capture the scenario, expected behavior, and what you've already tried. Rich formatting makes it easy to skim."
  },
  {
    id: "02",
    title: "Collaborate in real time",
    description: "Mentors, peers, and top contributors jump in with code snippets, references, and step-by-step guidance."
  },
  {
    id: "03",
    title: "Grow your reputation",
    description: "Earn points and badges for accepted answers, thoughtful feedback, and curating the knowledge base."
  }
];

export const HowItWorks = () => (
  <section className="border-b border-slate-900 bg-slate-950">
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <div className="space-y-3 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Workflow</span>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Ship outcomes faster</h2>
        <p className="text-sm text-slate-400 md:text-base">
          Every interaction is designed to move you from question to solution with minimal friction.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.article
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left shadow-soft backdrop-blur"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">{step.id}</span>
            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

