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
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { HelpfulFeedbackWidget } from './components/common/HelpfulFeedbackWidget';
import { GovernmentFooter } from './components/common/GovernmentFooter';

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
        {activeTab === 'account' && (
          <AccountPage 
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}
        {activeTab === 'admin' && (
          <AdminPage onBackToApp={() => setActiveTab('home')} />
        )}
      </main>

      {/* Global Was This Helpful Farmer Feedback Widget */}
      <HelpfulFeedbackWidget />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelect={handleCommandSelect}
      />

      {/* Professional Government Resources Footer */}
      <GovernmentFooter onNavigateTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
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
