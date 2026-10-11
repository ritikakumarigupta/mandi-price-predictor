import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

/**
 * Storage vs Sell-Now Calculator for Farmers (Prompt 12).
 * Compares immediate liquidation vs holding stock taking into account:
 * - quantity (quintals)
 * - today's modal price
 * - forecast future price
 * - storage cost / quintal / day
 * - spoilage / weight loss percentage
 */
export const StorageCalculator = ({ todayPrice = 2480, forecastPrice = 2600, lang = 'hi' }) => {
  const [quantity, setQuantity] = useState(50); // 50 quintals
  const [holdingDays, setHoldingDays] = useState(7); // 7 days
  const [storageCostPerDay, setStorageCostPerDay] = useState(2.5); // ₹2.5/quintal/day
  const [spoilagePct, setSpoilagePct] = useState(1.5); // 1.5% loss

  // Net calculation if sold now
  const immediateRevenue = Math.round(quantity * todayPrice);

  // Net calculation if stored and sold later
  const totalStorageFee = Math.round(quantity * storageCostPerDay * holdingDays);
  const effectiveQuantity = quantity * (1 - spoilagePct / 100);
  const grossFutureRevenue = Math.round(effectiveQuantity * forecastPrice);
  const netFutureRevenue = Math.round(grossFutureRevenue - totalStorageFee);

  const profitDifference = netFutureRevenue - immediateRevenue;
  const isHoldingProfitable = profitDifference > 0;

  return (
    <GlassCard className="p-6 md:p-8 space-y-6 bg-slate-900/85 border border-emerald-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              {lang === 'hi' ? 'अभी बेचें या स्टोर करें? (मुनाफ़ा कैलकुलेटर)' : 'Sell Now vs. Store Calculator'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'hi' 
                ? 'स्टोरेज खर्च और नमी/वजन नुकसान घटाकर सटीक तुलना देखें' 
                : 'Factor in warehouse fees and weight shrinkage to find true profit'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-emerald-400 uppercase">
            {lang === 'hi' ? 'मात्रा (क्विंटल)' : 'Quantity (q)'}
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-emerald-400 uppercase">
            {lang === 'hi' ? 'रोकने के दिन' : 'Holding Days'}
          </label>
          <input
            type="number"
            min="1"
            value={holdingDays}
            onChange={(e) => setHoldingDays(Number(e.target.value) || 0)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-emerald-400 uppercase">
            {lang === 'hi' ? 'स्टोरेज खर्च (₹/दिन/q)' : 'Storage (₹/day/q)'}
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={storageCostPerDay}
            onChange={(e) => setStorageCostPerDay(Number(e.target.value) || 0)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-emerald-400 uppercase">
            {lang === 'hi' ? 'वजन नुकसान (%)' : 'Shrinkage (%)'}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            value={spoilagePct}
            onChange={(e) => setSpoilagePct(Number(e.target.value) || 0)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Comparison Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Option 1: Sell Immediately */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-400">
            {lang === 'hi' ? 'विकल्प 1: आज ही मंडी में बेचें' : 'Option 1: Sell Today in Mandi'}
          </div>
          <div className="text-2xl font-black text-white">
            ₹{immediateRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400">
            {quantity} q × ₹{todayPrice}/q ({lang === 'hi' ? 'शून्य स्टोरेज खर्च' : 'Zero holding fee'})
          </div>
        </div>

        {/* Option 2: Store and Sell Later */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isHoldingProfitable 
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'hi' ? `विकल्प 2: ${holdingDays} दिन बाद बेचें` : `Option 2: Sell in ${holdingDays} Days`}
            </span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
              isHoldingProfitable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {isHoldingProfitable ? 'अनुशंसित (Recommended)' : 'नुकसान (Loss)'}
            </span>
          </div>

          <div className="text-2xl font-black text-white">
            ₹{netFutureRevenue.toLocaleString('en-IN')}
          </div>

          <div className="text-xs opacity-90">
            {isHoldingProfitable ? (
              <span className="font-bold text-emerald-300">
                +₹{profitDifference.toLocaleString('en-IN')} शुद्ध अतिरिक्त मुनाफ़ा (Net Gain)!
              </span>
            ) : (
              <span className="font-bold text-rose-300">
                -₹{Math.abs(profitDifference).toLocaleString('en-IN')} कम कमाई (स्टोरेज खर्च के कारण)।
              </span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
