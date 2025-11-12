"use client";

import { motion } from "framer-motion";

export const TrustSection = () => {
  const features = [
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry-standard security"
    },
    {
      icon: "🎓",
      title: "Learn from Experts",
      description: "Get answers from experienced developers and industry professionals"
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Connect with developers from around the world, 24/7"
    },
    {
      icon: "📈",
      title: "Track Progress",
      description: "Earn reputation points and badges as you contribute to the community"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
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
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Why developers choose us
          </h2>
          <p className="text-lg text-slate-400">
            Built with developers in mind, designed for collaboration
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur transition-all hover:border-primary/50"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <motion.div
                className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="relative mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              
              <p className="relative text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
