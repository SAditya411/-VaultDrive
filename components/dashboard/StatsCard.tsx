'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export default function StatsCard({ label, value, icon: Icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card rounded-2xl p-5 border border-white/8 hover:border-white/16 transition-all duration-300 group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={18} className="text-white" />
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-white tracking-tight mb-1">{value}</p>

      {/* Label */}
      <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}
