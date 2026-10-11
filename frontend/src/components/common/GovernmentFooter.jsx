import React from 'react';
import { 
  Sprout, 
  ExternalLink, 
  PhoneCall, 
  ShieldCheck, 
  Download, 
  Share2, 
  Heart,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { GOV_RESOURCES_CONFIG, FOOTER_LINKS_CONFIG } from '../../services/governmentResources';

export const GovernmentFooter = ({ onNavigateTab }) => {
  const { lang } = useLanguage();

  const handleShareApp = () => {
    const text = '🌾 MandiSetu: भारतीय किसानों के लिए दैनिक मंडी भाव, 7-दिवसीय AI पूर्वानुमान और कब बेचें की सटीक सलाह। देखें: ' + window.location.origin;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <footer className="w-full border-t border-emerald-500/20 glass-panel bg-slate-950/90 text-slate-300 backdrop-blur-2xl mt-auto">
      {/* 1. GOVERNMENT RESOURCES & DATA SOURCES STRIP (Prompt Part 4B) */}
      <div className="w-full bg-emerald-950/40 border-b border-emerald-500/20 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
                {lang === 'hi' ? 'भारत सरकार संसाधन एवं आधिकारिक डेटा स्रोत' : 'Government of India Resources & Official Portals'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {lang === 'hi' ? 'क्लिक करने पर आधिकारिक सरकारी पोर्टल नई विंडो में खुलेगा' : 'Opens official government portal in a new tab'}
            </span>
          </div>

          {/* Responsive Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
            {GOV_RESOURCES_CONFIG.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-400/50 flex flex-col justify-between transition-all group"
                title={`${res.name} - ${res.desc}`}
              >
                <div>
                  <span className="text-[9px] uppercase font-extrabold text-emerald-400 tracking-wider block">
                    {res.tag}
                  </span>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center justify-between mt-1">
                    <span>{res.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-1">
                  {lang === 'hi' ? res.titleHi : res.desc}
                </div>
              </a>
            ))}
          </div>

          {/* Strict Non-Endorsement Statutory Notice */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>महत्वपूर्ण वैधानिक स्पष्टीकरण (Statutory Disclaimer):</strong> मंडीसेतु (MandiSetu) एक स्वतंत्र डिजिटल कृषि परामर्श मंच है और भारत सरकार अथवा किसी राज्य सरकार का आधिकारिक पोर्टल नहीं है। यहाँ प्रदर्शित सभी सरकारी नाम व लिंक केवल किसानों की सुविधा एवं आधिकारिक डेटा स्रोतों (data.gov.in / Agmarknet) के संदर्भ हेतु दिए गए हैं।
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                Mandi<span className="text-emerald-400">Setu</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {lang === 'hi'
                ? 'देश के छोटे व सीमांत किसानों को बाज़ार के सही भाव, 7 दिनों का विश्वसनीय एआई पूर्वानुमान और सटीक बिक्री सलाह देकर सशक्त बनाना।'
                : 'Empowering smallholder farmers across India with transparent APMC auction intelligence, 7-day Prophet AI predictions, and sell/wait advisory.'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleShareApp}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp पर साझा करें</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'hi' ? 'सेवाएं व उपकरण' : 'Services & Tools'}
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS_CONFIG.services.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab(item.path)}
                    className="text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    {lang === 'hi' ? item.labelHi : item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kisan Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'hi' ? 'किसान सहायता केंद्र' : 'Kisan Support'}
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS_CONFIG.support.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab(item.path)}
                    className="text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    {lang === 'hi' ? item.labelHi : item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'hi' ? 'कानूनी व डेटा नीति' : 'Legal & Compliance'}
            </h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS_CONFIG.legal.map((item, idx) => (
                <li key={idx}>
                  <span className="text-slate-400">
                    {lang === 'hi' ? item.labelHi : item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>अंतिम डेटा समन्वय: आज <strong>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</strong> (Agmarknet Live)</span>
          </div>

          <div>
            <span>© 2024-2026 MandiSetu. Built for Indian Farmers 🌾</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
