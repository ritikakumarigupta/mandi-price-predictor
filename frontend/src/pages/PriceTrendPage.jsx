import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Download, FileSpreadsheet, Calendar, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';

export const PriceTrendPage = () => {
  const [range, setRange] = useState('30D');

  // Simulated trend series with historical modal and projected forecast band
  const data = [
    { date: '10 Sep', historical: 2310, forecast: null, upper: null, lower: null },
    { date: '15 Sep', historical: 2340, forecast: null, upper: null, lower: null },
    { date: '20 Sep', historical: 2380, forecast: null, upper: null, lower: null },
    { date: '25 Sep', historical: 2350, forecast: null, upper: null, lower: null },
    { date: '30 Sep', historical: 2420, forecast: null, upper: null, lower: null },
    { date: '05 Oct', historical: 2450, forecast: 2450, upper: 2450, lower: 2450 },
    // Forecast points
    { date: '07 Oct', historical: null, forecast: 2490, upper: 2540, lower: 2440 },
    { date: '09 Oct', historical: null, forecast: 2530, upper: 2600, lower: 2470 },
    { date: '11 Oct', historical: null, forecast: 2580, upper: 2660, lower: 2510 },
    { date: '13 Oct', historical: null, forecast: 2610, upper: 2710, lower: 2530 },
  ];

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Historical_Price,Forecast_Price,Upper_Band,Lower_Band\n";
    data.forEach(row => {
      csvContent += `${row.date},${row.historical || ''},${row.forecast || ''},${row.upper || ''},${row.lower || ''}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mandi_price_trend_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Prophet ML Confidence Band
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            Wheat (गेहूं) — Price Trends & 7-Day Forecast
          </h1>
        </div>

        {/* Range Selector & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-2xl p-1 glass-panel bg-white/40 dark:bg-slate-900/60 border border-white/20">
            {['7D', '30D', '90D', '1Y'].map(t => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  range === t
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <GlassButton
            onClick={handleExportCSV}
            variant="secondary"
            size="sm"
            icon={FileSpreadsheet}
          >
            Export CSV
          </GlassButton>
        </div>
      </div>

      {/* Main Glass Chart Card */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/50 dark:border-white/10 pb-4">
          <div className="flex items-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300">Historical Modal Price</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-teal-400" />
              <span className="text-slate-700 dark:text-slate-300">7-Day Prophet AI Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-teal-500/20 border border-teal-500/40" />
              <span className="text-slate-700 dark:text-slate-300">Confidence Interval (±3.5%)</span>
            </div>
          </div>
        </div>

        <div className="h-[380px] sm:h-[440px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#forecastBand)" />
              <Area type="monotone" dataKey="historical" stroke="#22C55E" strokeWidth={3} fill="url(#historicalGrad)" />
              <Area type="monotone" dataKey="forecast" stroke="#0D9488" strokeWidth={3} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
