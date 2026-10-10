import React from 'react';

/**
 * Animated organic backdrop with soft blurred green, teal, and amber blobs.
 * Creates the organic, nature-inspired fluid backdrop required for authentic glassmorphism.
 */
export const GlassBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Base radial ambient glow */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-900/60 to-slate-950 dark:via-slate-950/80 dark:to-black" />

      {/* Floating Emerald Green Blob */}
      <div 
        className="animate-blob-1 absolute -top-40 -left-40 w-96 md:w-[600px] h-96 md:h-[600px] rounded-full mix-blend-screen filter blur-[90px] md:blur-[130px] opacity-40 dark:opacity-30"
        style={{ background: 'radial-gradient(circle, #22C55E 0%, #15803D 60%, transparent 80%)' }}
      />

      {/* Floating Teal & Forest Blob */}
      <div 
        className="animate-blob-2 absolute top-1/3 -right-40 w-80 md:w-[650px] h-80 md:h-[650px] rounded-full mix-blend-screen filter blur-[100px] md:blur-[140px] opacity-35 dark:opacity-25"
        style={{ background: 'radial-gradient(circle, #0D9488 0%, #0F3D2E 60%, transparent 80%)' }}
      />

      {/* Floating Harvest Amber Blob */}
      <div 
        className="animate-blob-3 absolute -bottom-32 left-1/4 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full mix-blend-screen filter blur-[90px] md:blur-[130px] opacity-30 dark:opacity-20"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, #B45309 60%, transparent 80%)' }}
      />

      {/* Subtle fine mesh dot overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
