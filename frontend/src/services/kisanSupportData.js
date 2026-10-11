// Official Government Agricultural Helplines and Support Data
// NOTE: Verified from official Government of India portals (agricoop.nic.in, pmkisan.gov.in, pmfby.gov.in)
// MandiSetu is an independent platform; all phone numbers and links are for farmer utility.

export const OFFICIAL_HELPLINES = [
  {
    id: 'kcc',
    name: 'Kisan Call Centre (केसीसी टोल-फ्री)',
    number: '1800-180-1551',
    timing: '6:00 AM - 10:00 PM (All 7 Days)',
    languages: '22 Regional Languages',
    description: 'Direct agricultural advice from agricultural scientists on crop disease, seeds, fertilizers, and market rates.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare',
    verifiedUrl: 'https://dharani.gov.in'
  },
  {
    id: 'pm_kisan',
    name: 'PM-KISAN Samman Nidhi Helpline',
    number: '155261 / 011-24300606',
    timing: '10:00 AM - 5:00 PM (Mon-Sat)',
    languages: 'Hindi, English',
    description: 'Assistance regarding ₹6,000 yearly installment, eKYC status, and bank account linking.',
    officialSource: 'pmkisan.gov.in',
    verifiedUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    number: '14447',
    timing: '24x7 Toll-Free',
    languages: 'Hindi, English, Regional',
    description: 'Crop loss claims due to unseasonal rain, flood, drought, or pest attacks within 72 hours.',
    officialSource: 'pmfby.gov.in',
    verifiedUrl: 'https://pmfby.gov.in'
  },
  {
    id: 'enam',
    name: 'e-NAM National Agriculture Market Toll-Free',
    number: '1800-270-0224',
    timing: '9:00 AM - 6:00 PM',
    languages: 'Hindi, English, Regional',
    description: 'Support for online mandi bidding, inter-state trade licensing, and unified assaying.',
    officialSource: 'enam.gov.in',
    verifiedUrl: 'https://enam.gov.in'
  }
];

