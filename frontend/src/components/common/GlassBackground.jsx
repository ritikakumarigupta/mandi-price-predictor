import React from 'react';

/**
 * Animated organic backdrop with vivid green and emerald lighting effects.
 * Brings back the rich nature atmosphere and green ambient light glow.
 */
export const GlassBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Base rich deep nature background */}
      <div className="absolute inset-0 bg-[#05130e] dark:bg-[#030d0a]" />

      {/* Primary Vivid Emerald Green Light Bloom (Top-Left to Center) */}
      <div 
        className="animate-blob-1 absolute -top-24 -left-20 w-[500px] md:w-[750px] h-[500px] md:h-[750px] rounded-full mix-blend-screen filter blur-[100px] md:blur-[140px] opacity-70"
        style={{ background: 'radial-gradient(circle, #22C55E 0%, #15803D 50%, transparent 75%)' }}
      />

      {/* Secondary Vibrant Forest & Lime Light Bloom (Center-Right) */}
      <div 
        className="animate-blob-2 absolute top-1/4 -right-24 w-[450px] md:w-[700px] h-[450px] md:h-[700px] rounded-full mix-blend-screen filter blur-[110px] md:blur-[150px] opacity-65"
        style={{ background: 'radial-gradient(circle, #10B981 0%, #047857 50%, #064E3B 75%, transparent 90%)' }}
      />

      {/* Accent Golden Harvest Amber Light Bloom (Bottom-Left) */}
      <div 
        className="animate-blob-3 absolute -bottom-20 left-1/3 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full mix-blend-screen filter blur-[100px] md:blur-[140px] opacity-50"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, #059669 45%, transparent 75%)' }}
      />

      {/* Ambient Top Center Emerald Ray Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 rounded-full mix-blend-screen filter blur-[120px] opacity-40"
        style={{ background: 'radial-gradient(ellipse at top, #4ADE80 0%, #059669 50%, transparent 80%)' }}
      />

      {/* Subtle fine mesh dot overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #86EFAC 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
};
