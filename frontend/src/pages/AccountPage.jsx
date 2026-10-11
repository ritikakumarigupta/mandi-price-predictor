import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  Sprout, 
  MapPin, 
  Bell, 
  Trash2, 
  Download, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Edit2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { useLanguage } from '../hooks/useLanguage';
import { authService, otpProvider, USER_ROLES } from '../services/authService';
import { MOCK_CROPS, MOCK_STATES } from '../services/mockData';

export const AccountPage = ({ onNavigateToDashboard, onNavigateToAdmin }) => {
  const { lang } = useLanguage();
  const [user, setUser] = useState(() => authService.getCurrentUser());

  // Login / OTP Flow States
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        state: user.state || 'Bihar',
        district: user.district || 'Patna',
        village: user.village || '',
        landSizeAcres: user.landSizeAcres || 3.5,
        notificationChannel: user.notificationChannel || 'whatsapp',
      });
    }
  }, [user]);

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await otpProvider.sendOtp(mobileInput);
      setOtpSent(true);
      setDemoOtpHint(res.debugCode);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Verify OTP & Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const loggedUser = await authService.loginWithOtp(mobileInput, otpInput);
      setUser(loggedUser);
      setOtpSent(false);
      setOtpInput('');
      setDemoOtpHint('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle();
      setUser(loggedUser);
    } catch (err) {
      setAuthError(err.message || 'Google sign-in error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsEditing(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = authService.updateProfile(editForm);
    setUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm(lang === 'hi' 
      ? 'क्या आप सुनिश्चित हैं? आपका सारा डेटा और प्राथमिकताएं मिटा दी जाएंगी (DPDP Act अनुपालन)।'
      : 'Are you sure? All your preferences and data will be permanently erased.')) {
      authService.deleteAccount();
      setUser(null);
    }
  };

  // Saved Tickets & Calculations
  const savedTickets = JSON.parse(localStorage.getItem('mandisetu_tickets') || '[]')
    .filter(t => !user || t.mobile === user.mobile);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in pb-16">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Compliant • Safe & Secure</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white mt-1">
            {lang === 'hi' ? 'किसान खाता व \'मेरी फसल\' डैशबोर्ड' : 'Farmer Account & My Harvest Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'hi'
              ? 'बिना लॉगिन के भी सभी भाव व भविष्यवाणियां उपलब्ध हैं। लॉगिन करने से आपकी फसलें, अलर्ट और टिकट सुरक्षित रहते हैं।'
              : 'All market prices & AI forecasts remain 100% free without login. Sign in to save preferred mandis, alerts, and tickets.'}
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            {user.role === USER_ROLES.ADMIN && (
              <button
                onClick={onNavigateToAdmin}
                className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                ⚙️ Admin Panel
              </button>
            )}
            <GlassButton
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              icon={LogOut}
            >
              {lang === 'hi' ? 'लॉगआउट' : 'Log Out'}
            </GlassButton>
          </div>
        )}
      </div>

      {/* SECTION 1: IF NOT LOGGED IN -> OTP AUTH CARD */}
      {!user ? (
        <div className="max-w-md mx-auto">
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'hi' ? 'मोबाइल नंबर से सुरक्षित प्रवेश' : 'Farmer Mobile Login'}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'hi' 
                  ? 'कोई पासवर्ड याद रखने की ज़रूरत नहीं। सिर्फ 10 अंकों का नंबर डालें।' 
                  : 'Fast OTP-based login. No password required.'}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर' : '10-Digit Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm text-slate-400 font-bold">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-emerald-500/30 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    * टिप: एडमिन एक्सेस के लिए <strong>9876543299</strong> का प्रयोग करें।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    DPDP सहमति: हम आपके नंबर का उपयोग सिर्फ मंडी अलर्ट भेजने हेतु करते हैं। किसी तीसरे पक्ष को डेटा नहीं बेचा जाता।
                  </span>
                </div>

                <GlassButton
                  type="submit"
                  size="md"
                  disabled={authLoading || mobileInput.length !== 10}
                  className="w-full"
                >
                  {authLoading 
                    ? (lang === 'hi' ? 'ओटीपी भेजा जा रहा है...' : 'Sending OTP...') 
                    : (lang === 'hi' ? 'ओटीपी प्राप्त करें' : 'Get OTP')}
                </GlassButton>

                {/* Google Sign-in Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                    {lang === 'hi' ? 'या (OR)' : 'OR'}
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                {/* Continue with Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.99] border border-slate-200"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{lang === 'hi' ? 'Google के साथ आगे बढ़ें (Continue with Google)' : 'Continue with Google'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ओटीपी भेजा गया: +91-{mobileInput}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      SMS Dispatched ✉️
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    आपके मोबाइल फोन पर एसएमएस (SMS) भेजा गया है।
                  </p>

                  {demoOtpHint && (
                    <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-[11px] text-slate-300">मोबाइल स्क्रीन / तुरंत लॉगिन कोड:</span>
                      <strong className="text-emerald-400 font-mono text-base tracking-widest">{demoOtpHint}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    {lang === 'hi' ? '6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-emerald-500/30 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <GlassButton
                  type="submit"
                  size="md"
                  disabled={authLoading || otpInput.length < 6}
                  className="w-full"
                >
                  {authLoading ? 'सत्यापित हो रहा है...' : 'ओटीपी सत्यापित करें (Login)'}
                </GlassButton>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-xs text-slate-400 hover:text-white text-center cursor-pointer"
                >
                  ← दूसरा नंबर दर्ज करें
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      ) : (
        /* SECTION 2: LOGGED IN USER PROFILE & 'MERI FASAL' DASHBOARD */
        <div className="space-y-8">
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>किसान प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!</span>
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <GlassCard className="lg:col-span-8 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/30">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{user.name}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>📱 {user.maskedMobile}</span>
                      <span>•</span>
                      <span>📍 {user.village}, {user.district} ({user.state})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'रद्द करें' : 'संपादित करें'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="pt-3 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">पूरा नाम</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">गाँव / क्षेत्र</label>
                      <input
                        type="text"
                        value={editForm.village}
                        onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">ज़मीन का आकार (एकड़)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editForm.landSizeAcres}
                        onChange={(e) => setEditForm({ ...editForm, landSizeAcres: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">सूचना का माध्यम</label>
                      <select
                        value={editForm.notificationChannel}
                        onChange={(e) => setEditForm({ ...editForm, notificationChannel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 text-white text-xs focus:outline-none"
                      >
                        <option value="whatsapp">WhatsApp संदेश</option>
                        <option value="sms">सामान्य एसएमएस (SMS)</option>
                        <option value="none">कोई सूचना नहीं</option>
                      </select>
                    </div>
                  </div>

                  <GlassButton type="submit" size="sm">
                    बदलाव सहेजें (Save Profile)
                  </GlassButton>
                </form>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60">
                    <span className="text-slate-400 text-[10px] uppercase block">ज़मीन</span>
                    <span className="font-bold text-white">{user.landSizeAcres} एकड़</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60">
                    <span className="text-slate-400 text-[10px] uppercase block">पसंदीदा भाषा</span>
                    <span className="font-bold text-emerald-400">हिन्दी (Hindi)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60">
                    <span className="text-slate-400 text-[10px] uppercase block">अलर्ट चैनल</span>
                    <span className="font-bold text-white">{user.notificationChannel?.toUpperCase()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60">
                    <span className="text-slate-400 text-[10px] uppercase block">पंजीकरण</span>
                    <span className="font-bold text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* DPDP Act Privacy Controls */}
            <GlassCard className="lg:col-span-4 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>डिजिटल डेटा सुरक्षा (DPDP 2023)</span>
              </h3>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                आपके डेटा पर आपका पूरा नियंत्रण है। आप जब चाहें अपनी सारी जानकारी डाउनलोड कर सकते हैं या हमेशा के लिए मिटा सकते हैं।
              </p>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  onClick={authService.exportUserData}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>डेटा डाउनलोड करें (Export JSON)</span>
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>खाता व डेटा मिटाएं (Delete Account)</span>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* 'MERI FASAL' PERSONALIZED DASHBOARD (Prompt Part 2.4) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <span>मेरी फसल डैशबोर्ड (My Saved Crops & Live Rates)</span>
              </h3>
              <span className="text-xs text-slate-400">
                {user.cropsGrown?.length || 0} फ़सलें सक्रिय
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_CROPS.slice(0, 3).map((crop) => (
                <GlassCard key={crop.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={crop.image} 
                        alt={crop.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-400/40"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{crop.name}</h4>
                        <span className="text-[10px] text-slate-400">Patna City APMC</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      WAIT (+3.8%)
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-slate-400">आज का भाव:</span>
                      <div className="text-2xl font-black text-white font-heading">₹{crop.basePrice}</div>
                    </div>
                    {crop.msp && (
                      <div className="text-right text-[11px] text-emerald-400">
                        MSP: ₹{crop.msp}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigateToDashboard({
                      stateId: 'BR',
                      districtId: 'patna',
                      mandiId: 'patna_city',
                      cropId: crop.id,
                    })}
                    className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>विस्तृत पूर्वानुमान देखें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* MY TICKETS & ALERTS SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                <span>मेरे सहायता टिकट ({savedTickets.length})</span>
              </h4>
              {savedTickets.length === 0 ? (
                <p className="text-xs text-slate-400">अभी कोई सक्रिय सहायता टिकट नहीं है।</p>
              ) : (
                <div className="space-y-2">
                  {savedTickets.slice(0, 3).map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{t.ticketId}</span>
                        <div className="text-slate-300 text-[11px]">{t.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-6 space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <span>सक्रिय भाव अलर्ट</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Wheat (गेहूं)</span>
                    <div className="text-slate-400 text-[11px]">लक्ष्य: ₹2,550 से अधिक (Patna City APMC)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    सक्रिय (Active)
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
