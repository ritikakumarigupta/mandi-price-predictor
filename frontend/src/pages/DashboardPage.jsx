import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  FileText,
  Calendar,
  Layers,
  MapPin,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { mandiApi } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PriceCard } from '../components/common/PriceCard';
import { VerdictBadge } from '../components/common/VerdictBadge';
import { DataSourceBadge, isOlderThan24Hours } from '../components/common/DataSourceBadge';
import { StorageCalculator } from '../components/common/StorageCalculator';

export const DashboardPage = ({ searchParams, onBack }) => {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchDetails = () => {
    setLoading(true);
    mandiApi.getPriceInsights({
      mandiId: searchParams?.mandiId || 'patna_city',
      cropId: searchParams?.cropId || 'wheat',
    }).then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [searchParams]);

  // Hindi/English Text-to-Speech Advice Reader
  const handleListenAdvice = () => {
    if (!data) return;
    if (!('speechSynthesis' in window)) {
      alert('Text to speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const message = lang === 'hi' 
      ? `आज का मंडी भाव। न्यूनतम भाव ${data.today.minPrice} रुपये, अधिकतम भाव ${data.today.maxPrice} रुपये, और मॉडल भाव ${data.today.modalPrice} रुपये प्रति क्विंटल है। एआई की सलाह है: ${data.verdict.status === 'WAIT' ? 'इंतजार करें। भाव बढ़ने की संभावना है।' : data.verdict.status === 'SELL NOW' ? 'अभी बेचें। भाव गिर सकते हैं।' : 'भाव स्थिर रहने की उम्मीद है।'}`
      : `Today's mandi price update. Minimum price is ${data.today.minPrice} rupees, maximum is ${data.today.maxPrice} rupees, modal rate is ${data.today.modalPrice} rupees per quintal. AI recommendation is: ${data.verdict.status}.`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // WhatsApp share
  const handleShare = () => {
    if (!data) return;
    const shareText = `🌾 MandiSetu Live Price Alert\n📍 Mandi: ${searchParams?.mandiId || 'Patna'}\n🌾 Crop: ${data.cropName}\n💰 Modal Price: ₹${data.today.modalPrice}/quintal\n📈 Recommendation: ${data.verdict.status}\nCheck live at: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleToggleFavorite = () => {
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 rounded-2xl glass-panel shimmer-active" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 rounded-3xl glass-panel shimmer-active" />
          <div className="h-36 rounded-3xl glass-panel shimmer-active" />
          <div className="h-36 rounded-3xl glass-panel shimmer-active" />
        </div>
        <div className="h-44 rounded-3xl glass-panel shimmer-active" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl glass-panel bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-all cursor-pointer"
            title="Back to Search"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                APMC Verified
              </span>
              <DataSourceBadge
                source={data?.source || 'Agmarknet (data.gov.in)'}
                timestamp={data?.today?.updatedAt}
                lang={lang}
              />
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              {data?.cropImage ? (
                <img 
                  src={data.cropImage} 
                  alt={data.cropName} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-lg shrink-0"
                />
              ) : (
                <span className="text-3xl">{data?.cropIcon || '🌾'}</span>
              )}
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                {data?.cropName} — Rate Dashboard
              </h1>
            </div>
          </div>
        </div>

        {/* Action Buttons: Speak, Share, Favorite */}
        <div className="flex items-center gap-2 flex-wrap">
          <GlassButton
            onClick={handleListenAdvice}
            variant={isSpeaking ? 'danger' : 'secondary'}
            size="sm"
            icon={Volume2}
          >
            {isSpeaking 
              ? (lang === 'hi' ? 'रोकें' : 'Stop')
              : (lang === 'hi' ? 'सलाह सुनें' : 'Listen Advice')}
          </GlassButton>

          <GlassButton
            onClick={handleShare}
            variant="secondary"
            size="sm"
            icon={Share2}
          >
            Share
          </GlassButton>

          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-2xl glass-panel border transition-all cursor-pointer ${
              isSaved 
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' 
                : 'bg-white/30 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-white/20'
            }`}
            title="Bookmark this Mandi"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stale Data Warning Banner (> 24 hours old) */}
      {isOlderThan24Hours(data?.today?.updatedAt) && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex items-center gap-3 backdrop-blur-md">
          <span className="text-xl">⚠️</span>
          <div>
            <h4 className="font-bold text-sm text-amber-100">
              {lang === 'hi' ? 'यह डेटा पुराना हो सकता है (24 घंटे से अधिक)' : 'This data might be outdated (> 24 hours)'}
            </h4>
            <p className="text-xs text-amber-300/90 mt-0.5">
              {lang === 'hi' 
                ? 'सरकारी मंडी आज बंद हो सकती है या नया डेटा अभी तक अपलोड नहीं हुआ है। कृपया अंतिम अपडेट समय देखें।'
                : 'The APMC mandi might be closed or latest trade arrivals have not been uploaded to data.gov.in yet.'}
            </p>
          </div>
        </div>
      )}

      {/* 3 Price Cards (Min, Modal, Max) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PriceCard
          title={lang === 'hi' ? 'न्यूनतम भाव (Min Price)' : 'Minimum Price'}
          price={data?.today?.minPrice}
          subtitle="Lowest recorded deal today"
        />
        <PriceCard
          title={lang === 'hi' ? 'मॉडल भाव (Modal Rate)' : 'Modal Price (Most Traded)'}
          price={data?.today?.modalPrice}
          isHighlight={true}
          changePct={data?.today?.changePct}
          subtitle="Official baseline for farmer settlement"
        />
        <PriceCard
          title={lang === 'hi' ? 'अधिकतम भाव (Max Price)' : 'Maximum Price'}
          price={data?.today?.maxPrice}
          subtitle="Top grade / premium quality lot"
        />
      </div>

      {/* Big Verdict Badge */}
      <VerdictBadge verdict={data?.verdict} />

      {/* 7-Day Forecast Summary Strip */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'अगले 7 दिनों का पूर्वानुमान (Prophet AI)' : '7-Day Prophet AI Forecast Summary'}
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            ±3.2% Expected Range
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {data?.forecast?.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl glass-panel bg-white/40 dark:bg-slate-800/40 text-center border border-white/20 dark:border-white/5"
            >
              <div className="text-xs font-bold text-slate-500 uppercase">
                {day.day}
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{day.forecastPrice}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ₹{day.lowerBound} - ₹{day.upperBound}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Storage vs Sell-Now Calculator (Prompt 12) */}
      <StorageCalculator
        todayPrice={data?.today?.modalPrice || 2480}
        forecastPrice={data?.verdict?.targetPrice || 2600}
        lang={lang}
      />
    </div>
  );
};
