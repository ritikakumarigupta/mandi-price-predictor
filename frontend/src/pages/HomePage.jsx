import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Sprout, 
  ArrowRight, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  TrendingUp, 
  Store,
  Compass,
  Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { mandiApi } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';

export const HomePage = ({ onNavigateToDashboard }) => {
  const { t, lang } = useLanguage();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandis, setMandis] = useState([]);
  const [crops, setCrops] = useState([]);
  const [ticker, setTicker] = useState([]);

  const [selectedState, setSelectedState] = useState('BR');
  const [selectedDistrict, setSelectedDistrict] = useState('patna');
  const [selectedMandi, setSelectedMandi] = useState('patna_city');
  const [selectedCrop, setSelectedCrop] = useState('wheat');

  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');

  useEffect(() => {
    // Load metadata
    mandiApi.getStates().then(setStates);
    mandiApi.getCrops().then(setCrops);
    mandiApi.getTickerData().then(setTicker);
  }, []);

  useEffect(() => {
    if (selectedState) {
      mandiApi.getDistricts(selectedState).then(dists => {
        setDistricts(dists);
        if (dists.length > 0 && !dists.some(d => d.id === selectedDistrict)) {
          setSelectedDistrict(dists[0].id);
        }
      });
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      mandiApi.getMandis(selectedDistrict).then(mndis => {
        setMandis(mndis);
        if (mndis.length > 0 && !mndis.some(m => m.id === selectedMandi)) {
          setSelectedMandi(mndis[0].id);
        }
      });
    }
  }, [selectedDistrict]);

  // Voice Search with Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'hi' ? 'आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है।' : 'Voice search is not supported on this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechFeedback(lang === 'hi' ? 'सुन रहा हूँ... बोलिए (उदा: गेहूं पटना)' : 'Listening... Say crop or mandi (e.g. Wheat Patna)');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setSpeechFeedback(`Recognized: "${transcript}"`);
      setIsListening(false);

      // Simple heuristic match for crops
      if (transcript.includes('wheat') || transcript.includes('गेहूं')) setSelectedCrop('wheat');
      else if (transcript.includes('rice') || transcript.includes('चावल') || transcript.includes('धान')) setSelectedCrop('rice');
      else if (transcript.includes('onion') || transcript.includes('प्याज')) setSelectedCrop('onion');
      else if (transcript.includes('potato') || transcript.includes('आलू')) setSelectedCrop('potato');

      // Auto trigger search
      setTimeout(() => {
        handleCheckPrice();
      }, 900);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpeechFeedback(lang === 'hi' ? 'आवाज़ पहचानी नहीं जा सकी, पुनः प्रयास करें।' : 'Could not understand audio, please retry.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCheckPrice = () => {
    onNavigateToDashboard({
      stateId: selectedState,
      districtId: selectedDistrict,
      mandiId: selectedMandi,
      cropId: selectedCrop,
    });
  };

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-16">
      {/* Live Running Ticker Strip */}
      <div className="w-full overflow-hidden py-3 glass-panel bg-white/40 dark:bg-slate-900/40 border-y border-white/20 backdrop-blur-md">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Mandi Ticker
          </div>
          {ticker.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-sm font-medium shrink-0 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                {lang === 'hi' ? item.cropHi : item.crop}
              </span>
              <span className="text-xs text-slate-500">({item.mandi})</span>
              <span className="font-bold">{item.price}</span>
              <span className={`text-xs font-bold ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.change}
              </span>
              <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-4 md:pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{t.hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-white drop-shadow-sm leading-[1.15]"
          >
            {t.hero.title1}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-slate-200 dark:text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>

        {/* Hero Glass Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 md:mt-12 max-w-4xl mx-auto"
        >
          <div className="glass-panel p-6 sm:p-8 rounded-3xl md:rounded-[32px] bg-slate-900/85 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl">
            {/* Header within search */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {lang === 'hi' ? 'मंडी भाव व भविष्यवाणी खोजें' : 'Select Location & Crop'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {lang === 'hi' ? 'सटीक परिणाम पाने के लिए अपनी नज़दीकी मंडी चुनें' : 'Choose your nearest APMC for tailored AI forecasts'}
                  </p>
                </div>
              </div>

              {/* Voice Search action */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
                title="Voice Search in Hindi/English"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{t.hero.voiceSearch}</span>
              </button>
            </div>

            {speechFeedback && (
              <div className="mb-4 text-xs font-medium text-emerald-300 bg-emerald-500/20 px-3 py-2 rounded-xl border border-emerald-500/40">
                {speechFeedback}
              </div>
            )}

            {/* Cascading 4-Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* State Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.hero.selectState}
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl glass-panel bg-white/70 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-slate-900 dark:text-white font-medium text-sm appearance-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {states.map((st) => (
                      <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                        {lang === 'hi' ? st.nameHi : st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.hero.selectDistrict}
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 text-white font-medium text-sm appearance-none focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {lang === 'hi' ? d.nameHi : d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mandi Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.hero.selectMandi}
                </label>
                <div className="relative">
                  <select
                    value={selectedMandi}
                    onChange={(e) => setSelectedMandi(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 text-white font-medium text-sm appearance-none focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {mandis.map((m) => (
                      <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                        {lang === 'hi' ? m.nameHi : m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Crop Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.hero.selectCrop}
                </label>
                <div className="relative">
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 text-white font-medium text-sm appearance-none focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Check Price CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/50 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                🔒 {t.disclaimer}
              </span>

              <GlassButton
                onClick={handleCheckPrice}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                {t.hero.checkPrice}
              </GlassButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works (3 Glass Steps) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            {lang === 'hi' ? 'यह कैसे काम करता है?' : 'How MandiSetu Works'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'hi' ? '3 सरल कदमों में सही मंडी भाव व फसल बेचने की सटीक सलाह' : 'Three simple steps to maximize your crop revenue'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'दैनिक एगमार्कनेट डेटा' : 'Official APMC Ingestion'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'सरकारी पोर्टल से 500+ मंडियों के न्यूनतम, अधिकतम और मॉडल भाव सीधे प्राप्त होते हैं।'
                : 'Direct sync with official data.gov.in and Agmarknet feeds for verified wholesale mandi rates.'}
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-500 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'प्रॉफ़ेट एआई पूर्वानुमान' : 'Prophet Time-Series AI'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'मौसम, आवक व ऐतिहासिक रुझानों के आधार पर 7 दिनों का मूल्य अनुमान कॉन्फिडेंस बैंड सहित।'
                : 'Robust Prophet machine learning models compute weekly forecast bounds with seasonality analysis.'}
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'सरल बेचना/रुकना फैसला' : 'Actionable Sell/Wait Verdict'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'हरे/लाल/पीले स्पष्ट संकेत और हिंदी बोलकर सलाह जिससे किसान तुरंत सही निर्णय ले सकें।'
                : 'Clear green (Wait), red (Sell Now), and yellow (Stable) alerts with Hindi audio readout.'}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Startup Stats Counters */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-emerald-500">
                520+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {t.stats.mandis}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-teal-400">
                48+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {t.stats.crops}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-amber-400">
                12,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {t.stats.forecasts}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-emerald-400">
                91.4%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {t.stats.accuracy}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
