import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable GlassCard component with customizable blur, hover dynamics, and borders.
 */
export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  variant = 'default', // 'default', 'subtle', 'highlight'
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel text-slate-900 dark:text-slate-100',
    subtle: 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm text-slate-800 dark:text-slate-200',
    highlight: 'bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5 text-slate-900 dark:text-slate-100'
  };

  const Component = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        whileTap: onClick ? { scale: 0.985 } : undefined,
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`p-5 md:p-6 rounded-2xl md:rounded-3xl ${variantStyles[variant] || variantStyles.default} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};
