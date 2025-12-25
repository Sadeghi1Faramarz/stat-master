
"use client";

import { BrainCircuit, BarChart3, Calculator, Dices } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "مفاهیم پایه",
    icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
    href: "/dashboard/concepts",
    color: "cyan",
  },
  {
    title: "سازماندهی داده",
    icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
    href: "/dashboard/data",
    color: "purple",
  },
  {
    title: "شاخص‌های آماری",
    icon: <Calculator className="w-8 h-8 text-amber-400" />,
    href: "/dashboard/measures",
    color: "amber",
  },
   {
    title: "احتمالات",
    icon: <Dices className="w-8 h-8 text-green-400" />,
    href: "/dashboard/probability",
    color: "green",
  },
];

export default function FeatureGrid() {
  return (
    <section className="w-full px-4 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <Link href={feature.href} key={i} className="group relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all group-hover:bg-white/10 group-hover:border-white/20 text-center"
            >
              <div className="mb-4 p-3 bg-white/5 rounded-full ring-1 ring-white/10">
                {feature.icon}
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white">
                {feature.title}
              </h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
