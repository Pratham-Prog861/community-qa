"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Intelligent Search",
    description: "Find the best answers instantly with full-text search across titles, tags, and accepted solutions.",
    metric: "Precision boosted by 38% with curated ranking."
  },
  {
    title: "Reputation that Matters",
    description: "Earn points for valuable contributions, unlock badges, and climb the leaderboard.",
    metric: "+10K point earners highlighted weekly."
  },
  {
    title: "Moderation Toolkit",
    description: "Built-in admin dashboard to flag, review, and resolve content issues at scale.",
    metric: "Moderators resolve reports 2x faster."
  }
];

export const FeatureGrid = () => (
  <section className="border-b border-slate-900 bg-slate-950">
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Built for serious knowledge sharing</h2>
        <p className="mt-3 text-base text-slate-400 md:text-lg">
          From authentication to analytics, get everything you need to run a modern community.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-soft backdrop-blur transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <h3 className="relative text-xl font-semibold text-white">{feature.title}</h3>
            <p className="relative text-sm leading-relaxed text-slate-400">{feature.description}</p>
            <p className="relative text-xs font-medium uppercase tracking-wide text-primary">{feature.metric}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

