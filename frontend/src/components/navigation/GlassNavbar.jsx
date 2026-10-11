import React, { useState } from 'react';
import { 
  Sprout, 
  Sun, 
  Moon, 
  Languages, 
  Menu, 
  X, 
  TrendingUp, 
  MapPin, 
  Bell, 
  Layers, 
  Sparkles,
  Command,
  LifeBuoy,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { GlassButton } from '../common/GlassButton';

export const GlassNavbar = ({ activeTab, onSelectTab, onOpenCommandPalette }) => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLanguage, supportedLanguages, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'dashboard', label: t.nav.dashboard, icon: Sparkles },
    { id: 'trends', label: t.nav.trends, icon: TrendingUp },
    { id: 'nearby', label: t.nav.nearby, icon: MapPin },
    { id: 'compare', label: t.nav.compare, icon: Layers },
    { id: 'alerts', label: t.nav.alerts, icon: Bell },
    { id: 'support', label: t.nav.support || 'किसान सहायता', icon: LifeBuoy },
    { id: 'account', label: t.nav.account || 'मेरा खाता', icon: UserCheck },
  ];

  const handleNavClick = (id) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-3xl glass-panel bg-slate-900/80 shadow-2xl border border-emerald-500/20 backdrop-blur-2xl">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
              Mandi<span className="text-emerald-400">Setu</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              AI Forecast
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - Emerald Glow Hover without White Flash */}
        <div className="hidden lg:flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-emerald-500/15">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30 border border-emerald-400/40'
                    : 'text-slate-200 hover:text-emerald-300 hover:bg-emerald-500/15'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4 opacity-90" />}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Ctrl+K, Lang, Theme, Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Command Trigger (Ctrl+K) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all cursor-pointer"
            title="Search Mandi or Crop"
          >
            <Command className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-black/40 text-emerald-300 border border-emerald-500/30">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-7 pr-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer text-white bg-emerald-950/70 border border-emerald-500/30 hover:border-emerald-400 transition-colors appearance-none focus:outline-none shadow-sm"
              title="Select Language"
              aria-label="Select app language"
            >
              {supportedLanguages.map(l => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.label}
                </option>
              ))}
            </select>
            <Languages className="w-3.5 h-3.5 text-emerald-400 absolute left-2 pointer-events-none" />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl cursor-pointer text-slate-200 bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 transition-colors"
            title="Toggle Dark/Light Mode"
            aria-label="Toggle dark/light theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-200 bg-emerald-950/60 border border-emerald-500/30"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl glass-panel bg-slate-950/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-base font-semibold transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300'
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5 text-emerald-400" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
