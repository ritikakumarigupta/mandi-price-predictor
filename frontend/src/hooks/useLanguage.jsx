import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', state: 'Hindi' },
  { code: 'en', label: 'English', state: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', state: 'Punjab' },
  { code: 'mr', label: 'मराठी', state: 'Maharashtra' },
];

export const translations = {
  en: {
    brand: 'MandiSetu',
    tagline: 'Mandi Price Predictor & AI Advisory for Farmers',
    disclaimer: 'Forecasts are AI guidance based on historical APMC trends, not a statutory guarantee.',
    nav: {
      home: 'Home',
      dashboard: 'Live Rates',
      trends: 'Price Trends',
      nearby: 'All-India Mandi Map',
      compare: 'Compare Crops',
      alerts: 'Price Alerts',
      support: 'Kisan Support',
      account: 'My Account',
      admin: 'Admin Portal',
    },
    hero: {
      badge: 'All-India APMC Real-time Sync',
      title1: 'Empower Your Harvest with',
      title2: 'Smarter Market Intelligence',
      subtitle: 'Get accurate daily prices across 8 Indian States, 7-day Prophet AI forecasts, and simple Sell or Wait guidance.',
      checkPrice: 'Check Mandi Price',
      voiceSearch: 'Voice Search',
      selectState: 'Select State',
      selectDistrict: 'Select District',
      selectMandi: 'Select Mandi',
      selectCrop: 'Select Commodity/Crop'
    },
    verdict: {
      wait: 'WAIT (Hold Stock)',
      sell: 'SELL NOW (Peak Rate)',
      stable: 'STABLE (Rangebound)',
      waitReason: 'Price expected to surge in next 4-6 days due to low arrivals.',
      sellReason: 'Peak rate detected; incoming supply likely to dip rates soon.',
      stableReason: 'Prices likely to remain stable within 2-3% range.'
    },
    stats: {
      mandis: 'Mandis Covered',
      crops: 'Commodities',
      forecasts: 'Daily AI Forecasts',
      accuracy: 'Avg Model Accuracy'
    }
  },
  hi: {
    brand: 'मंडीसेतु',
    tagline: 'किसानों के लिए मंडी भाव पूर्वानुमान व एआई सलाह',
    disclaimer: 'अनुमान ऐतिहासिक डेटा पर आधारित मार्गदर्शन हैं, सरकारी या पक्की गारंटी नहीं।',
    nav: {
      home: 'होम',
      dashboard: 'ताज़ा भाव',
      trends: 'भाव रुझान',
      nearby: 'अखिल भारतीय मंडी नक्शा',
      compare: 'फसल तुलना',
      alerts: 'भाव अलर्ट',
      support: 'किसान सहायता',
      account: 'मेरा खाता',
      admin: 'प्रशासन (Admin)',
    },
    hero: {
      badge: 'अखिल भारतीय एगमार्कनेट लाइव समन्वय',
      title1: 'अपनी फसल का सही मोल पाएं,',
      title2: 'सटीक एआई मंडी भविष्यवाणियों से',
      subtitle: 'भारत के 8 राज्यों की मंडियों के ताज़ा भाव, 7 दिनों का पूर्वानुमान और कब बेचना है या रुकना है की सटीक सलाह।',
      checkPrice: 'भाव देखें',
      voiceSearch: 'बोलकर खोजें',
      selectState: 'राज्य चुनें',
      selectDistrict: 'ज़िला चुनें',
      selectMandi: 'मंडी चुनें',
      selectCrop: 'फसल / अनाज चुनें'
    },
    verdict: {
      wait: 'WAIT (इंतजार करें)',
      sell: 'SELL NOW (अभी बेचें)',
      stable: 'STABLE (स्थिर भाव)',
      waitReason: 'आने वाले 4-6 दिनों में आवक कम होने से भाव बढ़ने की संभावना है।',
      sellReason: 'वर्तमान भाव उच्चतम स्तर पर है; नई आवक से भाव गिर सकते हैं।',
      stableReason: 'अगले 7 दिनों में भाव 2-3% के सीमित दायरे में रहने की संभावना है।'
    },
    stats: {
      mandis: 'मंडियां शामिल',
      crops: 'फसलें व जिसें',
      forecasts: 'दैनिक एआई पूर्वानुमान',
      accuracy: 'मॉडल सटीकता दर'
    }
  },
  pa: {
    brand: 'ਮੰਡੀਸੇਤੂ',
    tagline: 'ਕਿਸਾਨਾਂ ਲਈ ਮੰਡੀ ਭਾਅ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਏਆਈ ਸਲਾਹ',
    disclaimer: 'ਅੰਦਾਜ਼ੇ ਇਤਿਹਾਸਕ ਅੰਕੜਿਆਂ ਤੇ ਆਧਾਰਿਤ ਹਨ, ਸਰਕਾਰੀ ਗਰੰਟੀ ਨਹੀਂ।',
    nav: {
      home: 'ਹੋਮ',
      dashboard: 'ਤਾਜ਼ਾ ਰੇਟ',
      trends: 'ਭਾਅ ਰੁਝਾਨ',
      nearby: 'ਆਲ-ਇੰਡੀਆ ਮੰਡੀ ਨਕਸ਼ਾ',
      compare: 'ਫ਼ਸਲ ਤੁਲਨਾ',
      alerts: 'ਰੇਟ ਅਲਰਟ',
      support: 'ਕਿਸਾਨ ਸਹਾਇਤਾ',
      account: 'ਮੇਰਾ ਖਾਤਾ',
      admin: 'ਐਡਮਿਨ',
    },
    hero: {
      badge: 'ਸਰਕਾਰੀ ਏਗਮਾਰਕਨੇਟ ਲਾਈਵ ਡੇਟਾ',
      title1: 'ਆਪਣੀ ਫ਼ਸਲ ਦਾ ਸਹੀ ਮੁੱਲ ਲਵੋ,',
      title2: 'ਸਹੀ ਏਆਈ ਮੰਡੀ ਭਵਿੱਖਬਾਣੀ ਨਾਲ',
      subtitle: 'ਪੰਜਾਬ, ਹਰਿਆਣਾ ਅਤੇ ਹੋਰ ਰਾਜਾਂ ਦੇ ਤਾਜ਼ਾ ਭਾਅ, ਅਗਲੇ 7 ਦਿਨਾਂ ਦਾ ਅੰਦਾਜ਼ਾ ਅਤੇ ਕਦੋਂ ਵੇਚਣਾ ਹੈ ਦੀ ਸਲਾਹ।',
      checkPrice: 'ਰੇਟ ਵੇਖੋ',
      voiceSearch: 'ਬੋਲ ਕੇ ਖੋਜੋ',
      selectState: 'ਰਾਜ ਚੁਣੋ',
      selectDistrict: 'ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
      selectMandi: 'ਮੰਡੀ ਚੁਣੋ',
      selectCrop: 'ਫ਼ਸਲ ਚੁਣੋ'
    },
    verdict: {
      wait: 'WAIT (ਉਡੀਕ ਕਰੋ)',
      sell: 'SELL NOW (ਹੁਣੇ ਵੇਚੋ)',
      stable: 'STABLE (ਸਥਿਰ ਭਾਅ)',
      waitReason: 'ਅਗਲੇ 4-6 ਦਿਨਾਂ ਵਿੱਚ ਆਮਦ ਘੱਟ ਹੋਣ ਕਾਰਨ ਭਾਅ ਵਧਣ ਦੀ ਉਮੀਦ ਹੈ।',
      sellReason: 'ਰੇਟ ਉੱਚ ਪੱਧਰ ਤੇ ਹੈ; ਨਵੀਂ ਆਮਦ ਨਾਲ ਰੇਟ ਡਿੱਗ ਸਕਦਾ ਹੈ।',
      stableReason: 'ਅਗਲੇ 7 ਦਿਨਾਂ ਵਿੱਚ ਰੇਟ ਸਥਿਰ ਰਹਿਣ ਦੀ ਉਮੀਦ ਹੈ।'
    },
    stats: {
      mandis: 'ਮੰਡੀਆਂ ਸ਼ਾਮਲ',
      crops: 'ਫ਼ਸਲਾਂ',
      forecasts: 'ਰੋਜ਼ਾਨਾ ਅੰਦਾਜ਼ੇ',
      accuracy: 'ਮਾਡਲ ਸਹੀ ਦਰ'
    }
  },
  mr: {
    brand: 'मंडीसेतू',
    tagline: 'शेतकऱ्यांसाठी बाजारभाव अंदाज व एआय सल्ला',
    disclaimer: 'अंदाज हे ऐतिहासिक माहितीवर आधारित मार्गदर्शन आहेत, सरकारी हमी नाही.',
    nav: {
      home: 'मुख्यपृष्ठ',
      dashboard: 'ताजे बाजारभाव',
      trends: 'भाव कल',
      nearby: 'अखिल भारतीय बाजार नकाशा',
      compare: 'पीक तुलना',
      alerts: 'भाव अलर्ट',
      support: 'शेतकरी मदत',
      account: 'माझे खाते',
      admin: 'प्रशासन',
    },
    hero: {
      badge: 'अखिल भारतीय ॲगमार्कनेट थेट समन्वय',
      title1: 'आपल्या पिकाला योग्य भाव मिळवा,',
      title2: 'अचूक एआय बाजार अंदाज आणि सल्ला',
      subtitle: 'महाराष्ट्रासह ८ राज्यांतील बाजार समित्यांचे ताजे भाव, ७ दिवसांचा अंदाज आणि विक्रीचा योग्य सल्ला.',
      checkPrice: 'बाजारभाव तपासा',
      voiceSearch: 'बोलून शोधा',
      selectState: 'राज्य निवडा',
      selectDistrict: 'जिल्हा निवडा',
      selectMandi: 'बाजार समिती निवडा',
      selectCrop: 'पीक निवडा'
    },
    verdict: {
      wait: 'WAIT (थांबा / प्रतीक्षा करा)',
      sell: 'SELL NOW (आता विका)',
      stable: 'STABLE (स्थिर भाव)',
      waitReason: 'पुढील ४-६ दिवसांत आवक कमी होऊन भाव वाढण्याची शक्यता आहे.',
      sellReason: 'सध्याचा भाव उच्चांकी आहे; नवीन आवकेने भाव घसरू शकतात.',
      stableReason: 'पुढील ७ दिवसांत भाव २-३% च्या मर्यादित कक्षेत राहतील.'
    },
    stats: {
      mandis: 'बाजार समित्या',
      crops: 'पिके',
      forecasts: 'दैनिक एआय अंदाज',
      accuracy: 'अचूकता दर'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('mandi_lang') || 'hi';
  });

  useEffect(() => {
    localStorage.setItem('mandi_lang', lang);
  }, [lang]);

  const setLanguage = (code) => setLang(code);

  const t = translations[lang] || translations.hi;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
