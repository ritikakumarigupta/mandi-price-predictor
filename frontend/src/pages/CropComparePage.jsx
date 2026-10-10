import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { Layers } from 'lucide-react';

export const CropComparePage = () => {
  const [selectedCrops, setSelectedCrops] = useState(['wheat', 'rice']);

  const comparisonData = [
    { date: '10 Sep', wheat: 2310, rice: 2180, onion: 1600, potato: 1350 },
    { date: '18 Sep', wheat: 2350, rice: 2210, onion: 1720, potato: 1380 },
    { date: '25 Sep', wheat: 2380, rice: 2240, onion: 1790, potato: 1400 },
    { date: '02 Oct', wheat: 2420, rice: 2260, onion: 1810, potato: 1410 },
    { date: '10 Oct', wheat: 2480, rice: 2290, onion: 1850, potato: 1440 },
  ];

  const availableCrops = [
    { id: 'wheat', name: 'Wheat (गेहूं)', color: '#22C55E' },
    { id: 'rice', name: 'Rice / Paddy (धान)', color: '#0D9488' },
    { id: 'onion', name: 'Onion (प्याज)', color: '#F59E0B' },
    { id: 'potato', name: 'Potato (आलू)', color: '#EC4899' },
  ];

  const toggleCrop = (id) => {
    if (selectedCrops.includes(id)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter(c => c !== id));
      }
    } else {
      if (selectedCrops.length < 3) {
        setSelectedCrops([...selectedCrops, id]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          Multi-Crop Analysis
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
          Crop & Mandi Comparison Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compare up to 3 crops or commodities simultaneously to discover relative harvest margins.
        </p>
      </div>

      {/* Select Crop Pills */}
      <div className="flex gap-3 flex-wrap">
        {availableCrops.map(crop => {
          const isSelected = selectedCrops.includes(crop.id);
          return (
            <button
              key={crop.id}
              onClick={() => toggleCrop(crop.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50 shadow-md'
                  : 'glass-panel bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 border-white/20'
              }`}
            >
              {crop.name} {isSelected ? '✓' : '+'}
            </button>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <GlassCard className="p-6 md:p-8 space-y-4">
        <div className="h-[380px] sm:h-[440px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                }}
              />
              <Legend />
              {selectedCrops.includes('wheat') && (
                <Line type="monotone" dataKey="wheat" name="Wheat (गेहूं)" stroke="#22C55E" strokeWidth={3} />
              )}
              {selectedCrops.includes('rice') && (
                <Line type="monotone" dataKey="rice" name="Rice (धान)" stroke="#0D9488" strokeWidth={3} />
              )}
              {selectedCrops.includes('onion') && (
                <Line type="monotone" dataKey="onion" name="Onion (प्याज)" stroke="#F59E0B" strokeWidth={3} />
              )}
              {selectedCrops.includes('potato') && (
                <Line type="monotone" dataKey="potato" name="Potato (आलू)" stroke="#EC4899" strokeWidth={3} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
