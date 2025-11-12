"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Community Q&A helps our distributed team collaborate async. Accepted answers become living documentation that is always accessible.",
    author: "Ananya Desai",
    role: "Engineering Manager, Helix Labs"
  },
  {
    quote:
      "The moderation and gamification loops keep quality answers flowing. Our onboarding time dropped by almost 40%.",
    author: "Marcus Liu",
    role: "CTO, Launchbase"
  },
  {
    quote:
      "I landed my first developer advocate role after building reputation here. The feedback loop is unmatched.",
    author: "Zara Malik",
    role: "Community Engineer, OrbitOS"
  }
];

export const Testimonials = () => (
  <section className="border-b border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <div className="space-y-3 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Social proof</span>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Loved by builders worldwide</h2>
        <p className="text-sm text-slate-400 md:text-base">
          Teams, indie hackers, and content creators rely on Community Q&A to share knowledge and push projects forward.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.blockquote
            key={item.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.45 }}
            className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-soft backdrop-blur"
          >
            <p className="text-sm leading-relaxed text-slate-300">{item.quote}</p>
            <footer className="mt-auto">
              <p className="text-sm font-semibold text-white">{item.author}</p>
              <p className="text-xs text-slate-400">{item.role}</p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

