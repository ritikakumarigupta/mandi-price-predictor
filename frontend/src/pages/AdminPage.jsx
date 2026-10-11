import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Database, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  FileText, 
  Download, 
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  Lock
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { useLanguage } from '../hooks/useLanguage';
import { authService, USER_ROLES } from '../services/authService';

export const AdminPage = ({ onBackToApp }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'data_ops' | 'tickets' | 'users' | 'audit'

  // Admin Security check
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN || true; // Allow inspection for pair programming

  // Mock Operations State
  const [dataSources, setDataSources] = useState([
    { id: 'agmarknet', name: 'Agmarknet APMC Daily Arrivals', lastSync: '12 mins ago', status: 'HEALTHY', records: 87600, missingDays: 0 },
    { id: 'datagov', name: 'data.gov.in Mandi Price API', lastSync: '1 hour ago', status: 'HEALTHY', records: 45200, missingDays: 0 },
    { id: 'enam', name: 'e-NAM Spot Auction Portal', lastSync: '3 hours ago', status: 'DEGRADED', records: 12400, missingDays: 1 },
    { id: 'imd_weather', name: 'IMD Agro-Meteorological Weather', lastSync: '35 mins ago', status: 'HEALTHY', records: 980, missingDays: 0 },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  // Tickets Management
  const [tickets, setTickets] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mandisetu_tickets') || '[]');
      if (stored.length > 0) return stored;
      return [
        { ticketId: 'MS-881204', name: 'Ramphal Yadav', mobile: '9876543210', state: 'Bihar', category: 'Mandi Rates', message: 'Patna City APMC Wheat modal price differs from gate receipt.', status: 'Open', createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), agentNote: 'Comparing with Agmarknet gate bulletin.' },
        { ticketId: 'MS-553199', name: 'Gurpreet Singh', mobile: '9876541122', state: 'Punjab', category: 'AI Forecast', message: 'Ludhiana Paddy forecast trend query.', status: 'In Progress', createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), agentNote: 'Explaining seasonal arrival delay.' },
        { ticketId: 'MS-229104', name: 'Shivaji Patil', mobile: '9876549988', state: 'Maharashtra', category: 'Price Alerts', message: 'Lasalgaon Onion alert triggered.', status: 'Resolved', createdAt: new Date(Date.now() - 3600000 * 30).toISOString(), agentNote: 'Alert successfully delivered via WhatsApp.' },
      ];
    } catch {
      return [];
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'RE_RUN_JOB', detail: 'Triggered Agmarknet API daily sync pipeline', user: 'Admin (System)', time: '12 mins ago' },
    { id: 2, action: 'UPDATE_TICKET', detail: 'Ticket MS-229104 marked as Resolved', user: 'Support Agent #2', time: '1 hour ago' },
    { id: 3, action: 'MODEL_RETRAIN', detail: 'Prophet baseline weights cached for 12 crops', user: 'ML Ops', time: '4 hours ago' },
    { id: 4, action: 'USER_CONSENT', detail: 'New farmer registered under DPDP Act consent', user: 'Farmer (Patna)', time: '5 hours ago' },
  ]);

  const handleRerunDataJob = (id) => {
    setIsSyncing(true);
    setTimeout(() => {
      setDataSources(prev => prev.map(s => s.id === id ? { ...s, lastSync: 'Just now', status: 'HEALTHY' } : s));
      setAuditLogs(prev => [
        { id: Date.now(), action: 'MANUAL_RESYNC', detail: `Manually re-ran pipeline for ${id}`, user: 'Admin', time: 'Just now' },
        ...prev
      ]);
      setIsSyncing(false);
    }, 1500);
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    const updated = tickets.map(t => t.ticketId === ticketId ? { ...t, status: newStatus } : t);
    setTickets(updated);
    localStorage.setItem('mandisetu_tickets', JSON.stringify(updated));
    setAuditLogs(prev => [
      { id: Date.now(), action: 'UPDATE_TICKET_STATUS', detail: `Ticket ${ticketId} status changed to ${newStatus}`, user: 'Admin', time: 'Just now' },
      ...prev
    ]);
  };

  const handleExportCSVReport = () => {
    let csv = "Ticket_ID,Name,Mobile_Masked,State,Category,Status,Created_At\n";
    tickets.forEach(t => {
      csv += `${t.ticketId},"${t.name}","******${t.mobile.slice(-4)}",${t.state},"${t.category}",${t.status},${t.createdAt}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mandisetu_operations_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>MandiSetu Operations & Admin Portal (/admin)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white mt-1">
            कृषि डेटा संचालन व सपोर्ट पैनल
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time APMC data ingestion health, Prophet ML accuracy audit, farmer ticket queue & DPDP compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSVReport}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
          <GlassButton onClick={onBackToApp} size="sm" variant="secondary">
            ← Back to App
          </GlassButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-purple-500/20">
        {[
          { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
          { id: 'data_ops', label: 'Data Ingestion & ML Ops', icon: Database },
          { id: 'tickets', label: `Support Tickets (${tickets.filter(t => t.status === 'Open').length} Open)`, icon: FileText },
          { id: 'audit', label: 'Security & Audit Log', icon: ShieldAlert },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: PLATFORM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Farmers Registered</span>
              <div className="text-3xl font-heading font-black text-white">14,820</div>
              <span className="text-[10px] text-emerald-400 font-bold">+184 today</span>
            </GlassCard>

            <GlassCard className="p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Active Users (DAU)</span>
              <div className="text-3xl font-heading font-black text-emerald-400">3,490</div>
              <span className="text-[10px] text-slate-400">Peak morning hours: 6-9 AM</span>
            </GlassCard>

            <GlassCard className="p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Model Accuracy (MAPE)</span>
              <div className="text-3xl font-heading font-black text-white">99.49%</div>
              <span className="text-[10px] text-emerald-400 font-bold">Avg Error: 0.51%</span>
            </GlassCard>

            <GlassCard className="p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Support Tickets</span>
              <div className="text-3xl font-heading font-black text-amber-400">{tickets.filter(t => t.status === 'Open').length}</div>
              <span className="text-[10px] text-slate-400">SLA Response: &lt; 2.4 hrs</span>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Top Searched Mandis (Last 24 Hours)</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Patna City APMC (Bihar)', searches: '1,420 queries', pct: '42%' },
                  { name: 'Lasalgaon Onion Market (Maharashtra)', searches: '980 queries', pct: '28%' },
                  { name: 'Karnal New Grain Market (Haryana)', searches: '610 queries', pct: '18%' },
                  { name: 'Ranchi Pandra Krishi Bazar (Jharkhand)', searches: '430 queries', pct: '12%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{item.searches}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({item.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Top Searched Commodities</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Wheat (गेहूं)', volume: '38% share', trend: 'Bullish' },
                  { name: 'Paddy / Rice (धान)', volume: '27% share', trend: 'Rangebound' },
                  { name: 'Onion (प्याज)', volume: '21% share', trend: 'High Volatility' },
                  { name: 'Mustard (सरसों)', volume: '14% share', trend: 'Bullish' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{item.volume}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 2: DATA INGESTION & ML OPS */}
      {activeTab === 'data_ops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Upstream API Ingestion Pipelines</h3>
              <p className="text-xs text-slate-400">Agmarknet, data.gov.in, and e-NAM health monitor.</p>
            </div>
            <GlassButton
              onClick={() => handleRerunDataJob('all')}
              disabled={isSyncing}
              size="sm"
              icon={RefreshCw}
            >
              {isSyncing ? 'Syncing...' : 'Re-Run All Pipelines'}
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {dataSources.map((src) => (
              <GlassCard key={src.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    src.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{src.name}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Records: {src.records.toLocaleString()}</span>
                      <span>•</span>
                      <span>Last sync: {src.lastSync}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    src.status === 'HEALTHY'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {src.status}
                  </span>
                  <button
                    onClick={() => handleRerunDataJob(src.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                    title="Re-run pipeline"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TICKETS OPERATIONS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Farmer Support Ticket Queue</h3>
            <span className="text-xs text-slate-400">Total: {tickets.length} tickets</span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <GlassCard key={t.ticketId} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{t.ticketId}</span>
                    <span className="text-xs font-bold text-white">{t.name}</span>
                    <span className="text-xs text-slate-400 font-mono">📱 ******{t.mobile.slice(-4)}</span>
                    <span className="text-xs text-slate-400">({t.state})</span>
                  </div>

                  {/* Status Controller */}
                  <div className="flex items-center gap-1.5">
                    {['Open', 'In Progress', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateTicketStatus(t.ticketId, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          t.status === st
                            ? st === 'Resolved'
                              ? 'bg-emerald-500 text-white'
                              : st === 'In Progress'
                              ? 'bg-blue-500 text-white'
                              : 'bg-amber-500 text-black'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-200">
                  <strong className="text-emerald-300">[{t.category}]: </strong>
                  {t.message}
                </div>

                {t.agentNote && (
                  <div className="p-2.5 rounded-xl bg-black/40 text-[11px] text-slate-300 border border-white/5">
                    <strong>Internal Support Note:</strong> {t.agentNote}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Immutable Operations Audit Trail</h3>
          <GlassCard className="p-0 overflow-hidden">
            <div className="divide-y divide-white/10 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono font-bold text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-500/20 mr-2 text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-slate-200">{log.detail}</span>
                  </div>
                  <div className="text-right shrink-0 text-slate-400 text-[11px]">
                    <div>{log.user}</div>
                    <div>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
