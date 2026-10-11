import React, { useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { GlassBackground } from './components/common/GlassBackground';
import { GlassNavbar } from './components/navigation/GlassNavbar';
import { CommandPalette } from './components/navigation/CommandPalette';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PriceTrendPage } from './pages/PriceTrendPage';
import { NearbyMandiPage } from './pages/NearbyMandiPage';
import { CropComparePage } from './pages/CropComparePage';
import { AlertsPage } from './pages/AlertsPage';
import { KisanSupportPage } from './pages/KisanSupportPage';
import { HelpfulFeedbackWidget } from './components/common/HelpfulFeedbackWidget';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    stateId: 'BR',
    districtId: 'patna',
    mandiId: 'patna_city',
    cropId: 'wheat'
  });

  const handleNavigateToDashboard = (params) => {
    setSearchParams(params);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommandSelect = (item) => {
    setSearchParams(prev => ({ ...prev, ...item }));
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-500/20">
      {/* Background Animated Blobs */}
      <GlassBackground />

      {/* Sticky Glass Navbar */}
      <GlassNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 transition-all duration-300">
        {activeTab === 'home' && (
          <HomePage onNavigateToDashboard={handleNavigateToDashboard} />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage
            searchParams={searchParams}
            onBack={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'trends' && <PriceTrendPage />}
        {activeTab === 'nearby' && <NearbyMandiPage />}
        {activeTab === 'compare' && <CropComparePage />}
        {activeTab === 'alerts' && <AlertsPage />}
        {activeTab === 'support' && <KisanSupportPage />}
      </main>

      {/* Global Was This Helpful Farmer Feedback Widget */}
      <HelpfulFeedbackWidget />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelect={handleCommandSelect}
      />

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-white/20 glass-panel bg-white/20 dark:bg-slate-950/40 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">MandiSetu</span> — AI Agritech Platform.
            Data synced from data.gov.in & Agmarknet.
          </div>
          <div className="flex items-center gap-6">
            <span>Forecasts are guidance, not a guarantee.</span>
            <span>Made for Indian Farmers 🌾</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
