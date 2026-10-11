// Comprehensive All-India Agmarknet Mandi Dataset
export const MOCK_STATES = [
  { id: 'BR', name: 'Bihar', nameHi: 'बिहार' },
  { id: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश' },
  { id: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश' },
  { id: 'PB', name: 'Punjab', nameHi: 'पंजाब' },
  { id: 'HR', name: 'Haryana', nameHi: 'हरियाणा' },
  { id: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र' },
  { id: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान' },
  { id: 'JH', name: 'Jharkhand', nameHi: 'झारखंड' },
];

export const MOCK_DISTRICTS = {
  BR: [
    { id: 'patna', name: 'Patna', nameHi: 'पटना' },
    { id: 'muzaffarpur', name: 'Muzaffarpur', nameHi: 'मुज़फ़्फ़रपुर' },
    { id: 'gaya', name: 'Gaya', nameHi: 'गया' },
  ],
  UP: [
    { id: 'varanasi', name: 'Varanasi', nameHi: 'वाराणसी' },
    { id: 'lucknow', name: 'Lucknow', nameHi: 'लखनऊ' },
    { id: 'gorakhpur', name: 'Gorakhpur', nameHi: 'गोरखपुर' },
  ],
  MP: [
    { id: 'indore', name: 'Indore', nameHi: 'इंदौर' },
    { id: 'bhopal', name: 'Bhopal', nameHi: 'भोपाल' },
  ],
  PB: [
    { id: 'ludhiana', name: 'Ludhiana', nameHi: 'लुधियाना' },
    { id: 'amritsar', name: 'Amritsar', nameHi: 'अमृतसर' },
  ],
  HR: [
    { id: 'karnal', name: 'Karnal', nameHi: 'करनाल' },
    { id: 'hisar', name: 'Hisar', nameHi: 'हिसार' },
  ],
  MH: [
    { id: 'nashik', name: 'Nashik', nameHi: 'नासिक' },
    { id: 'pune', name: 'Pune', nameHi: 'पुणे' },
  ],
  RJ: [
    { id: 'jaipur', name: 'Jaipur', nameHi: 'जयपुर' },
    { id: 'kota', name: 'Kota', nameHi: 'कोटा' },
  ],
  JH: [
    { id: 'ranchi', name: 'Ranchi', nameHi: 'राँची' },
    { id: 'dhanbad', name: 'Dhanbad', nameHi: 'धनबाद' },
    { id: 'jamshedpur', name: 'Jamshedpur', nameHi: 'जमशेदपुर' },
  ],
};

export const MOCK_MANDIS = {
  // Bihar
  patna: [
    { id: 'patna_city', name: 'Patna City', nameHi: 'पटना सिटी मंडी', lat: 25.5941, lng: 85.1376 },
    { id: 'khagaul', name: 'Khagaul', nameHi: 'खगौल उप-मंडी', lat: 25.5786, lng: 85.0442 },
  ],
  muzaffarpur: [
    { id: 'muzaffarpur', name: 'Muzaffarpur', nameHi: 'मुज़फ़्फ़रपुर मुख्य मंडी', lat: 26.1209, lng: 85.3647 },
  ],
  gaya: [
    { id: 'gaya', name: 'Gaya', nameHi: 'गया कृषि मंडी', lat: 24.7955, lng: 84.9994 },
  ],

  // Uttar Pradesh
  varanasi: [
    { id: 'varanasi_main_yard', name: 'Varanasi Main Yard', nameHi: 'वाराणसी मुख्य मंडी', lat: 25.3176, lng: 82.9739 },
  ],
  lucknow: [
    { id: 'lucknow_apmc', name: 'Lucknow APMC', nameHi: 'लखनऊ कृषि मंडी', lat: 26.8467, lng: 80.9462 },
  ],
  gorakhpur: [
    { id: 'gorakhpur_mandi', name: 'Gorakhpur Mandi', nameHi: 'गोरखपुर मंडी', lat: 26.7606, lng: 83.3732 },
  ],

  // Madhya Pradesh
  indore: [
    { id: 'indore_krishi_upaj', name: 'Indore Krishi Upaj', nameHi: 'इंदौर कृषि उपज मंडी', lat: 22.7196, lng: 75.8577 },
  ],
  bhopal: [
    { id: 'bhopal_apmc', name: 'Bhopal APMC', nameHi: 'भोपाल मंडी', lat: 23.2599, lng: 77.4126 },
  ],

  // Punjab
  ludhiana: [
    { id: 'ludhiana_dana_mandi', name: 'Ludhiana Dana Mandi', nameHi: 'लुधियाना दाना मंडी', lat: 30.9010, lng: 75.8573 },
  ],
  amritsar: [
    { id: 'amritsar_bhagtanwala_mandi', name: 'Amritsar Bhagtanwala Mandi', nameHi: 'अमृतसर भगतांवाला मंडी', lat: 31.6340, lng: 74.8723 },
  ],

  // Haryana
  karnal: [
    { id: 'karnal_new_grain_market', name: 'Karnal New Grain Market', nameHi: 'करनाल नई अनाज मंडी', lat: 29.6857, lng: 76.9905 },
  ],
  hisar: [
    { id: 'hisar_mandi', name: 'Hisar Mandi', nameHi: 'हिसार अनाज मंडी', lat: 29.1492, lng: 75.7217 },
  ],

  // Maharashtra
  nashik: [
    { id: 'lasalgaon_onion_market', name: 'Lasalgaon Onion Market', nameHi: 'लासलगांव प्याज मंडी', lat: 20.1477, lng: 74.2259 },
  ],
  pune: [
    { id: 'pune_gultekdi_apmc', name: 'Pune Gultekdi APMC', nameHi: 'पुणे गुलटेकड़ी मंडी', lat: 18.5204, lng: 73.8567 },
  ],

  // Rajasthan
  jaipur: [
    { id: 'muhana_mandi_jaipur', name: 'Muhana Mandi Jaipur', nameHi: 'मुहाना मंडी जयपुर', lat: 26.9124, lng: 75.7873 },
  ],
  kota: [
    { id: 'kota_bhamashah_mandi', name: 'Kota Bhamashah Mandi', nameHi: 'कोटा भामाशाह मंडी', lat: 25.2138, lng: 75.8648 },
  ],

  // Jharkhand
  ranchi: [
    { id: 'ranchi_pandra', name: 'Ranchi Pandra Krishi Bazar', nameHi: 'राँची पंडरा कृषि बाज़ार', lat: 23.3728, lng: 85.3216 },
  ],
  dhanbad: [
    { id: 'dhanbad_apmc', name: 'Dhanbad APMC Bazar Samiti', nameHi: 'धनबाद कृषि बाज़ार समिति', lat: 23.7957, lng: 86.4304 },
  ],
  jamshedpur: [
    { id: 'jamshedpur_parsudih', name: 'Jamshedpur Parsudih Mandi', nameHi: 'जमशेदपुर परसुडीह मंडी', lat: 22.8046, lng: 86.2029 },
  ],
};

// All Major Agmarknet / data.gov.in Commodities with HD Web Imagery
export const MOCK_CROPS = [
  { 
    id: 'wheat', 
    name: 'Wheat (गेहूं)', 
    category: 'Cereals', 
    basePrice: 2450, 
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'paddy', 
    name: 'Paddy / Rice (धान / चावल)', 
    category: 'Cereals', 
    basePrice: 2280, 
    icon: '🍚',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'onion', 
    name: 'Onion (प्याज)', 
    category: 'Vegetables', 
    basePrice: 1850, 
    icon: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'potato', 
    name: 'Potato (आलू)', 
    category: 'Vegetables', 
    basePrice: 1420, 
    icon: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'mustard', 
    name: 'Mustard (सरसों)', 
    category: 'Oilseeds', 
    basePrice: 5350, 
    icon: '🌻',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'maize', 
    name: 'Maize (मक्का)', 
    category: 'Cereals', 
    basePrice: 2150, 
    icon: '🌽',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'tomato', 
    name: 'Tomato (टमाटर)', 
    category: 'Vegetables', 
    basePrice: 2100, 
    icon: '🍅',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'garlic', 
    name: 'Garlic (लहसुन)', 
    category: 'Spices', 
    basePrice: 9400, 
    icon: '🧄',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'gram', 
    name: 'Bengal Gram / Chana (चना)', 
    category: 'Pulses', 
    basePrice: 5850, 
    icon: '🫘',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'soyabean', 
    name: 'Soyabean (सोयाबीन)', 
    category: 'Oilseeds', 
    basePrice: 4650, 
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'cotton', 
    name: 'Cotton (कपास)', 
    category: 'Commercial', 
    basePrice: 7100, 
    icon: '☁️',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'sugarcane', 
    name: 'Sugarcane (गन्ना)', 
    category: 'Commercial', 
    basePrice: 380, 
    icon: '🎋',
    image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=400&q=80'
  },
];

export const MOCK_TICKER = [
  { crop: 'Wheat', cropHi: 'गेहूं', price: '₹2,480/q', change: '+3.4%', up: true, mandi: 'Karnal' },
  { crop: 'Paddy', cropHi: 'धान', price: '₹2,320/q', change: '+1.5%', up: true, mandi: 'Ludhiana' },
  { crop: 'Onion', cropHi: 'प्याज', price: '₹1,940/q', change: '-4.2%', up: false, mandi: 'Lasalgaon' },
  { crop: 'Mustard', cropHi: 'सरसों', price: '₹5,410/q', change: '+2.8%', up: true, mandi: 'Kota' },
  { crop: 'Chana', cropHi: 'चना', price: '₹5,850/q', change: '+1.9%', up: true, mandi: 'Indore' },
  { crop: 'Garlic', cropHi: 'लहसुन', price: '₹9,400/q', change: '+5.1%', up: true, mandi: 'Jaipur' },
];
