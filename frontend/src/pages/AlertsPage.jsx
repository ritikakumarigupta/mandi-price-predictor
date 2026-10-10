import React, { useState } from 'react';
import { Bell, Plus, Trash2, Send, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, crop: 'Wheat (गेहूं)', mandi: 'Patna City APMC', targetPrice: 2500, condition: 'above', active: true },
    { id: 2, crop: 'Onion (प्याज)', mandi: 'Muzaffarpur Main', targetPrice: 1700, condition: 'below', active: true },
  ]);

  const [crop, setCrop] = useState('Wheat (गेहूं)');
  const [mandi, setMandi] = useState('Patna City APMC');
  const [price, setPrice] = useState('2550');
  const [condition, setCondition] = useState('above');
  const [telegramLinked, setTelegramLinked] = useState(false);

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!price) return;
    setAlerts([
      ...alerts,
      {
        id: Date.now(),
        crop,
        mandi,
        targetPrice: Number(price),
        condition,
        active: true,
      }
    ]);
    setPrice('');
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleToggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
          Price Alert Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Receive automated Telegram & SMS alerts when prices cross your profitability threshold.
        </p>
      </div>

      {/* Telegram Connect Pill */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-teal-500/10 border-teal-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Telegram Bot Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {telegramLinked ? 'Bot connected: @MandiSetuBot' : 'Connect with our Telegram bot for instant price pings'}
            </p>
          </div>
        </div>

        <GlassButton
          onClick={() => setTelegramLinked(!telegramLinked)}
          size="sm"
          variant={telegramLinked ? 'secondary' : 'primary'}
        >
          {telegramLinked ? 'Disconnect' : 'Connect Telegram'}
        </GlassButton>
      </GlassCard>

      {/* Add Alert Form */}
      <GlassCard className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" />
          Create New Price Threshold Alert
        </h2>

        <form onSubmit={handleAddAlert} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl glass-panel bg-white/70 dark:bg-slate-800 text-sm font-medium"
            >
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Rice (धान)">Rice (धान)</option>
              <option value="Onion (प्याज)">Onion (प्याज)</option>
              <option value="Potato (आलू)">Potato (आलू)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl glass-panel bg-white/70 dark:bg-slate-800 text-sm font-medium"
            >
              <option value="above">Price Rises Above (अधिक हो)</option>
              <option value="below">Price Falls Below (कम हो)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Price (₹/quintal)</label>
            <input
              type="number"
              placeholder="e.g. 2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl glass-panel bg-white/70 dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex items-end">
            <GlassButton type="submit" size="md" className="w-full">
              Set Alert
            </GlassButton>
          </div>
        </form>
      </GlassCard>

      {/* Active Alerts List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Active Mandi Alerts ({alerts.length})
        </h3>
        {alerts.map((a) => (
          <GlassCard key={a.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${a.active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-500'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {a.crop}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notify when rate is <strong>{a.condition} ₹{a.targetPrice}</strong> at {a.mandi}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleAlert(a.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                  a.active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-400'
                }`}
              >
                {a.active ? 'Enabled' : 'Paused'}
              </button>
              <button
                onClick={() => handleDeleteAlert(a.id)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                title="Delete Alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
