import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

export const PriceCard = ({ title, price, subtitle, isHighlight = false, changePct = null }) => {
  const isPositive = changePct > 0;
  const isNegative = changePct < 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative p-5 rounded-3xl border transition-all ${
        isHighlight
          ? 'bg-gradient-to-br from-emerald-500/20 via-white/10 to-transparent dark:from-emerald-500/15 dark:via-slate-800/40 border-emerald-500/40 shadow-xl shadow-emerald-500/10'
          : 'glass-panel bg-white/60 dark:bg-slate-900/40 border-white/40 dark:border-white/10 shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span>{title}</span>
        {changePct !== null && (
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : isNegative
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                : 'bg-slate-500/15 text-slate-600 dark:text-slate-400'
            }`}
          >
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? `+${changePct}%` : `${changePct}%`}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-xl font-bold text-slate-400">₹</span>
        <span className="text-3xl md:text-4xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
          {price ? price.toLocaleString('en-IN') : '--'}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">/ quintal</span>
      </div>

      {subtitle && (
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
