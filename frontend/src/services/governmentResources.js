// Government of India Resources & Official External Portals Configuration
// Complies with State Emblem of India Act (2005) - No national emblem or seal misuse.
// MandiSetu is an independent tech platform providing farmer intelligence and links to official resources.

export const GOV_RESOURCES_CONFIG = [
  {
    id: 'agmarknet',
    name: 'Agmarknet',
    titleHi: 'एगमार्कनेट मंडी पोर्टल',
    desc: 'Agricultural Marketing Information Network',
    url: 'https://agmarknet.gov.in',
    tag: 'Official Price Feed'
  },
  {
    id: 'enam',
    name: 'e-NAM',
    titleHi: 'राष्ट्रीय कृषि बाज़ार',
    desc: 'National Agriculture Market Unified Bidding',
    url: 'https://enam.gov.in',
    tag: 'Online Trading'
  },
  {
    id: 'datagov',
    name: 'data.gov.in',
    titleHi: 'ओपन गवर्नमेंट डेटा',
    desc: 'Open Government Data Platform India',
    url: 'https://data.gov.in',
    tag: 'APMC Datasets'
  },
  {
    id: 'pmkisan',
    name: 'PM-KISAN',
    titleHi: 'पीएम-किसान सम्मान निधि',
    desc: 'Pradhan Mantri Kisan Samman Nidhi',
    url: 'https://pmkisan.gov.in',
    tag: '₹6000/yr Benefit'
  },
  {
    id: 'pmfby',
    name: 'PMFBY',
    titleHi: 'फसल बीमा योजना',
    desc: 'Pradhan Mantri Fasal Bima Yojana',
    url: 'https://pmfby.gov.in',
    tag: 'Crop Insurance'
  },
  {
    id: 'kcc',
    name: 'Kisan Call Centre',
    titleHi: 'किसान कॉल सेंटर',
    desc: '1800-180-1551 Toll-Free Advisory',
    url: 'https://dharani.gov.in',
    tag: '24x7 Advice'
  },
  {
    id: 'imd',
    name: 'IMD Mausam',
    titleHi: 'मौसम विज्ञान विभाग',
    desc: 'Agromet Advisory & Weather Bulletins',
    url: 'https://mausam.imd.gov.in',
    tag: 'Rain & Weather'
  },
  {
    id: 'agricoop',
    name: 'Ministry of Agriculture',
    titleHi: 'कृषि एवं किसान कल्याण मंत्रालय',
    desc: 'Dept of Agriculture & Farmers Welfare',
    url: 'https://agricoop.gov.in',
    tag: 'Central Policies'
  }
];

export const FOOTER_LINKS_CONFIG = {
  about: [
    { label: 'About MandiSetu', labelHi: 'हमारे बारे में', path: 'about' },
    { label: 'How Forecast Works', labelHi: 'एआई मॉडल कैसे काम करता है', path: 'support' },
    { label: 'Data Accuracy & Methodology', labelHi: 'डेटा सटीकता विधि', path: 'trends' },
    { label: 'DPDP Privacy Principles', labelHi: 'डेटा सुरक्षा नीति', path: 'account' },
  ],
  services: [
    { label: 'Daily Mandi Rates', labelHi: 'दैनिक मंडी भाव', path: 'dashboard' },
    { label: '7-Day Prophet Forecast', labelHi: '7-दिवसीय AI पूर्वानुमान', path: 'trends' },
    { label: 'All-India Mandi GIS Map', labelHi: 'अखिल भारतीय मंडी नक्शा', path: 'nearby' },
    { label: 'Storage vs Sell Calculator', labelHi: 'भंडारण कैलकुलेटर', path: 'home' },
    { label: 'SMS & WhatsApp Price Alerts', labelHi: 'भाव अलर्ट', path: 'alerts' },
  ],
  support: [
    { label: 'Kisan Call Centre (1800-180-1551)', labelHi: 'किसान हेल्पलाइन (1800-180-1551)', path: 'support' },
    { label: 'Support Ticket Tracker', labelHi: 'टिकट स्थिति जांचें', path: 'support' },
    { label: 'Frequently Asked Questions', labelHi: 'सवाल-जवाब (FAQ)', path: 'support' },
    { label: 'How-To Visual Guides', labelHi: 'उपयोग मार्गदर्शिका', path: 'support' },
  ],
  legal: [
    { label: 'Privacy Policy (DPDP 2023)', labelHi: 'गोपनीयता नीति' },
    { label: 'Terms of Advisory Use', labelHi: 'नियम व शर्तें' },
    { label: 'Non-Endorsement Disclaimer', labelHi: 'गैर-सरकारी डिस्क्लेमर' },
    { label: 'License Attribution', labelHi: 'चित्र एवं डेटा लाइसेंस' },
  ]
};
