import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassButton with responsive touch heights (min 48px), tactile micro-interactions,
 * and high-contrast color accents for low-literacy clarity.
 */
export const GlassButton = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost', 'amber'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeStyles = {
    sm: 'min-h-[42px] px-4 py-2 text-sm rounded-xl gap-1.5',
    md: 'min-h-[48px] px-6 py-2.5 text-base rounded-2xl gap-2 font-medium',
    lg: 'min-h-[56px] px-8 py-3.5 text-lg rounded-2xl gap-3 font-semibold shadow-md',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30',
    secondary:
      'bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-white/30 dark:border-white/15 shadow-sm',
    amber:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/25 border border-amber-400/30',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-red-500/25 border border-red-400/30',
    ghost:
      'hover:bg-white/10 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-transparent',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`inline-flex items-center justify-center select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 shrink-0" />}
        </>
      )}
    </motion.button>
  );
};
