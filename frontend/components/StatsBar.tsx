"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsBar = () => {
  const stats = [
    { label: "Questions", value: 15000, suffix: "+" },
    { label: "Answers", value: 45000, suffix: "+" },
    { label: "Users", value: 10000, suffix: "+" },
    { label: "Daily Active", value: 2500, suffix: "+" }
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/50 px-4 py-12 backdrop-blur">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="mb-2 text-3xl font-bold text-white md:text-4xl"
                whileHover={{ scale: 1.1 }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <div className="text-sm text-slate-400 md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