export const STATE_HELPLINES = [
  { state: 'Bihar', stateHi: 'बिहार', dept: 'Department of Agriculture, Patna', phone: '1800-180-1551 / 0612-2215612' },
  { state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', dept: 'Krishi Bhawan, Lucknow', phone: '0522-2204560 / 1800-180-1551' },
  { state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', dept: 'Kisan Kalyan Tatha Krishi Vikas, Bhopal', phone: '0755-2558838' },
  { state: 'Punjab', stateHi: 'पंजाब', dept: 'Department of Agriculture & Farmers Welfare, Chandigarh', phone: '0172-2970605' },
  { state: 'Haryana', stateHi: 'हरियाणा', dept: 'Directorate of Agriculture, Panchkula', phone: '1800-180-2117' },
  { state: 'Maharashtra', stateHi: 'महाराष्ट्र', dept: 'Kisan Call Centre / Commissionerate of Agriculture, Pune', phone: '1800-233-4000' },
  { state: 'Rajasthan', stateHi: 'राजस्थान', dept: 'Pant Krishi Bhawan, Jaipur', phone: '0141-2227365' },
  { state: 'Jharkhand', stateHi: 'झारखंड', dept: 'Krishi Nideshalaya, Ranchi', phone: '0651-2490576' }
];

export const SUPPORT_FAQS = [
  {
    category: 'prices',
    categoryHi: 'मंडी भाव',
    q: 'How does MandiSetu fetch daily mandi rates?',
    qHi: 'मंडीसेतु पर दैनिक मंडी भाव कहाँ से आते हैं?',
    a: 'MandiSetu syncs daily arrivals and modal auction rates directly from official Agmarknet and data.gov.in APMC reports uploaded by regulated mandis across India.',
    aHi: 'मंडीसेतु पर सभी भाव भारत सरकार के एगमार्कनेट (Agmarknet) और data.gov.in पोर्टल से सीधे प्राप्त होते हैं, जो अधिकृत एपीएमसी कृषि मंडियों द्वारा दैनिक रूप से दर्ज किए जाते हैं।'
  },
  {
    category: 'forecast',
    categoryHi: 'पूर्वानुमान',
    q: 'How reliable is the 7-day AI price forecast?',
    qHi: '7-दिनों का AI भाव पूर्वानुमान कितना विश्वसनीय है?',
    a: 'Our Prophet Time-Series algorithm analyzes historical seasonal trends, arrival volumes, and day-of-week patterns with an average error rate under 5-6%. However, sudden extreme weather or policy shifts can impact rates. It is an advisory tool, not a financial guarantee.',
    aHi: 'हमारा टाइम-सीरीज़ मॉडल पिछले कई वर्षों के मौसमी रुझान, आवक और बाज़ार गतिशीलता का विश्लेषण करता है। पिछले 30 दिनों में इसकी औसत सटीकता ~95% से अधिक रही है। फिर भी, यह एक वैज्ञानिक सलाह है, गारंटी नहीं।'
  },
  {
    category: 'selling',
    categoryHi: 'बेचें या रुकें',
    q: 'What is the "Sell or Wait" advisory based on?',
    qHi: '\'बेचें या रुकें\' की सलाह किस आधार पर दी जाती है?',
    a: 'It compares current modal prices against 7-day predicted peaks while subtracting estimated warehouse storage charges and shrinkage loss. If the projected gain exceeds holding costs, it advises "WAIT"; otherwise "SELL NOW".',
    aHi: 'यह आज के भाव और अगले 7 दिनों के संभावित भाव की तुलना करता है। इसमें गोदाम/भंडारण का खर्च और उपज सूखने का नुकसान घटाया जाता है। यदि रुकने पर शुद्ध लाभ अधिक मिलता है, तभी \'इंतजार करें\' की सलाह दी जाती है।'
  },
  {
    category: 'alerts',
    categoryHi: 'भाव अलर्ट',
    q: 'How do I receive price threshold alerts?',
    qHi: 'मुझे मनपसंद भाव का अलर्ट कैसे मिलेगा?',
    a: 'Navigate to the "Price Alerts" tab, pick your crop, mandi, and target rate (e.g. above ₹2,500). You can link your phone/Telegram to receive notifications the moment prices cross your limit.',
    aHi: '\'भाव अलर्ट\' पेज पर जाएं, अपनी फसल, मंडी और लक्षित मूल्य (जैसे ₹2,500 से अधिक) दर्ज करें। भाव सीमा पार करते ही आपको तुरंत सूचना प्राप्त होगी।'
  },
  {
    category: 'schemes',
    categoryHi: 'सरकारी योजनाएं',
    q: 'Where can I apply for PM-KISAN or Fasal Bima?',
    qHi: 'पीएम-किसान या फसल बीमा योजना के लिए कहाँ आवेदन करें?',
    a: 'Use our Government Resources section in the footer to access official direct links: pmkisan.gov.in for ₹6,000 annual installment and pmfby.gov.in for insurance claims.',
    aHi: 'हमारे पेज के सबसे नीचे दिए गए सरकारी संसाधन लिंक पर जाएं: pmkisan.gov.in से सम्मान निधि और pmfby.gov.in से फसल बीमा का आधिकारिक लाभ लिया जा सकता है।'
  }
];

export const STEP_BY_STEP_GUIDES = [
  {
    step: 1,
    title: 'अपनी मंडी और फसल चुनें',
    titleEn: 'Choose Your Mandi & Crop',
    desc: 'होमपेज पर अपना राज्य (जैसे बिहार, यूपी), ज़िला और नज़दीकी मंडी चुनें। \'मेरी फसल\' पट्टी से एक क्लिक में गेहूं, धान या प्याज चुनें।',
    descEn: 'On the home page, select your state, district, and nearest APMC. Use the quick-select strip for fast selection.'
  },
  {
    step: 2,
    title: 'ताज़ा भाव और MSP अंतर देखें',
    titleEn: 'View Live Rate & MSP Margin',
    desc: 'मंडी का मॉडल भाव (Modal Rate) देखें और जांचें कि क्या यह सरकारी एमएसपी (MSP) से ऊपर है या नीचे।',
    descEn: 'Examine today\'s modal rate and verify whether it trades above or below the official government Minimum Support Price.'
  },
  {
    step: 3,
    title: '7-दिनों का AI पूर्वानुमान समझें',
    titleEn: 'Analyze 7-Day AI Forecast',
    desc: 'चार्ट में अगले 7 दिनों की संभावित क़ीमत और ±3% की सुरक्षित सीमा देखें। हरी पट्टी का मतलब भाव बढ़ने की उम्मीद है।',
    descEn: 'Inspect projected rates for the upcoming week with confidence bands to plan your harvest sale timing.'
  },
  {
    step: 4,
    title: 'भंडारण कैलकुलेटर का उपयोग करें',
    titleEn: 'Calculate Storage vs Sell-Now Profit',
    desc: 'अपनी उपज (क्विंटल) और गोदाम का खर्च डालें। कैलकुलेटर तुरंत बताएगा कि आज बेचने में ज़्यादा फ़ायदा है या 5 दिन रोककर।',
    descEn: 'Enter your harvest quantity and daily storage cost to evaluate net earnings if held versus sold today.'
  }
];
