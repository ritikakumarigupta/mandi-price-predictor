import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const VerdictBadge = ({ verdict, size = 'lg' }) => {
  const { t } = useLanguage();

  if (!verdict) return null;

  const config = {
    wait: {
      label: t.verdict.wait,
      reason: t.verdict.waitReason,
      bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500 text-white',
      icon: TrendingUp,
    },
    sell: {
      label: t.verdict.sell,
      reason: t.verdict.sellReason,
      bg: 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-400',
      glow: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-500 text-white',
      icon: TrendingDown,
    },
    stable: {
      label: t.verdict.stable,
      reason: t.verdict.stableReason,
      bg: 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-500 text-white',
      icon: Minus,
    },
  };

  const style = config[verdict.key] || config.stable;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-2xl md:rounded-3xl p-5 border backdrop-blur-xl shadow-xl ${style.bg} ${style.glow} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3.5 rounded-2xl ${style.badgeBg} shadow-md`}>
          <Icon className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider opacity-75">
            AI Harvest Recommendation
          </span>
          <h3 className="text-2xl md:text-3xl font-heading font-black tracking-tight">
            {style.label}
          </h3>
        </div>
      </div>

      <div className="md:max-w-md text-sm md:text-base font-medium opacity-90 leading-snug">
        <p>{style.reason}</p>
        {verdict.targetPrice && (
          <p className="mt-1 text-xs opacity-75">
            Expected 7-day Target: <span className="font-bold">₹{verdict.targetPrice}</span> ({verdict.expectedChangePct > 0 ? `+${verdict.expectedChangePct}` : verdict.expectedChangePct}%)
          </p>
        )}
      </div>
    </motion.div>
  );
};
