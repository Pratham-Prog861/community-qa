"use client";

import { motion } from "framer-motion";

export const CommunityHighlights = () => {
  const highlights = [
    {
      icon: "👥",
      number: "10K+",
      label: "Active Members",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "💬",
      number: "50K+",
      label: "Questions Answered",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "⭐",
      number: "95%",
      label: "Satisfaction Rate",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "🚀",
      number: "24/7",
      label: "Community Support",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Trusted by developers worldwide
          </h2>
          <p className="text-lg text-slate-400">
            Join a thriving community of passionate developers
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-all hover:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10" 
                   style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              
              <motion.div
                className="mb-4 text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {item.icon}
              </motion.div>
              
              <div className={`mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-3xl font-bold text-transparent`}>
                {item.number}
              </div>
              
              <div className="text-sm font-medium text-slate-300">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
