/**
 * 🌴 TRIP BARABAR — MASTER JAVASCRIPT ENGINE
 * Tagline: "Trip Sorted. Hisaab Barabar."
 * Features:
 * - Universal Multi-Trip Engine (Any country / domestic / international)
 * - Selective Splitting ("3 out of 9" rule, Quick Presets, Equal/Exact/Shares)
 * - Multi-Payer support for single large bills
 * - Dual Currency Engine with Custom Forex Rate Override (lock in ATM/booth cash rates)
 * - Adult & Nightlife Icons with 1-Tap Stealth / Discreet Mode
 * - Min-Cash-Flow Debt Simplification Algorithm
 * - 1-Tap WhatsApp Daily Trip Summary Generator
 * - Direct UPI Payment Deep Links (GPay, PhonePe, Paytm)
 * - Offline-First Local Storage & Real-Time Cloud Sync Adapter
 * - On-Device Receipt Photo Compression
 */

// ==================== MASTER STATE & CONFIGURATION ====================
const STORAGE_KEYS = {
  TRIPS: 'trip_barabar_trips',
  ACTIVE_TRIP_ID: 'trip_barabar_active_trip_id',
  DISCREET_MODE: 'trip_barabar_discreet_mode',
  CLOUD_CONFIG: 'trip_barabar_cloud_config',
  SYNC_QUEUE: 'trip_barabar_sync_queue'
};

// Master Categories Definition (with Dual Labels for Discreet Mode)
const DEFAULT_CATEGORIES = [
  { id: 'food', emoji: '🍔', name: 'Food & Dining', discreetName: 'Food & Dining', color: '#F97316' },
  { id: 'drinks', emoji: '🍻', name: 'Beer & Drinks', discreetName: 'Beverages & Refreshments', color: '#EAB308' },
  { id: 'cabs', emoji: '🚖', name: 'Cabs / Grab / Bolt', discreetName: 'Ground Transport', color: '#06B6D4' },
  { id: 'stay', emoji: '🏨', name: 'Hotel & Villa', discreetName: 'Accommodation', color: '#8B5CF6' },
  { id: 'massage', emoji: '💆', name: 'Thai Massage & Spa', discreetName: 'Thai Massage & Spa', color: '#10B981' },
  { id: 'lapdance', emoji: '💃', name: 'Lapdance / GoGo Club', discreetName: 'Cultural Evening Show', color: '#EC4899', isAdult: true },
  { id: 'adult', emoji: '🔞', name: 'Adult / Intercourse', discreetName: 'Personal Wellness & Care', color: '#F43F5E', isAdult: true },
  { id: 'oral', emoji: '💋', name: 'Oral / Special Services', discreetName: 'Reflexology & Recovery', color: '#E11D48', isAdult: true },
  { id: 'ladydrinks', emoji: '🍸', name: 'Lady Drinks / Bar Fine', discreetName: 'Hospitality & Lounge', color: '#D946EF', isAdult: true },
  { id: 'dispensary', emoji: '🌿', name: 'Dispensary / Green', discreetName: 'Herbal Wellness', color: '#84CC16', isAdult: true },
  { id: 'flight', emoji: '✈️', name: 'Flights & Transit', discreetName: 'Flights & Transit', color: '#3B82F6' },
  { id: 'boat', emoji: '🚤', name: 'Island Boat / Tour', discreetName: 'Excursions & Tours', color: '#0EA5E9' },
  { id: 'shopping', emoji: '🛍️', name: 'Shopping & 7-Eleven', discreetName: 'Shopping & Essentials', color: '#F59E0B' },
  { id: 'tips', emoji: '💵', name: 'Tips & Misc', discreetName: 'Incidental Services', color: '#64748B' }
];

// Master Currency & Forex Standards
const CURRENCY_SYMBOLS = {
  THB: '฿',
  INR: '₹',
  USD: '$',
  EUR: '€',
  AED: 'د.إ',
  SGD: 'S$',
  MYR: 'RM',
  IDR: 'Rp',
  GBP: '£',
  JPY: '¥',
  VND: '₫'
};

const DEFAULT_FOREX_RATES_TO_INR = {
  INR: 1.0,
  THB: 2.48,
  AED: 22.80,
  USD: 84.20,
  EUR: 92.50,
  SGD: 64.50,
  MYR: 19.20,
  IDR: 0.0054,
  GBP: 110.20,
  JPY: 0.58,
  VND: 0.0034
};

// App Master State
let state = {
  trips: [],
  activeTrip: null,
  discreetMode: false,
  activeTab: 'expenses',
  selectedFilterCategory: 'all',
  searchQuery: '',
  cloudConfig: {
    supabaseUrl: '',
    supabaseKey: '',
    syncRoomCode: 'THAI26'
  },
  tempReceiptBase64: null,
  splitMode: 'equal', // 'equal', 'exact', 'shares'
  isMultiPayer: false
};

// ==================== 🔊 WEBAUDIO SOUND EFFECTS ENGINE ====================
const SoundEffects = {
  enabled: localStorage.getItem('trip_barabar_sound_enabled') !== 'false',
  ctx: null,
  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },
  playCoin() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  },
  playVictory() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + (idx * 0.08);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      });
    } catch (e) {}
  },
  playStamp() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  },
  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }
};

function toggleSoundEffects() {
  SoundEffects.enabled = !SoundEffects.enabled;
  localStorage.setItem('trip_barabar_sound_enabled', SoundEffects.enabled ? 'true' : 'false');
  updateSoundUI();
  if (SoundEffects.enabled) {
    SoundEffects.playCoin();
    showToast('🔊 Sound Effects Turned ON');
  } else {
    showToast('🔇 Sound Effects Muted');
  }
}

function updateSoundUI() {
  const icon = document.getElementById('soundIcon');
  if (icon) {
    if (SoundEffects.enabled) {
      icon.className = 'fa-solid fa-volume-high text-brand-400';
    } else {
      icon.className = 'fa-solid fa-volume-xmark text-slate-500';
    }
  }
}

// ==================== 🎨 DESTINATION ATMOSPHERE THEMES ENGINE ====================
const DESTINATION_THEMES = {
  // 1. Tropical Beach (Thailand)
  tropical: { name: 'Tropical Beach', emoji: '🌴', badge: '🌴 Tropical Beach', sub: 'Thailand, Phuket, Pattaya', cat: 'beach', desc: 'Limestone Karst Cliffs & Longtail Boat' },
  // 2. Goa Coastal
  goa: { name: 'Goa Coastal', emoji: '🏖️', badge: '🏖️ Goa Coastal', sub: 'Baga, Anjuna, Sunburn', cat: 'beach', desc: 'Leaning Palms & Sunset Ocean Waves' },
  // 3. Bali Sunset
  bali: { name: 'Bali Sunset', emoji: '🌺', badge: '🌺 Bali Sunset', sub: 'Ubud, Seminyak, Canggu', cat: 'beach', desc: 'Candi Bentar Gate & Rice Terraces' },
  // 4. Glacial Peaks (Himalayas / Ladakh)
  mountains: { name: 'Glacial Peaks', emoji: '🏔️', badge: '🏔️ Glacial Peaks', sub: 'Ladakh, Manali, Spiti', cat: 'mountain', desc: 'Snow-Capped Himalayan Ridges & Pines' },
  // 5. Desert Luxury (Dubai)
  dubai: { name: 'Desert Luxury', emoji: '🏜️', badge: '🏜️ Desert Luxury', sub: 'Dubai, Dunes, Gold', cat: 'metro', desc: 'Golden Dunes, Camel Caravan & Moon' },
  // 6. Tokyo Cyber
  cyber: { name: 'Tokyo Cyber', emoji: '🔮', badge: '🔮 Tokyo Cyber', sub: 'Japan, Mount Fuji, Neon', cat: 'metro', desc: 'Mount Fuji, Tokyo Tower & 3D Grid' },
  // 7. Euro Classic (Paris)
  europe: { name: 'Euro Classic (Paris)', emoji: '🏰', badge: '🏰 Euro Classic', sub: 'Eiffel Tower, Seine, Louvre', cat: 'heritage', desc: 'Eiffel Tower, Cathedral & River Bridge' },
  paris: { name: 'Paris Romance', emoji: '🥐', badge: '🥐 Paris Romance', sub: 'Eiffel Tower, Montmartre', cat: 'heritage', desc: 'Eiffel Tower, Cathedral & River Bridge' },
  // 8. London Royal
  london: { name: 'London Royal', emoji: '💂', badge: '💂 London Royal', sub: 'Big Ben, Tower Bridge, Thames', cat: 'metro', desc: 'Big Ben Spire, London Eye & Tower Bridge' },
  // 9. New York Skyline
  newyork: { name: 'New York Skyline', emoji: '🗽', badge: '🗽 New York Skyline', sub: 'Manhattan, Brooklyn Bridge', cat: 'metro', desc: 'Statue of Liberty & Manhattan Highrises' },
  // 10. Rome Classical
  rome: { name: 'Rome Classical', emoji: '🏛️', badge: '🏛️ Rome Classical', sub: 'Colosseum, Vatican, Florence', cat: 'heritage', desc: 'Colosseum Arches & Roman Umbrella Pines' },
  // 11. Pyramids of Egypt
  egypt: { name: 'Pyramids of Egypt', emoji: '🐫', badge: '🐫 Pyramids of Egypt', sub: 'Giza, Sphinx, Nile River', cat: 'heritage', desc: 'Great Pyramids of Giza, Sphinx & Felucca' },
  // 12. Royal Rajasthan
  rajasthan: { name: 'Royal Rajasthan', emoji: '🏰', badge: '🏰 Royal Rajasthan', sub: 'Taj Mahal, Jaipur, Forts', cat: 'heritage', desc: 'Taj Mahal Marble Dome & Palace Balconies' },
  // 13. Swiss Alps
  swiss: { name: 'Swiss Alps', emoji: '⛷️', badge: '⛷️ Swiss Alps', sub: 'Matterhorn, Zermatt, Zurich', cat: 'mountain', desc: 'Matterhorn Pyramid, Chalet & Gondola' },
  // 14. Santorini Blue
  santorini: { name: 'Santorini Blue', emoji: '🇬🇷', badge: '🇬🇷 Santorini Blue', sub: 'Oia, Mykonos, Aegean Sea', cat: 'beach', desc: 'Cobalt Blue Domes, Windmill & Caldera' },
  // 15. Singapore Future
  singapore: { name: 'Singapore Future', emoji: '🦁', badge: '🦁 Singapore Future', sub: 'Marina Bay, Supertrees', cat: 'metro', desc: 'Marina Bay Sands & Supertree Grove' },
  // 16. Maldives Lagoon
  maldives: { name: 'Maldives Lagoon', emoji: '🐠', badge: '🐠 Maldives Lagoon', sub: 'Overwater Villas, Coral Atolls', cat: 'beach', desc: 'Overwater Villas on Stilts & Manta Ray' },
  // 17. Ha Long Bay (Vietnam)
  vietnam: { name: 'Ha Long Bay', emoji: '🛶', badge: '🛶 Ha Long Bay', sub: 'Hanoi, Da Nang, Karsts', cat: 'beach', desc: 'Karst Pillars & Red-Sailed Junk Boat' },
  // 18. Istanbul Heritage
  istanbul: { name: 'Istanbul Heritage', emoji: '🕌', badge: '🕌 Istanbul Heritage', sub: 'Bosphorus, Cappadocia, Mosques', cat: 'heritage', desc: 'Hagia Sophia Domes & Hot Air Balloons' },
  // 19. Rio Carnival
  rio: { name: 'Rio Carnival', emoji: '🇧🇷', badge: '🇧🇷 Rio Carnival', sub: 'Corcovado, Copacabana, Samba', cat: 'heritage', desc: 'Christ the Redeemer & Copacabana Waves' },
  // 20. Sydney Harbour
  sydney: { name: 'Sydney Harbour', emoji: '🦘', badge: '🦘 Sydney Harbour', sub: 'Opera House, Harbour Bridge', cat: 'metro', desc: 'Opera House Sail Roofs & Steel Bridge' },
  // 21. Las Vegas Neon
  vegas: { name: 'Las Vegas Neon', emoji: '🎰', badge: '🎰 Las Vegas Neon', sub: 'The Strip, Casino Glamour', cat: 'metro', desc: 'Casino Roulette, Dice & Vegas Sign' },
  // 22. Iceland Aurora
  iceland: { name: 'Iceland Aurora', emoji: '🌌', badge: '🌌 Iceland Aurora', sub: 'Northern Lights, Geysers', cat: 'mountain', desc: 'Aurora Borealis Curtains & Geyser Plume' },
  // 23. Amsterdam Canals
  amsterdam: { name: 'Amsterdam Canals', emoji: '🚲', badge: '🚲 Amsterdam Canals', sub: 'Gable Houses, Bridges, Bikes', cat: 'heritage', desc: 'Historic Gable Canal Houses & Bicycle' },
  // 24. African Safari
  safari: { name: 'African Safari', emoji: '🦁', badge: '🦁 African Safari', sub: 'Serengeti, Kenya, Savannah', cat: 'mountain', desc: 'Acacia Tree, Giraffes & African Sunset' },
  // 25. Varanasi Ghats
  varanasi: { name: 'Varanasi Ghats', emoji: '🪔', badge: '🪔 Varanasi Ghats', sub: 'Ganga Aarti, Kashi Temples', cat: 'heritage', desc: 'Ghat Steps, Temple Spires & River Diyas' }
};

// ==================== 🌅 25 DESTINATION SCENIC VECTOR POSTCARD ARTWORKS ====================
// Lightweight, Retina-crisp vector silhouettes rendered behind Hero spend numbers (<2KB each)
const DESTINATION_GRAPHICS = {
  // 1. Tropical (Thailand)
  tropical: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="trSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#042f2e" stop-opacity="0.8"/><stop offset="50%" stop-color="#115e59" stop-opacity="0.5"/><stop offset="100%" stop-color="#0d9488" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="trSea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0f766e" stop-opacity="0.6"/><stop offset="100%" stop-color="#042f2e" stop-opacity="0.85"/></linearGradient>
    <linearGradient id="trKarst" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#134e4a" stop-opacity="0.8"/><stop offset="100%" stop-color="#042f2e" stop-opacity="0.95"/></linearGradient>
    <radialGradient id="trSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.85"/><stop offset="70%" stop-color="#2dd4bf" stop-opacity="0.3"/><stop offset="100%" stop-color="#0d9488" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="360" fill="url(#trSky)"/>
  <circle cx="560" cy="140" r="60" fill="url(#trSun)"/>
  <circle cx="560" cy="140" r="28" fill="#fef08a" opacity="0.75"/>
  <rect x="0" y="210" width="800" height="150" fill="url(#trSea)"/>
  <path d="M 80,225 C 90,160 110,130 135,115 C 155,102 175,120 185,145 C 195,170 205,190 220,225 Z" fill="#042f2e" opacity="0.6"/>
  <path d="M 610,220 C 605,170 595,120 615,80 C 625,60 650,55 660,75 C 675,105 668,160 685,220 Z" fill="url(#trKarst)"/>
  <path d="M 610,85 C 605,75 615,65 625,68 C 635,60 655,58 662,72 C 670,68 676,80 670,90 Z" fill="#14b8a6" opacity="0.7"/>
  <path d="M 720,225 C 730,175 750,150 770,140 C 785,132 795,150 800,165 L 800,225 Z" fill="#042f2e" opacity="0.5"/>
  <g transform="translate(280, 215) scale(0.65)" fill="#0f172a">
    <path d="M 10,48 C 40,46 160,45 220,38 C 240,35 270,22 290,10 C 275,32 235,58 190,62 C 120,66 40,65 10,48 Z" fill="#1e293b"/>
    <path d="M 12,48 C 40,46 160,45 220,38 C 240,35 270,22 290,10 C 275,25 240,45 200,52 Z" fill="#334155"/>
    <line x1="280" y1="18" x2="330" y2="-12" stroke="#475569" stroke-width="4"/>
    <path d="M 315,0 Q 320,15 315,30" stroke="#f43f5e" stroke-width="3" fill="none"/>
    <path d="M 318,2 Q 325,18 322,32" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
    <path d="M 322,4 Q 330,16 328,28" stroke="#10b981" stroke-width="2" fill="none"/>
    <path d="M 80,20 L 160,20 L 155,25 L 85,25 Z" fill="#0d9488"/>
    <line x1="85" y1="25" x2="85" y2="48" stroke="#334155" stroke-width="2.5"/>
    <line x1="120" y1="25" x2="120" y2="48" stroke="#334155" stroke-width="2"/>
    <line x1="155" y1="25" x2="155" y2="48" stroke="#334155" stroke-width="2.5"/>
    <line x1="15" y1="46" x2="-45" y2="62" stroke="#1e293b" stroke-width="3"/>
    <circle cx="-45" cy="62" r="4" fill="#0d9488"/>
  </g>
  <ellipse cx="380" cy="256" rx="120" ry="6" fill="#14b8a6" opacity="0.3"/>
  <ellipse cx="360" cy="270" rx="90" ry="4" fill="#2dd4bf" opacity="0.2"/>
  <g fill="#022c22" opacity="0.85">
    <path d="M -20,-20 C 30,10 90,50 140,110 C 100,80 50,45 -20,20 Z"/>
    <path d="M -10,-30 C 50,15 130,55 210,100 C 150,75 80,40 -10,10 Z"/>
    <path d="M -30,-10 C 20,40 60,110 80,180 C 60,120 20,70 -30,30 Z"/>
    <path d="M 0,-40 C 70,5 170,30 260,65 C 190,45 110,25 0,0 Z"/>
  </g>
</svg>`,

  // 2. Goa
  goa: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="goaSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2d0614" stop-opacity="0.8"/><stop offset="45%" stop-color="#7c2d12" stop-opacity="0.5"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="goaSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="60%" stop-color="#f97316" stop-opacity="0.7"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0"/></radialGradient>
    <linearGradient id="goaSea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0e7490" stop-opacity="0.6"/><stop offset="50%" stop-color="#155e75" stop-opacity="0.7"/><stop offset="100%" stop-color="#083344" stop-opacity="0.85"/></linearGradient>
    <linearGradient id="goaWaveCrest" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#67e8f9" stop-opacity="0.5"/><stop offset="50%" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="100%" stop-color="#67e8f9" stop-opacity="0.5"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#goaSky)"/>
  <circle cx="480" cy="185" r="55" fill="url(#goaSun)"/>
  <circle cx="480" cy="185" r="32" fill="#fde047" opacity="0.85"/>
  <g fill="none" stroke="#fed7aa" stroke-width="2" opacity="0.75">
    <path d="M 320,80 Q 330,70 340,80 Q 350,70 360,80"/><path d="M 370,65 Q 378,56 386,65 Q 394,56 402,65"/><path d="M 280,95 Q 287,87 294,95 Q 301,87 308,95"/><path d="M 430,75 Q 436,68 442,75 Q 448,68 454,75"/>
  </g>
  <rect x="0" y="195" width="800" height="165" fill="url(#goaSea)"/>
  <ellipse cx="480" cy="205" rx="60" ry="4" fill="#fef08a" opacity="0.6"/>
  <ellipse cx="480" cy="216" rx="80" ry="5" fill="#fdba74" opacity="0.5"/>
  <ellipse cx="480" cy="230" rx="110" ry="6" fill="#f97316" opacity="0.35"/>
  <path d="M 0,225 C 150,210 250,235 400,220 C 550,205 650,230 800,218 L 800,360 L 0,360 Z" fill="#0c4a6e" opacity="0.55"/>
  <path d="M 0,223 C 150,208 250,233 400,218 C 550,203 650,228 800,216" stroke="url(#goaWaveCrest)" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M 0,265 C 180,245 320,275 520,255 C 680,240 740,268 800,256 L 800,360 L 0,360 Z" fill="#082f49" opacity="0.75"/>
  <path d="M 0,263 C 180,243 320,273 520,253 C 680,238 740,266 800,254" stroke="url(#goaWaveCrest)" stroke-width="2.5" fill="none" opacity="0.8"/>
  <path d="M 0,315 Q 300,285 580,310 T 800,300 L 800,360 L 0,360 Z" fill="#78350f" opacity="0.5"/>
  <path d="M 0,330 Q 350,295 800,320 L 800,360 L 0,360 Z" fill="#451a03" opacity="0.65"/>
  <g fill="#180c04">
    <path d="M 760,360 C 750,280 710,210 655,160 C 650,155 645,158 648,165 C 700,212 738,280 745,360 Z"/>
    <circle cx="652" cy="162" r="5" fill="#451a03"/><circle cx="658" cy="165" r="4.5" fill="#451a03"/><circle cx="650" cy="168" r="4" fill="#451a03"/>
    <path d="M 652,160 C 630,130 580,120 540,135 C 575,145 615,155 650,162 Z"/>
    <path d="M 652,160 C 620,110 570,95 520,105 C 560,120 610,138 650,161 Z"/>
    <path d="M 655,160 C 640,115 620,75 585,60 C 610,90 635,125 653,161 Z"/>
    <path d="M 655,160 C 670,120 700,85 740,75 C 715,105 690,135 656,162 Z"/>
    <path d="M 655,160 C 685,130 735,115 780,120 C 740,140 700,152 656,163 Z"/>
    <path d="M 655,162 C 680,155 730,160 770,185 C 730,180 690,172 654,164 Z"/>
    <path d="M 652,162 C 630,165 590,185 570,215 C 595,190 630,175 650,164 Z"/>
  </g>
  <g fill="#180c04" opacity="0.9">
    <path d="M 800,360 C 785,300 760,240 725,195 C 720,190 715,193 718,198 C 750,240 772,298 785,360 Z"/>
    <path d="M 722,195 C 695,170 655,165 620,175 C 655,185 690,192 720,197 Z"/>
    <path d="M 722,195 C 710,155 690,125 655,115 C 680,140 705,170 721,196 Z"/>
    <path d="M 725,195 C 740,160 770,135 800,130 C 780,155 755,178 726,197 Z"/>
  </g>
</svg>`,

  // 3. Bali
  bali: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="blSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3b0764" stop-opacity="0.85"/><stop offset="45%" stop-color="#831843" stop-opacity="0.55"/><stop offset="85%" stop-color="#be185d" stop-opacity="0.3"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.15"/></linearGradient>
    <radialGradient id="blSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde047" stop-opacity="0.9"/><stop offset="60%" stop-color="#f43f5e" stop-opacity="0.6"/><stop offset="100%" stop-color="#be185d" stop-opacity="0"/></radialGradient>
    <linearGradient id="blTerrace1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#064e3b" stop-opacity="0.7"/><stop offset="100%" stop-color="#022c22" stop-opacity="0.85"/></linearGradient>
    <linearGradient id="blTerrace2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#047857" stop-opacity="0.6"/><stop offset="100%" stop-color="#064e3b" stop-opacity="0.8"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#blSky)"/>
  <circle cx="400" cy="170" r="50" fill="url(#blSun)"/>
  <circle cx="400" cy="170" r="26" fill="#fef08a" opacity="0.8"/>
  <path d="M 0,260 Q 200,225 400,250 T 800,230 L 800,360 L 0,360 Z" fill="url(#blTerrace2)"/>
  <path d="M 0,290 Q 250,260 550,285 T 800,270 L 800,360 L 0,360 Z" fill="url(#blTerrace1)"/>
  <path d="M 0,320 Q 300,290 600,315 T 800,305 L 800,360 L 0,360 Z" fill="#022c22"/>
  <g transform="translate(320, 95) scale(0.65)" fill="#1c071d">
    <path d="M 95,200 L 30,200 L 30,185 L 45,185 L 45,150 L 35,150 L 35,135 L 52,135 L 52,105 L 42,105 L 42,90 L 60,90 L 60,65 L 50,65 L 50,52 L 68,52 L 68,30 L 58,30 L 58,18 L 76,18 L 76,0 L 95,0 Z"/>
    <rect x="76" y="25" width="12" height="15" fill="#f43f5e" opacity="0.4"/>
    <rect x="68" y="60" width="20" height="18" fill="#f43f5e" opacity="0.4"/>
    <rect x="52" y="110" width="35" height="20" fill="#f43f5e" opacity="0.4"/>
    <path d="M 155,200 L 220,200 L 220,185 L 205,185 L 205,150 L 215,150 L 215,135 L 198,135 L 198,105 L 208,105 L 208,90 L 190,90 L 190,65 L 200,65 L 200,52 L 182,52 L 182,30 L 192,30 L 192,18 L 174,18 L 174,0 L 155,0 Z"/>
    <rect x="162" y="25" width="12" height="15" fill="#f43f5e" opacity="0.4"/>
    <rect x="162" y="60" width="20" height="18" fill="#f43f5e" opacity="0.4"/>
    <rect x="162" y="110" width="35" height="20" fill="#f43f5e" opacity="0.4"/>
    <rect x="95" y="190" width="60" height="10" fill="#2a082b"/>
  </g>
  <g transform="translate(240, 160) scale(0.55)" fill="#be185d">
    <path d="M 40,30 C 40,10 70,5 100,5 C 130,5 160,10 160,30 C 145,28 125,35 100,28 C 75,35 55,28 40,30 Z"/>
    <line x1="100" y1="28" x2="100" y2="150" stroke="#f59e0b" stroke-width="4"/>
    <circle cx="50" cy="34" r="3" fill="#f59e0b"/><circle cx="75" cy="34" r="3" fill="#f59e0b"/><circle cx="100" cy="34" r="3" fill="#f59e0b"/><circle cx="125" cy="34" r="3" fill="#f59e0b"/><circle cx="150" cy="34" r="3" fill="#f59e0b"/>
  </g>
  <g transform="translate(680, 220) scale(0.6)" fill="#f43f5e" opacity="0.8">
    <ellipse cx="30" cy="30" rx="14" ry="7" transform="rotate(0 30 30)"/><ellipse cx="30" cy="30" rx="14" ry="7" transform="rotate(72 30 30)"/><ellipse cx="30" cy="30" rx="14" ry="7" transform="rotate(144 30 30)"/><ellipse cx="30" cy="30" rx="14" ry="7" transform="rotate(216 30 30)"/><ellipse cx="30" cy="30" rx="14" ry="7" transform="rotate(288 30 30)"/><circle cx="30" cy="30" r="5" fill="#fef08a"/>
  </g>
</svg>`,

  // 4. Mountains (Himalayas / Ladakh / Manali)
  mountains: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="mtSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#021329" stop-opacity="0.9"/><stop offset="55%" stop-color="#072a4a" stop-opacity="0.6"/><stop offset="100%" stop-color="#0369a1" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="mtBack" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7" stop-opacity="0.45"/><stop offset="100%" stop-color="#082f49" stop-opacity="0.65"/></linearGradient>
    <linearGradient id="mtMid" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0369a1" stop-opacity="0.6"/><stop offset="100%" stop-color="#071d31" stop-opacity="0.8"/></linearGradient>
    <linearGradient id="mtSnow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.95"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.4"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#mtSky)"/>
  <path d="M 690,45 A 24,24 0 1 0 718,90 A 20,20 0 1 1 690,45 Z" fill="#e0f2fe" opacity="0.9"/>
  <circle cx="630" cy="38" r="1.5" fill="#e0f2fe" opacity="0.8"/><circle cx="580" cy="55" r="1.5" fill="#e0f2fe" opacity="0.7"/><circle cx="510" cy="30" r="2" fill="#e0f2fe" opacity="0.9"/><circle cx="440" cy="65" r="1.5" fill="#e0f2fe" opacity="0.6"/><circle cx="740" cy="32" r="1.5" fill="#e0f2fe" opacity="0.6"/><circle cx="360" cy="40" r="1.5" fill="#e0f2fe" opacity="0.5"/>
  <polygon points="0,230 110,130 190,185 310,90 420,175 560,70 690,170 800,105 800,360 0,360" fill="url(#mtBack)"/>
  <polygon points="310,90 280,115 310,122 340,112" fill="url(#mtSnow)"/>
  <polygon points="560,70 525,102 560,110 595,98" fill="url(#mtSnow)"/>
  <polygon points="800,105 770,128 800,135" fill="url(#mtSnow)"/>
  <polygon points="110,130 85,150 110,158 135,148" fill="url(#mtSnow)"/>
  <polygon points="0,270 160,160 260,225 390,140 520,230 670,135 800,210 800,360 0,360" fill="url(#mtMid)"/>
  <polygon points="160,160 260,225 260,360 160,360" fill="#041424" opacity="0.45"/>
  <polygon points="390,140 520,230 520,360 390,360" fill="#041424" opacity="0.45"/>
  <polygon points="670,135 800,210 800,360 670,360" fill="#041424" opacity="0.45"/>
  <polygon points="390,140 355,170 390,180 425,168" fill="url(#mtSnow)"/>
  <polygon points="670,135 635,165 670,174 705,162" fill="url(#mtSnow)"/>
  <polygon points="160,160 130,185 160,192 190,182" fill="url(#mtSnow)"/>
  <g fill="#020c17" opacity="0.9">
    <path d="M 0,360 L 0,290 L 15,280 L 30,290 L 45,275 L 60,290 L 75,270 L 90,290 L 110,265 L 125,290 L 145,272 L 165,290 L 190,260 L 210,290 L 235,270 L 255,290 L 280,262 L 305,290 L 330,268 L 355,290 L 385,260 L 415,290 L 440,265 L 470,290 L 500,258 L 530,290 L 560,265 L 590,290 L 620,260 L 650,290 L 680,255 L 710,290 L 740,268 L 770,290 L 800,260 L 800,360 Z"/>
  </g>
</svg>`,

  // 5. Dubai
  dubai: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="dbSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1c0b02" stop-opacity="0.8"/><stop offset="60%" stop-color="#451a03" stop-opacity="0.5"/><stop offset="100%" stop-color="#78350f" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="dbDune1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.5"/><stop offset="100%" stop-color="#b45309" stop-opacity="0.35"/></linearGradient>
    <linearGradient id="dbDune2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#d97706" stop-opacity="0.6"/><stop offset="100%" stop-color="#78350f" stop-opacity="0.45"/></linearGradient>
    <linearGradient id="dbDune3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#b45309" stop-opacity="0.75"/><stop offset="100%" stop-color="#451a03" stop-opacity="0.6"/></linearGradient>
    <linearGradient id="dbMoon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#dbSky)"/>
  <path d="M 680,55 A 26,26 0 1 0 710,105 A 22,22 0 1 1 680,55 Z" fill="url(#dbMoon)" opacity="0.9"/>
  <circle cx="722" cy="78" r="2.5" fill="#fde68a" opacity="0.95"/><circle cx="635" cy="45" r="1.5" fill="#fde68a" opacity="0.7"/><circle cx="585" cy="70" r="1.5" fill="#fde68a" opacity="0.6"/><circle cx="525" cy="35" r="2" fill="#fde68a" opacity="0.8"/><circle cx="755" cy="40" r="1.5" fill="#fde68a" opacity="0.6"/><circle cx="470" cy="65" r="1.5" fill="#fde68a" opacity="0.5"/><circle cx="390" cy="45" r="1.5" fill="#fde68a" opacity="0.6"/>
  <path d="M0,210 Q 200,165 420,205 T 800,175 L 800,360 L 0,360 Z" fill="url(#dbDune1)"/>
  <path d="M0,255 Q 260,205 540,245 T 800,225 L 800,360 L 0,360 Z" fill="url(#dbDune2)"/>
  <g transform="translate(130, 180) scale(0.42)" fill="#451a03" opacity="0.7">
    <path d="M 40,80 Q 43,40 45,0 Q 48,40 50,80 Z"/><path d="M 45,10 Q 15,-10 0,10 Q 20,5 45,15 Z"/><path d="M 45,10 Q 75,-10 90,10 Q 70,5 45,15 Z"/><path d="M 45,10 Q 30,-25 45,-35 Q 50,-15 45,10 Z"/><path d="M 45,10 Q 10,20 -5,45 Q 15,30 45,20 Z"/><path d="M 45,10 Q 80,20 95,45 Q 75,30 45,20 Z"/>
  </g>
  <g transform="translate(165, 190) scale(0.32)" fill="#451a03" opacity="0.55">
    <path d="M 40,80 Q 43,40 45,0 Q 48,40 50,80 Z"/><path d="M 45,10 Q 15,-10 0,10 Q 20,5 45,15 Z"/><path d="M 45,10 Q 75,-10 90,10 Q 70,5 45,15 Z"/>
  </g>
  <path d="M0,300 Q 320,250 610,285 T 800,275 L 800,360 L 0,360 Z" fill="url(#dbDune3)"/>
  <g transform="translate(490, 222) scale(0.42)" fill="#1c0a02">
    <path d="M 20,40 C 25,30 35,28 45,35 C 55,20 70,18 80,32 C 90,20 105,18 115,34 C 125,32 135,38 135,50 C 135,65 125,75 110,75 L 40,75 C 28,75 20,60 20,40 Z"/>
    <path d="M 125,40 C 135,30 148,15 152,-5 C 153,-12 165,-12 168,-6 C 168,2 160,8 156,18 C 150,30 142,50 135,60 Z"/>
    <path d="M 160,-12 C 165,-12 175,-8 175,-2 C 172,2 162,2 158,-4 Z"/><path d="M 38,72 L 32,118 L 26,118 L 34,72 Z"/><path d="M 52,72 L 58,118 L 64,118 L 56,72 Z"/><path d="M 102,72 L 96,118 L 90,118 L 98,72 Z"/><path d="M 120,72 L 126,118 L 132,118 L 124,72 Z"/><path d="M 22,46 Q 14,60 18,75 Q 21,65 24,52 Z"/>
  </g>
  <path d="M 455,260 Q 475,266 498,258" stroke="#451a03" stroke-width="1.2" fill="none" opacity="0.75"/>
  <g transform="translate(400, 226) scale(0.38)" fill="#1c0a02">
    <path d="M 20,40 C 25,30 35,28 45,35 C 55,20 70,18 80,32 C 90,20 105,18 115,34 C 125,32 135,38 135,50 C 135,65 125,75 110,75 L 40,75 C 28,75 20,60 20,40 Z"/>
    <path d="M 125,40 C 135,30 148,15 152,-5 C 153,-12 165,-12 168,-6 C 168,2 160,8 156,18 C 150,30 142,50 135,60 Z"/>
    <path d="M 160,-12 C 165,-12 175,-8 175,-2 C 172,2 162,2 158,-4 Z"/><path d="M 38,72 L 32,118 L 26,118 L 34,72 Z"/><path d="M 52,72 L 58,118 L 64,118 L 56,72 Z"/><path d="M 102,72 L 96,118 L 90,118 L 98,72 Z"/><path d="M 120,72 L 126,118 L 132,118 L 124,72 Z"/><path d="M 22,46 Q 14,60 18,75 Q 21,65 24,52 Z"/>
  </g>
  <path d="M 368,263 Q 388,269 408,262" stroke="#451a03" stroke-width="1.2" fill="none" opacity="0.75"/>
  <g transform="translate(320, 230) scale(0.34)" fill="#1c0a02">
    <path d="M 20,40 C 25,30 35,28 45,35 C 55,20 70,18 80,32 C 90,20 105,18 115,34 C 125,32 135,38 135,50 C 135,65 125,75 110,75 L 40,75 C 28,75 20,60 20,40 Z"/>
    <path d="M 125,40 C 135,30 148,15 152,-5 C 153,-12 165,-12 168,-6 C 168,2 160,8 156,18 C 150,30 142,50 135,60 Z"/>
    <path d="M 160,-12 C 165,-12 175,-8 175,-2 C 172,2 162,2 158,-4 Z"/><path d="M 38,72 L 32,118 L 26,118 L 34,72 Z"/><path d="M 52,72 L 58,118 L 64,118 L 56,72 Z"/><path d="M 102,72 L 96,118 L 90,118 L 98,72 Z"/><path d="M 120,72 L 126,118 L 132,118 L 124,72 Z"/>
  </g>
  <g transform="translate(575, 246) scale(0.4)" fill="#1c0a02">
    <ellipse cx="25" cy="15" rx="8" ry="9"/><path d="M 22,12 Q 15,22 18,30 Q 24,25 26,20 Z"/><line x1="38" y1="5" x2="38" y2="78" stroke="#1c0a02" stroke-width="2.5"/><path d="M 20,24 C 16,35 12,50 8,75 L 34,75 C 32,55 30,35 28,24 Z"/><path d="M 22,28 L 8,42 L 3,38" stroke="#1c0a02" stroke-width="2.5" fill="none"/>
  </g>
  <path d="M 560,260 Q 570,263 578,262" stroke="#451a03" stroke-width="1.2" fill="none" opacity="0.75"/>
</svg>`,

  // 6. Tokyo Cyber
  cyber: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="cySky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e0538" stop-opacity="0.9"/><stop offset="60%" stop-color="#4c0569" stop-opacity="0.6"/><stop offset="100%" stop-color="#9333ea" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="cySun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f43f5e" stop-opacity="0.9"/><stop offset="70%" stop-color="#9333ea" stop-opacity="0.4"/><stop offset="100%" stop-color="#1e0538" stop-opacity="0"/></radialGradient>
    <linearGradient id="cyGrid" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.6"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0.1"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#cySky)"/>
  <circle cx="400" cy="140" r="55" fill="url(#cySun)"/><circle cx="400" cy="140" r="32" fill="#ec4899" opacity="0.8"/>
  <line x1="345" y1="135" x2="455" y2="135" stroke="#1e0538" stroke-width="2.5"/><line x1="352" y1="145" x2="448" y2="145" stroke="#1e0538" stroke-width="3"/><line x1="362" y1="155" x2="438" y2="155" stroke="#1e0538" stroke-width="3.5"/><line x1="375" y1="165" x2="425" y2="165" stroke="#1e0538" stroke-width="4"/>
  <polygon points="260,250 375,120 425,120 540,250" fill="#2e1065" opacity="0.85"/><polygon points="375,120 425,120 445,150 425,160 400,150 375,160 355,150" fill="#e9d5ff" opacity="0.75"/>
  <g fill="#0f021e">
    <rect x="50" y="190" width="35" height="170"/><rect x="75" y="160" width="45" height="200"/><rect x="135" y="180" width="30" height="180"/><rect x="175" y="140" width="50" height="220"/><rect x="235" y="200" width="40" height="160"/>
    <path d="M 580,260 L 610,130 L 616,130 L 646,260 L 634,260 L 618,175 L 613,130 L 608,175 L 592,260 Z"/><rect x="600" y="180" width="26" height="6"/><rect x="604" y="215" width="18" height="6"/><line x1="613" y1="130" x2="613" y2="90" stroke="#0f021e" stroke-width="2.5"/><rect x="655" y="170" width="40" height="190"/><rect x="705" y="150" width="55" height="210"/><rect x="770" y="185" width="40" height="175"/>
  </g>
  <g fill="#06b6d4" opacity="0.75"><circle cx="85" cy="180" r="1.5"/><circle cx="100" cy="180" r="1.5"/><circle cx="85" cy="200" r="1.5"/><circle cx="100" cy="200" r="1.5"/><circle cx="85" cy="220" r="1.5"/><circle cx="100" cy="220" r="1.5"/><circle cx="190" cy="160" r="1.5"/><circle cx="205" cy="160" r="1.5"/><circle cx="190" cy="180" r="1.5"/><circle cx="205" cy="180" r="1.5"/><circle cx="725" cy="170" r="1.5"/><circle cx="740" cy="170" r="1.5"/><circle cx="725" cy="190" r="1.5"/><circle cx="740" cy="190" r="1.5"/></g>
  <circle cx="613" cy="90" r="3" fill="#f43f5e"/>
  <g stroke="url(#cyGrid)" stroke-width="1.2">
    <line x1="0" y1="260" x2="800" y2="260"/><line x1="0" y1="275" x2="800" y2="275"/><line x1="0" y1="295" x2="800" y2="295"/><line x1="0" y1="322" x2="800" y2="322"/><line x1="0" y1="355" x2="800" y2="355"/>
    <line x1="400" y1="250" x2="0" y2="360"/><line x1="400" y1="250" x2="160" y2="360"/><line x1="400" y1="250" x2="320" y2="360"/><line x1="400" y1="250" x2="480" y2="360"/><line x1="400" y1="250" x2="640" y2="360"/><line x1="400" y1="250" x2="800" y2="360"/>
  </g>
</svg>`,

  // 7. Paris / Euro Classic
  europe: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="euSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2a0614" stop-opacity="0.9"/><stop offset="55%" stop-color="#581c2d" stop-opacity="0.6"/><stop offset="100%" stop-color="#be123c" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="euLamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="50%" stop-color="#f59e0b" stop-opacity="0.5"/><stop offset="100%" stop-color="#b45309" stop-opacity="0"/></radialGradient>
    <linearGradient id="euRiver" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#euSky)"/>
  <circle cx="580" cy="165" r="45" fill="#fef08a" opacity="0.35"/><circle cx="580" cy="165" r="22" fill="#fed7aa" opacity="0.65"/>
  <rect x="0" y="240" width="800" height="120" fill="url(#euRiver)"/><ellipse cx="580" cy="255" rx="70" ry="4" fill="#f59e0b" opacity="0.4"/>
  <g fill="#18040d" opacity="0.85">
    <rect x="40" y="195" width="70" height="65"/><polygon points="35,195 75,160 115,195"/><rect x="125" y="180" width="80" height="80"/><polygon points="120,180 165,150 210,180"/>
    <path d="M 280,240 L 280,185 C 280,150 310,130 335,130 C 360,130 390,150 390,185 L 390,240 Z"/><line x1="335" y1="130" x2="335" y2="105" stroke="#18040d" stroke-width="2.5"/><circle cx="335" cy="103" r="3" fill="#f59e0b"/>
  </g>
  <g transform="translate(520, 60) scale(0.68)" fill="#10030a">
    <path d="M 20,265 L 60,155 L 75,155 L 115,265 L 98,265 L 82,210 C 75,198 60,198 53,210 L 37,265 Z"/><rect x="52" y="152" width="31" height="6" fill="#be123c"/><path d="M 56,152 L 64,85 L 71,85 L 79,152 Z"/><rect x="61" y="83" width="13" height="4" fill="#be123c"/><polygon points="64,83 67,10 68,10 71,83"/><line x1="67.5" y1="10" x2="67.5" y2="0" stroke="#10030a" stroke-width="2"/>
    <circle cx="67.5" cy="0" r="2.5" fill="#fef08a"/>
  </g>
  <g fill="#14050e">
    <path d="M 0,250 C 70,250 80,285 140,285 C 200,285 210,250 280,250 C 350,250 360,285 420,285 C 480,285 490,250 560,250 C 630,250 640,285 700,285 C 760,285 770,250 800,250 L 800,265 L 0,265 Z"/><rect x="0" y="244" width="800" height="7" fill="#200717"/>
  </g>
  <g transform="translate(110, 200) scale(0.65)">
    <line x1="20" y1="25" x2="20" y2="130" stroke="#0b0207" stroke-width="4"/><polygon points="12,130 28,130 24,120 16,120" fill="#0b0207"/><circle cx="20" cy="18" r="28" fill="url(#euLamp)"/><polygon points="12,10 28,10 24,25 16,25" fill="#fef08a" opacity="0.95"/><polygon points="10,10 30,10 20,2" fill="#0b0207"/><line x1="20" y1="2" x2="20" y2="-4" stroke="#0b0207" stroke-width="2"/>
  </g>
</svg>`,
  paris: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="euSky2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2a0614" stop-opacity="0.9"/><stop offset="55%" stop-color="#581c2d" stop-opacity="0.6"/><stop offset="100%" stop-color="#be123c" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="euLamp2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="50%" stop-color="#f59e0b" stop-opacity="0.5"/><stop offset="100%" stop-color="#b45309" stop-opacity="0"/></radialGradient>
    <linearGradient id="euRiver2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#euSky2)"/>
  <circle cx="580" cy="165" r="45" fill="#fef08a" opacity="0.35"/><circle cx="580" cy="165" r="22" fill="#fed7aa" opacity="0.65"/>
  <rect x="0" y="240" width="800" height="120" fill="url(#euRiver2)"/><ellipse cx="580" cy="255" rx="70" ry="4" fill="#f59e0b" opacity="0.4"/>
  <g fill="#18040d" opacity="0.85">
    <rect x="40" y="195" width="70" height="65"/><polygon points="35,195 75,160 115,195"/><rect x="125" y="180" width="80" height="80"/><polygon points="120,180 165,150 210,180"/>
    <path d="M 280,240 L 280,185 C 280,150 310,130 335,130 C 360,130 390,150 390,185 L 390,240 Z"/><line x1="335" y1="130" x2="335" y2="105" stroke="#18040d" stroke-width="2.5"/><circle cx="335" cy="103" r="3" fill="#f59e0b"/>
  </g>
  <g transform="translate(520, 60) scale(0.68)" fill="#10030a">
    <path d="M 20,265 L 60,155 L 75,155 L 115,265 L 98,265 L 82,210 C 75,198 60,198 53,210 L 37,265 Z"/><rect x="52" y="152" width="31" height="6" fill="#be123c"/><path d="M 56,152 L 64,85 L 71,85 L 79,152 Z"/><rect x="61" y="83" width="13" height="4" fill="#be123c"/><polygon points="64,83 67,10 68,10 71,83"/><line x1="67.5" y1="10" x2="67.5" y2="0" stroke="#10030a" stroke-width="2"/>
    <circle cx="67.5" cy="0" r="2.5" fill="#fef08a"/>
  </g>
  <g fill="#14050e">
    <path d="M 0,250 C 70,250 80,285 140,285 C 200,285 210,250 280,250 C 350,250 360,285 420,285 C 480,285 490,250 560,250 C 630,250 640,285 700,285 C 760,285 770,250 800,250 L 800,265 L 0,265 Z"/><rect x="0" y="244" width="800" height="7" fill="#200717"/>
  </g>
  <g transform="translate(110, 200) scale(0.65)">
    <line x1="20" y1="25" x2="20" y2="130" stroke="#0b0207" stroke-width="4"/><polygon points="12,130 28,130 24,120 16,120" fill="#0b0207"/><circle cx="20" cy="18" r="28" fill="url(#euLamp2)"/><polygon points="12,10 28,10 24,25 16,25" fill="#fef08a" opacity="0.95"/><polygon points="10,10 30,10 20,2" fill="#0b0207"/><line x1="20" y1="2" x2="20" y2="-4" stroke="#0b0207" stroke-width="2"/>
  </g>
</svg>`,

  // 8. London (UK)
  london: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="ldSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0a192f" stop-opacity="0.9"/><stop offset="50%" stop-color="#1e293b" stop-opacity="0.6"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="ldThames" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0f172a" stop-opacity="0.6"/><stop offset="100%" stop-color="#020617" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#ldSky)"/>
  <g transform="translate(130, 95)" stroke="#64748b" fill="none" opacity="0.7">
    <circle cx="70" cy="70" r="58" stroke-width="2.5"/><circle cx="70" cy="70" r="6" fill="#3b82f6"/>
    <line x1="70" y1="70" x2="70" y2="160" stroke-width="3.5"/><line x1="45" y1="160" x2="95" y2="160" stroke-width="3"/>
    <line x1="70" y1="12" x2="70" y2="128" stroke-width="1"/><line x1="12" y1="70" x2="128" y2="70" stroke-width="1"/>
    <line x1="29" y1="29" x2="111" y2="111" stroke-width="1"/><line x1="111" y1="29" x2="29" y2="111" stroke-width="1"/>
    <circle cx="70" cy="12" r="3.5" fill="#f8fafc"/><circle cx="128" cy="70" r="3.5" fill="#f8fafc"/><circle cx="70" cy="128" r="3.5" fill="#f8fafc"/><circle cx="12" cy="70" r="3.5" fill="#f8fafc"/>
  </g>
  <g transform="translate(320, 60)" fill="#090d16">
    <rect x="25" y="80" width="36" height="180"/><polygon points="20,80 43,20 66,80"/><line x1="43" y1="20" x2="43" y2="0" stroke="#090d16" stroke-width="2.5"/>
    <circle cx="43" cy="98" r="9" fill="#fef08a" stroke="#090d16" stroke-width="2"/>
    <line x1="43" y1="98" x2="43" y2="92" stroke="#090d16" stroke-width="1.5"/><line x1="43" y1="98" x2="48" y2="98" stroke="#090d16" stroke-width="1.5"/><rect x="22" y="115" width="42" height="4" fill="#3b82f6"/>
  </g>
  <g transform="translate(480, 110)" fill="#090d16">
    <rect x="30" y="25" width="22" height="150"/><polygon points="25,25 41,0 57,25"/><rect x="130" y="25" width="22" height="150"/><polygon points="125,25 141,0 157,25"/>
    <rect x="40" y="50" width="102" height="7" fill="#1e293b"/>
    <path d="M 0,110 Q 25,60 52,60 L 52,110 Z" fill="#0f172a" opacity="0.6"/><path d="M 130,110 Q 155,60 182,110 Z" fill="#0f172a" opacity="0.6"/><rect x="0" y="110" width="185" height="10" fill="#090d16"/>
  </g>
  <rect x="0" y="255" width="800" height="105" fill="url(#ldThames)"/>
  <ellipse cx="363" cy="270" rx="30" ry="3" fill="#fef08a" opacity="0.4"/>
</svg>`,

  // 9. New York
  newyork: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="nySky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#030712" stop-opacity="0.95"/><stop offset="50%" stop-color="#0f172a" stop-opacity="0.7"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="nyTorch" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="60%" stop-color="#f59e0b" stop-opacity="0.5"/><stop offset="100%" stop-color="#b45309" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="360" fill="url(#nySky)"/>
  <g fill="#0b1120">
    <rect x="240" y="160" width="45" height="200"/><rect x="295" y="120" width="38" height="240"/><rect x="345" y="80" width="48" height="280"/>
    <rect x="353" y="45" width="32" height="35"/><rect x="363" y="18" width="12" height="27"/><line x1="369" y1="18" x2="369" y2="-10" stroke="#0b1120" stroke-width="2.5"/><circle cx="369" cy="-10" r="2" fill="#ef4444"/>
    <rect x="405" y="100" width="40" height="260"/><polygon points="405,100 425,35 445,100"/><line x1="425" y1="35" x2="425" y2="10" stroke="#0b1120" stroke-width="2"/>
    <rect x="455" y="140" width="55" height="220"/><rect x="520" y="170" width="42" height="190"/><rect x="570" y="130" width="48" height="230"/>
  </g>
  <g fill="#fef08a" opacity="0.65">
    <rect x="352" y="100" width="3" height="4"/><rect x="360" y="100" width="3" height="4"/><rect x="375" y="100" width="3" height="4"/><rect x="352" y="120" width="3" height="4"/><rect x="368" y="120" width="3" height="4"/>
    <rect x="415" y="130" width="3" height="4"/><rect x="430" y="130" width="3" height="4"/><rect x="415" y="150" width="3" height="4"/><rect x="470" y="160" width="3" height="4"/><rect x="485" y="160" width="3" height="4"/>
  </g>
  <g stroke="#334155" stroke-width="1.5" fill="none" opacity="0.7">
    <path d="M 200,270 Q 380,180 600,270"/><path d="M 200,280 L 600,280" stroke-width="3"/>
    <line x1="260" y1="230" x2="260" y2="280"/><line x1="320" y1="205" x2="320" y2="280"/><line x1="380" y1="195" x2="380" y2="280"/><line x1="440" y1="200" x2="440" y2="280"/><line x1="500" y1="220" x2="500" y2="280"/>
  </g>
  <g transform="translate(70, 140) scale(0.62)" fill="#051915">
    <rect x="30" y="150" width="60" height="70"/><path d="M 50,150 L 40,75 C 40,65 55,60 65,60 C 75,60 85,68 85,78 L 78,150 Z"/><circle cx="62" cy="48" r="10"/>
    <path d="M 54,42 L 50,32 M 58,40 L 56,28 M 62,39 L 62,26 M 66,40 L 68,28 M 70,42 L 74,32" stroke="#051915" stroke-width="2.5"/>
    <path d="M 75,65 L 92,20 L 98,22 L 85,75 Z"/><rect x="90" y="14" width="10" height="8"/><circle cx="95" cy="10" r="14" fill="url(#nyTorch)"/><polygon points="90,14 100,14 95,2" fill="#fef08a"/>
    <rect x="32" y="85" width="14" height="20" transform="rotate(-15 32 85)"/>
  </g>
  <rect x="0" y="285" width="800" height="75" fill="#020617"/>
</svg>`,

  // 10. Rome
  rome: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="rmSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#311006" stop-opacity="0.9"/><stop offset="50%" stop-color="#7c2d12" stop-opacity="0.6"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="rmSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/><stop offset="70%" stop-color="#ea580c" stop-opacity="0.4"/><stop offset="100%" stop-color="#7c2d12" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="360" fill="url(#rmSky)"/>
  <circle cx="520" cy="160" r="50" fill="url(#rmSun)"/>
  <g transform="translate(180, 130) scale(0.72)" fill="#1c0702">
    <path d="M 0,180 L 0,60 L 60,60 L 70,30 L 260,30 L 270,60 L 380,60 L 380,180 Z"/>
    <g fill="#431407">
      <path d="M 20,80 A 10,10 0 0 1 40,80 L 40,110 L 20,110 Z"/><path d="M 55,80 A 10,10 0 0 1 75,80 L 75,110 L 55,110 Z"/><path d="M 90,55 A 10,10 0 0 1 110,55 L 110,85 L 90,85 Z"/><path d="M 125,55 A 10,10 0 0 1 145,55 L 145,85 L 125,85 Z"/><path d="M 160,55 A 10,10 0 0 1 180,55 L 180,85 L 160,85 Z"/><path d="M 195,55 A 10,10 0 0 1 215,55 L 215,85 L 195,85 Z"/><path d="M 230,55 A 10,10 0 0 1 250,55 L 250,85 L 230,85 Z"/><path d="M 270,80 A 10,10 0 0 1 290,80 L 290,110 L 270,110 Z"/><path d="M 305,80 A 10,10 0 0 1 325,80 L 325,110 L 305,110 Z"/><path d="M 340,80 A 10,10 0 0 1 360,80 L 360,110 L 340,110 Z"/>
      <path d="M 20,125 A 10,10 0 0 1 40,125 L 40,155 L 20,155 Z"/><path d="M 55,125 A 10,10 0 0 1 75,125 L 75,155 L 55,155 Z"/><path d="M 90,100 A 10,10 0 0 1 110,100 L 110,130 L 90,130 Z"/><path d="M 125,100 A 10,10 0 0 1 145,100 L 145,130 L 125,130 Z"/><path d="M 160,100 A 10,10 0 0 1 180,100 L 180,130 L 160,130 Z"/><path d="M 195,100 A 10,10 0 0 1 215,100 L 215,130 L 195,130 Z"/><path d="M 230,100 A 10,10 0 0 1 250,100 L 250,130 L 230,130 Z"/><path d="M 270,125 A 10,10 0 0 1 290,125 L 290,155 L 270,155 Z"/><path d="M 305,125 A 10,10 0 0 1 325,125 L 325,155 L 305,155 Z"/><path d="M 340,125 A 10,10 0 0 1 360,125 L 360,155 L 340,155 Z"/>
    </g>
  </g>
  <g fill="#140401" opacity="0.9">
    <path d="M 110,270 L 110,180 Q 112,140 115,130 Q 118,140 120,180 L 120,270 Z"/><ellipse cx="115" cy="130" rx="45" ry="16"/><ellipse cx="115" cy="122" rx="35" ry="12"/>
    <path d="M 670,270 L 670,190 Q 672,150 675,140 Q 678,150 680,190 L 680,270 Z"/><ellipse cx="675" cy="140" rx="40" ry="15"/>
  </g>
  <rect x="0" y="260" width="800" height="100" fill="#1c0702"/>
</svg>`,

  // 11. Egypt
  egypt: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="egSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#180c02" stop-opacity="0.9"/><stop offset="50%" stop-color="#451a03" stop-opacity="0.6"/><stop offset="100%" stop-color="#d97706" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="egPyr1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/><stop offset="50%" stop-color="#b45309" stop-opacity="0.7"/><stop offset="100%" stop-color="#451a03" stop-opacity="0.9"/></linearGradient>
    <linearGradient id="egNile" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#egSky)"/>
  <circle cx="620" cy="150" r="45" fill="#fef3c7" opacity="0.4"/><circle cx="620" cy="150" r="22" fill="#fde68a" opacity="0.7"/>
  <polygon points="120,260 270,110 420,260" fill="url(#egPyr1)"/>
  <polygon points="270,110 420,260 270,260" fill="#2d1302" opacity="0.6"/>
  <polygon points="360,260 480,140 600,260" fill="url(#egPyr1)"/>
  <polygon points="480,140 600,260 480,260" fill="#2d1302" opacity="0.6"/>
  <g transform="translate(90, 215) scale(0.6)" fill="#2d1302">
    <ellipse cx="60" cy="40" rx="16" ry="18"/><path d="M 45,35 L 35,55 L 85,55 L 75,35 Z"/>
    <path d="M 50,55 C 50,70 30,70 15,75 L 15,85 L 130,85 C 130,65 110,55 90,55 Z"/>
    <rect x="90" y="75" width="40" height="10"/>
  </g>
  <rect x="0" y="260" width="800" height="100" fill="url(#egNile)"/>
  <g transform="translate(620, 240) scale(0.65)" fill="#1e293b">
    <path d="M 0,35 C 15,35 60,34 75,30 C 85,28 95,20 100,15 C 90,30 70,42 50,42 C 20,42 5,38 0,35 Z" fill="#0f172a"/>
    <line x1="45" y1="35" x2="60" y2="-20" stroke="#0f172a" stroke-width="2.5"/>
    <polygon points="60,-20 90,25 45,28" fill="#f8fafc" opacity="0.85"/>
  </g>
</svg>`,

  // 12. Rajasthan & Taj Mahal
  rajasthan: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="rjSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2a081a" stop-opacity="0.9"/><stop offset="50%" stop-color="#831843" stop-opacity="0.6"/><stop offset="100%" stop-color="#d97706" stop-opacity="0.2"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#rjSky)"/>
  <g transform="translate(280, 100) scale(0.75)">
    <rect x="20" y="180" width="280" height="15" fill="#1c071d"/>
    <rect x="75" y="110" width="170" height="70" fill="#1c071d"/>
    <path d="M 120,180 L 120,140 C 120,125 140,115 160,115 C 180,115 200,125 200,140 L 200,180 Z" fill="#be185d" opacity="0.5"/>
    <path d="M 130,110 C 130,70 145,50 160,40 C 175,50 190,70 190,110 Z" fill="#f8fafc" opacity="0.9"/>
    <line x1="160" y1="40" x2="160" y2="20" stroke="#fef08a" stroke-width="2.5"/><circle cx="160" cy="20" r="2.5" fill="#fef08a"/>
    <path d="M 95,110 C 95,90 102,80 110,75 C 118,80 125,90 125,110 Z" fill="#f8fafc" opacity="0.8"/>
    <path d="M 195,110 C 195,90 202,80 210,75 C 218,80 225,90 225,110 Z" fill="#f8fafc" opacity="0.8"/>
    <rect x="30" y="60" width="10" height="120" fill="#1c071d"/><polygon points="27,60 35,45 43,60" fill="#f8fafc"/><rect x="25" y="90" width="20" height="4" fill="#f8fafc" opacity="0.7"/><rect x="27" y="130" width="16" height="4" fill="#f8fafc" opacity="0.7"/>
    <rect x="280" y="60" width="10" height="120" fill="#1c071d"/><polygon points="277,60 285,45 293,60" fill="#f8fafc"/><rect x="275" y="90" width="20" height="4" fill="#f8fafc" opacity="0.7"/><rect x="277" y="130" width="16" height="4" fill="#f8fafc" opacity="0.7"/>
  </g>
  <g fill="#180410" opacity="0.9">
    <rect x="0" y="210" width="160" height="150"/><path d="M 40,210 C 40,195 55,185 70,185 C 85,185 100,195 100,210 Z"/>
    <rect x="640" y="210" width="160" height="150"/><path d="M 700,210 C 700,195 715,185 730,185 C 745,185 760,195 760,210 Z"/>
    <g transform="translate(115, 175) scale(0.4)" fill="#0284c7">
      <ellipse cx="30" cy="30" rx="8" ry="12"/><circle cx="30" cy="14" r="5"/><path d="M 32,24 C 45,35 65,45 80,60 C 65,55 45,45 32,32 Z" fill="#047857"/>
    </g>
  </g>
  <rect x="0" y="260" width="800" height="100" fill="#14030d"/>
</svg>`,

  // 13. Swiss Alps
  swiss: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="swSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#082f49" stop-opacity="0.9"/><stop offset="50%" stop-color="#0284c7" stop-opacity="0.5"/><stop offset="100%" stop-color="#bae6fd" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="swMatterhorn" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f8fafc" stop-opacity="0.95"/><stop offset="45%" stop-color="#cbd5e1" stop-opacity="0.8"/><stop offset="100%" stop-color="#1e293b" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#swSky)"/>
  <polygon points="180,270 380,80 430,95 620,270" fill="url(#swMatterhorn)"/>
  <polygon points="380,80 430,95 620,270 410,270" fill="#0f172a" opacity="0.6"/>
  <line x1="0" y1="140" x2="800" y2="210" stroke="#64748b" stroke-width="1.5"/>
  <g transform="translate(480, 175) scale(0.65)">
    <line x1="20" y1="5" x2="20" y2="25" stroke="#334155" stroke-width="2.5"/>
    <rect x="5" y="25" width="30" height="22" rx="4" fill="#ef4444"/><rect x="8" y="28" width="10" height="9" rx="1" fill="#f8fafc"/><rect x="22" y="28" width="10" height="9" rx="1" fill="#f8fafc"/>
  </g>
  <g transform="translate(100, 240) scale(0.7)" fill="#1e293b">
    <rect x="30" y="30" width="70" height="45" fill="#451a03"/><polygon points="15,30 65,0 115,30" fill="#f8fafc"/>
    <rect x="80" y="5" width="10" height="15" fill="#334155"/><rect x="45" y="45" width="15" height="15" fill="#fef08a"/>
  </g>
  <g fill="#021a14" opacity="0.95">
    <polygon points="0,360 0,280 20,260 40,285 70,250 100,290 140,240 180,290 230,250 280,300 340,245 400,300 460,240 520,300 580,245 640,300 700,240 760,295 800,260 800,360"/>
  </g>
</svg>`,

  // 14. Santorini
  santorini: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="stSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.9"/><stop offset="50%" stop-color="#1d4ed8" stop-opacity="0.5"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="stSea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.7"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#stSky)"/>
  <circle cx="560" cy="150" r="35" fill="#fef08a" opacity="0.8"/>
  <rect x="0" y="210" width="800" height="150" fill="url(#stSea)"/>
  <g transform="translate(100, 120) scale(0.65)" fill="#f8fafc">
    <polygon points="30,120 40,30 80,30 90,120"/><polygon points="35,30 60,10 85,30" fill="#cbd5e1"/>
    <g stroke="#94a3b8" stroke-width="1.5">
      <line x1="60" y1="25" x2="60" y2="-25"/><line x1="60" y1="25" x2="60" y2="75"/><line x1="60" y1="25" x2="10" y2="25"/><line x1="60" y1="25" x2="110" y2="25"/>
      <polygon points="60,25 70,-20 60,-25" fill="#f8fafc"/><polygon points="60,25 50,70 60,75" fill="#f8fafc"/>
    </g>
  </g>
  <g transform="translate(340, 130) scale(0.75)">
    <rect x="60" y="90" width="110" height="90" fill="#f8fafc"/><path d="M 75,90 C 75,45 155,45 155,90 Z" fill="#2563eb"/>
    <line x1="115" y1="45" x2="115" y2="30" stroke="#f8fafc" stroke-width="3"/><line x1="108" y1="38" x2="122" y2="38" stroke="#f8fafc" stroke-width="3"/>
    <rect x="180" y="80" width="40" height="100" fill="#f8fafc"/><path d="M 188,110 A 8,8 0 0 1 204,110 L 204,130 L 188,130 Z" fill="#1e293b"/>
    <path d="M 185,80 C 185,60 215,60 215,80 Z" fill="#2563eb"/>
    <rect x="230" y="110" width="60" height="70" fill="#f8fafc"/><rect x="275" y="95" width="45" height="85" fill="#f1f5f9"/><rect x="20" y="130" width="50" height="50" fill="#f8fafc"/>
  </g>
  <path d="M 0,270 Q 250,220 500,250 T 800,230 L 800,360 L 0,360 Z" fill="#0f172a" opacity="0.6"/>
</svg>`,

  // 15. Singapore
  singapore: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="sgSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#042f2e" stop-opacity="0.9"/><stop offset="50%" stop-color="#0f766e" stop-opacity="0.5"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="sgTree" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#0f766e"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#sgSky)"/>
  <g transform="translate(120, 70) scale(0.75)" fill="#0f172a">
    <path d="M 30,220 L 38,70 L 65,70 L 60,220 Z"/><path d="M 90,220 L 93,70 L 120,70 L 118,220 Z"/><path d="M 148,220 L 146,70 L 173,70 L 178,220 Z"/>
    <path d="M 10,70 C 40,65 180,65 230,55 C 240,53 235,46 220,48 C 170,55 30,55 10,70 Z" fill="#334155"/>
    <circle cx="215" cy="48" r="3" fill="#10b981"/>
  </g>
  <g transform="translate(450, 110)" stroke="#10b981" stroke-width="2" fill="none">
    <path d="M 80,180 Q 75,100 50,40 M 80,180 Q 85,100 110,40"/><path d="M 35,40 C 35,15 125,15 125,40 C 120,20 40,20 35,40 Z" fill="url(#sgTree)"/>
    <path d="M 190,180 Q 185,115 165,70 M 190,180 Q 195,115 215,70"/><path d="M 155,70 C 155,50 225,50 225,70 Z" fill="url(#sgTree)"/>
    <path d="M 80,65 Q 135,80 190,85" stroke="#38bdf8" stroke-width="2.5"/>
  </g>
  <rect x="0" y="270" width="800" height="90" fill="#022c22"/>
</svg>`,

  // 16. Maldives
  maldives: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="mvSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#083344" stop-opacity="0.8"/><stop offset="50%" stop-color="#0e7490" stop-opacity="0.5"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="mvLagoon" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#06b6d4" stop-opacity="0.6"/><stop offset="50%" stop-color="#0891b2" stop-opacity="0.75"/><stop offset="100%" stop-color="#155e75" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#mvSky)"/>
  <circle cx="480" cy="160" r="45" fill="#fef08a" opacity="0.8"/>
  <rect x="0" y="190" width="800" height="170" fill="url(#mvLagoon)"/>
  <path d="M 0,270 Q 220,250 480,240 T 800,235" stroke="#78350f" stroke-width="8" fill="none"/>
  <g transform="translate(180, 160) scale(0.65)" fill="#451a03">
    <line x1="20" y1="80" x2="20" y2="135" stroke="#451a03" stroke-width="3"/><line x1="75" y1="80" x2="75" y2="135" stroke="#451a03" stroke-width="3"/>
    <rect x="10" y="50" width="75" height="35" fill="#78350f"/><polygon points="0,50 47,15 95,50" fill="#b45309"/>
  </g>
  <g transform="translate(340, 150) scale(0.6)" fill="#451a03">
    <line x1="20" y1="80" x2="20" y2="140" stroke="#451a03" stroke-width="3"/><line x1="75" y1="80" x2="75" y2="140" stroke="#451a03" stroke-width="3"/>
    <rect x="10" y="50" width="75" height="35" fill="#78350f"/><polygon points="0,50 47,15 95,50" fill="#b45309"/>
  </g>
  <g transform="translate(560, 270) scale(0.6)" fill="#083344" opacity="0.85">
    <path d="M 40,10 C 20,25 0,55 0,65 C 20,60 40,55 50,55 C 60,55 80,60 100,65 C 100,55 80,25 60,10 C 55,20 45,20 40,10 Z"/>
    <line x1="50" y1="55" x2="50" y2="95" stroke="#083344" stroke-width="2"/>
  </g>
</svg>`,

  // 17. Vietnam (Ha Long Bay)
  vietnam: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="vnSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#064e3b" stop-opacity="0.85"/><stop offset="50%" stop-color="#047857" stop-opacity="0.5"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="vnWater" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#065f46" stop-opacity="0.6"/><stop offset="100%" stop-color="#022c22" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#vnSky)"/>
  <circle cx="580" cy="140" r="45" fill="#fef08a" opacity="0.75"/>
  <rect x="0" y="210" width="800" height="150" fill="url(#vnWater)"/>
  <path d="M 90,225 C 95,150 115,110 145,95 C 170,85 190,110 200,140 C 210,170 215,200 230,225 Z" fill="#022c22" opacity="0.65"/>
  <path d="M 520,220 C 510,140 535,90 560,75 C 585,60 610,85 625,120 C 640,160 650,190 665,220 Z" fill="#022c22" opacity="0.85"/>
  <g transform="translate(300, 185) scale(0.68)">
    <path d="M 10,65 C 30,64 110,62 145,55 C 160,52 175,42 185,30 C 175,50 145,72 120,75 C 70,80 25,78 10,65 Z" fill="#1e293b"/>
    <line x1="65" y1="65" x2="65" y2="-5" stroke="#334155" stroke-width="2.5"/><path d="M 65,-5 C 80,10 95,30 95,58 L 65,58 Z" fill="#dc2626" opacity="0.9"/>
    <line x1="110" y1="60" x2="110" y2="-20" stroke="#334155" stroke-width="2.5"/><path d="M 110,-20 C 130,-5 150,20 150,52 L 110,52 Z" fill="#dc2626" opacity="0.9"/>
  </g>
  <g transform="translate(160, 260) scale(0.55)" fill="#022c22">
    <ellipse cx="40" cy="30" rx="35" ry="6"/><polygon points="30,12 40,2 50,12" fill="#f59e0b"/><circle cx="40" cy="16" r="4"/><path d="M 35,20 L 45,20 L 42,30 L 38,30 Z"/>
    <line x1="25" y1="18" x2="15" y2="40" stroke="#022c22" stroke-width="2"/>
  </g>
</svg>`,

  // 18. Istanbul
  istanbul: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="isSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#164e63" stop-opacity="0.9"/><stop offset="50%" stop-color="#0891b2" stop-opacity="0.6"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="isWater" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0e7490" stop-opacity="0.6"/><stop offset="100%" stop-color="#083344" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#isSky)"/>
  <circle cx="400" cy="170" r="48" fill="#fef08a" opacity="0.75"/>
  <g transform="translate(180, 60) scale(0.65)" fill="#f43f5e">
    <path d="M 20,35 C 10,20 10,0 25,0 C 40,0 40,20 30,35 L 26,42 L 24,42 Z"/><rect x="23" y="44" width="4" height="4" fill="#78350f"/>
  </g>
  <g transform="translate(260, 90) scale(0.45)" fill="#06b6d4">
    <path d="M 20,35 C 10,20 10,0 25,0 C 40,0 40,20 30,35 L 26,42 L 24,42 Z"/>
  </g>
  <g transform="translate(280, 110) scale(0.75)" fill="#082f49">
    <path d="M 50,170 L 50,130 C 50,110 70,95 100,95 C 130,95 150,110 150,130 L 150,170 Z"/>
    <path d="M 20,170 L 20,140 C 20,125 35,115 55,115 L 55,170 Z"/><path d="M 145,170 L 145,115 C 165,115 180,125 180,140 L 180,170 Z"/>
    <rect x="0" y="40" width="6" height="130"/><polygon points="-2,40 3,10 8,40"/><rect x="-2" y="70" width="10" height="4" fill="#fef08a"/>
    <rect x="195" y="40" width="6" height="130"/><polygon points="193,40 198,10 203,40"/><rect x="193" y="70" width="10" height="4" fill="#fef08a"/>
    <rect x="35" y="65" width="5" height="105"/><polygon points="33,65 37.5,35 42,65"/>
    <rect x="160" y="65" width="5" height="105"/><polygon points="158,65 162.5,35 167,65"/>
  </g>
  <rect x="0" y="240" width="800" height="120" fill="url(#isWater)"/>
</svg>`,

  // 19. Rio de Janeiro
  rio: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="roSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#064e3b" stop-opacity="0.9"/><stop offset="50%" stop-color="#15803d" stop-opacity="0.5"/><stop offset="100%" stop-color="#eab308" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="roSea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0284c7" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#roSky)"/>
  <circle cx="560" cy="150" r="50" fill="#fef08a" opacity="0.8"/>
  <path d="M 540,250 C 530,160 570,120 620,120 C 670,120 710,160 700,250 Z" fill="#052e16" opacity="0.75"/>
  <path d="M 80,260 L 220,100 L 360,260 Z" fill="#022c22"/>
  <g transform="translate(200, 35) scale(0.65)" fill="#f8fafc">
    <rect x="25" y="60" width="16" height="42"/><circle cx="33" cy="50" r="6"/>
    <path d="M 0,60 L 66,60 L 66,68 L 0,68 Z"/><polygon points="25,102 41,102 45,115 21,115" fill="#334155"/>
  </g>
  <rect x="0" y="250" width="800" height="110" fill="url(#roSea)"/>
  <path d="M 0,270 Q 50,255 100,270 T 200,270 T 300,270 T 400,270 T 500,270 T 600,270 T 700,270 T 800,270" stroke="#fef08a" stroke-width="4" fill="none" opacity="0.6"/>
</svg>`,

  // 20. Sydney
  sydney: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="sySky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0c2340" stop-opacity="0.9"/><stop offset="50%" stop-color="#1e3a8a" stop-opacity="0.6"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="sySea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e40af" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#sySky)"/>
  <g transform="translate(60, 80)" stroke="#1e293b" fill="none">
    <path d="M 0,160 Q 200,40 400,160" stroke-width="8"/><path d="M 30,160 Q 200,75 370,160" stroke-width="5"/>
    <line x1="0" y1="140" x2="400" y2="140" stroke="#0f172a" stroke-width="6"/>
    <rect x="-10" y="110" width="25" height="55" fill="#334155" stroke="none"/><rect x="385" y="110" width="25" height="55" fill="#334155" stroke="none"/>
  </g>
  <g transform="translate(450, 140) scale(0.85)">
    <rect x="0" y="80" width="260" height="20" fill="#0f172a"/>
    <path d="M 30,80 C 40,40 65,20 85,20 C 85,45 65,80 30,80 Z" fill="#f8fafc"/>
    <path d="M 65,80 C 75,50 95,35 110,35 C 110,55 95,80 65,80 Z" fill="#e2e8f0"/>
    <path d="M 120,80 C 135,25 170,0 195,0 C 195,35 165,80 120,80 Z" fill="#f8fafc"/>
    <path d="M 165,80 C 175,35 205,15 225,15 C 225,45 200,80 165,80 Z" fill="#e2e8f0"/>
  </g>
  <rect x="0" y="240" width="800" height="120" fill="url(#sySea)"/>
</svg>`,

  // 21. Las Vegas
  vegas: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="vgSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3b0764" stop-opacity="0.9"/><stop offset="50%" stop-color="#831843" stop-opacity="0.6"/><stop offset="100%" stop-color="#e11d48" stop-opacity="0.2"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#vgSky)"/>
  <g transform="translate(540, 100) scale(0.75)" stroke="#f59e0b" fill="none">
    <circle cx="80" cy="80" r="70" stroke-width="5" fill="#18021a"/><circle cx="80" cy="80" r="50" stroke-width="2"/>
    <circle cx="80" cy="80" r="25" stroke-width="2" fill="#e11d48"/>
    <line x1="80" y1="10" x2="80" y2="150" stroke-width="1.5"/><line x1="10" y1="80" x2="150" y2="80" stroke-width="1.5"/>
    <line x1="30" y1="30" x2="130" y2="130" stroke-width="1.5"/><line x1="130" y1="30" x2="30" y2="130" stroke-width="1.5"/>
    <circle cx="105" cy="55" r="4" fill="#ffffff"/>
  </g>
  <g transform="translate(100, 90) scale(0.75)">
    <line x1="70" y1="80" x2="40" y2="180" stroke="#e11d48" stroke-width="4"/><line x1="90" y1="80" x2="120" y2="180" stroke="#e11d48" stroke-width="4"/>
    <polygon points="80,10 140,55 80,100 20,55" fill="#0f172a" stroke="#fef08a" stroke-width="3"/>
    <polygon points="80,0 83,7 90,8 85,13 86,20 80,16 74,20 75,13 70,8 77,7" fill="#ef4444"/>
    <circle cx="80" cy="55" r="20" fill="#f59e0b" opacity="0.3"/>
  </g>
  <g transform="translate(350, 160) scale(0.65)" fill="#f8fafc">
    <rect x="0" y="20" width="40" height="40" rx="6" fill="#f8fafc"/><circle cx="20" cy="40" r="3.5" fill="#ef4444"/>
    <rect x="35" y="0" width="40" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="45" cy="10" r="3" fill="#0f172a"/><circle cx="65" cy="30" r="3" fill="#0f172a"/><circle cx="55" cy="20" r="3" fill="#0f172a"/>
  </g>
  <rect x="0" y="270" width="800" height="90" fill="#120117"/>
</svg>`,

  // 22. Iceland (Aurora)
  iceland: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="icSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#020d18" stop-opacity="0.95"/><stop offset="60%" stop-color="#052e16" stop-opacity="0.7"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="icAurora" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.7"/><stop offset="50%" stop-color="#06b6d4" stop-opacity="0.8"/><stop offset="100%" stop-color="#a855f7" stop-opacity="0.7"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#icSky)"/>
  <path d="M 0,90 Q 200,20 400,80 T 800,40 L 800,140 Q 600,100 400,150 T 0,110 Z" fill="url(#icAurora)" opacity="0.6"/>
  <path d="M 0,120 Q 250,50 500,110 T 800,70 L 800,160 Q 550,110 300,170 T 0,140 Z" fill="url(#icAurora)" opacity="0.45"/>
  <polygon points="0,270 180,140 320,230 460,130 620,240 800,160 800,360 0,360" fill="#04121a"/>
  <g transform="translate(620, 180)" fill="#e0f2fe" opacity="0.75">
    <ellipse cx="20" cy="50" rx="8" ry="40"/><ellipse cx="22" cy="20" rx="16" ry="25"/><ellipse cx="25" cy="-10" rx="25" ry="20"/>
  </g>
</svg>`,

  // 23. Amsterdam
  amsterdam: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="amSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1c1917" stop-opacity="0.9"/><stop offset="50%" stop-color="#451a03" stop-opacity="0.6"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="amCanal" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e293b" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#amSky)"/>
  <circle cx="560" cy="150" r="40" fill="#fef08a" opacity="0.7"/>
  <g transform="translate(180, 80) scale(0.75)" fill="#1c0d02">
    <rect x="0" y="80" width="55" height="130"/><path d="M 0,80 L 10,80 L 10,65 L 20,65 L 20,50 L 35,50 L 35,65 L 45,65 L 45,80 L 55,80 Z"/>
    <rect x="60" y="70" width="50" height="140"/><path d="M 60,70 C 60,50 85,35 85,35 C 85,35 110,50 110,70 Z"/>
    <rect x="115" y="60" width="52" height="150"/><polygon points="115,60 141,30 167,60"/>
    <rect x="172" y="75" width="48" height="135"/><polygon points="172,75 196,45 220,75"/>
  </g>
  <g fill="#291205">
    <path d="M 0,240 C 80,240 100,280 180,280 C 260,280 280,240 360,240 C 440,240 460,280 540,280 C 620,280 640,240 720,240 L 800,240 L 800,255 L 0,255 Z"/>
  </g>
  <g transform="translate(300, 195) scale(0.65)" stroke="#f8fafc" stroke-width="2.5" fill="none">
    <circle cx="20" cy="40" r="16"/><circle cx="70" cy="40" r="16"/><line x1="20" y1="40" x2="45" y2="40"/><line x1="45" y1="40" x2="65" y2="20"/><line x1="45" y1="40" x2="35" y2="20"/><line x1="20" y1="40" x2="35" y2="20"/><line x1="70" y1="40" x2="65" y2="20"/>
    <line x1="65" y1="20" x2="68" y2="10"/><line x1="62" y1="10" x2="74" y2="10"/><rect x="70" y="12" width="12" height="10" fill="#78350f" stroke="none"/>
  </g>
  <rect x="0" y="255" width="800" height="105" fill="url(#amCanal)"/>
</svg>`,

  // 24. African Safari
  safari: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="sfSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#450a0a" stop-opacity="0.95"/><stop offset="50%" stop-color="#991b1b" stop-opacity="0.6"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.25"/></linearGradient>
    <radialGradient id="sfSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="60%" stop-color="#ea580c" stop-opacity="0.7"/><stop offset="100%" stop-color="#7f1d1d" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="800" height="360" fill="url(#sfSky)"/>
  <circle cx="500" cy="180" r="70" fill="url(#sfSun)"/><circle cx="500" cy="180" r="38" fill="#fde047" opacity="0.9"/>
  <g transform="translate(80, 100) scale(0.85)" fill="#1c0505">
    <path d="M 60,180 Q 55,100 40,70 Q 30,55 20,40 M 60,180 Q 65,100 80,70 Q 95,50 110,35" stroke="#1c0505" stroke-width="7" fill="none"/>
    <ellipse cx="25" cy="40" rx="35" ry="8"/><ellipse cx="110" cy="35" rx="45" ry="9"/><ellipse cx="70" cy="55" rx="50" ry="10"/>
  </g>
  <g transform="translate(360, 150) scale(0.65)" fill="#1c0505">
    <path d="M 20,95 C 20,85 30,80 40,80 L 45,40 C 48,20 52,10 52,2 C 54,0 58,0 58,5 C 57,15 54,35 52,80 L 60,85 C 65,85 70,95 70,105 L 68,160 L 64,160 L 64,115 L 56,115 L 56,160 L 52,160 L 54,105 L 28,105 L 28,160 L 24,160 L 26,105 L 20,105 Z"/>
    <polygon points="52,2 56,0 55,6"/>
    <g transform="translate(60, 35) scale(0.65)">
      <path d="M 20,95 C 20,85 30,80 40,80 L 45,40 C 48,20 52,10 52,2 C 54,0 58,0 58,5 C 57,15 54,35 52,80 L 60,85 C 65,85 70,95 70,105 L 68,160 L 64,160 L 64,115 L 56,115 L 56,160 L 52,160 L 54,105 L 28,105 L 28,160 L 24,160 L 26,105 L 20,105 Z"/>
    </g>
  </g>
  <g transform="translate(560, 205) scale(0.65)" fill="#1c0505">
    <ellipse cx="60" cy="50" rx="35" ry="25"/><circle cx="28" cy="42" r="16"/>
    <path d="M 20,45 C 15,55 10,75 5,80 C 7,80 12,75 14,65 L 18,52 Z"/><path d="M 22,54 Q 16,62 12,60" stroke="#fef08a" stroke-width="2" fill="none"/>
    <rect x="35" y="65" width="12" height="35"/><rect x="52" y="65" width="12" height="35"/><rect x="75" y="65" width="12" height="35"/>
  </g>
  <rect x="0" y="270" width="800" height="90" fill="#140202"/>
</svg>`,

  // 25. Varanasi (Ganga Ghats)
  varanasi: `<svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="vrSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#451a03" stop-opacity="0.95"/><stop offset="50%" stop-color="#b45309" stop-opacity="0.6"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0.25"/></linearGradient>
    <radialGradient id="vrAarti" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/><stop offset="50%" stop-color="#f59e0b" stop-opacity="0.6"/><stop offset="100%" stop-color="#ea580c" stop-opacity="0"/></radialGradient>
    <linearGradient id="vrGanga" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.6"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#vrSky)"/>
  <circle cx="480" cy="160" r="50" fill="#fef08a" opacity="0.4"/>
  <g transform="translate(140, 90) scale(0.75)" fill="#1c0a02">
    <path d="M 60,180 L 60,110 C 60,70 75,40 85,20 C 95,40 110,70 110,110 L 110,180 Z"/>
    <circle cx="85" cy="18" r="4" fill="#f59e0b"/><line x1="85" y1="18" x2="85" y2="8" stroke="#f59e0b" stroke-width="2"/>
    <path d="M 120,180 L 120,130 C 120,95 132,70 140,55 C 148,70 160,95 160,130 L 160,180 Z"/><circle cx="140" cy="53" r="3.5" fill="#f59e0b"/>
    <rect x="180" y="140" width="50" height="40"/><path d="M 175,140 C 175,120 205,110 205,110 C 205,110 235,120 235,140 Z"/>
  </g>
  <g fill="#291204">
    <rect x="0" y="220" width="800" height="8"/><rect x="0" y="228" width="800" height="8"/><rect x="0" y="236" width="800" height="8"/><rect x="0" y="244" width="800" height="8"/><rect x="0" y="252" width="800" height="8"/>
  </g>
  <rect x="0" y="260" width="800" height="100" fill="url(#vrGanga)"/>
  <g transform="translate(420, 275)" fill="#f59e0b">
    <ellipse cx="10" cy="10" rx="8" ry="3" fill="#78350f"/><polygon points="7,10 13,10 10,2" fill="#fef08a"/><circle cx="10" cy="6" r="10" fill="url(#vrAarti)"/>
  </g>
  <g transform="translate(520, 290)" fill="#f59e0b">
    <ellipse cx="10" cy="10" rx="8" ry="3" fill="#78350f"/><polygon points="7,10 13,10 10,2" fill="#fef08a"/><circle cx="10" cy="6" r="10" fill="url(#vrAarti)"/>
  </g>
  <g transform="translate(600, 270) scale(0.65)" fill="#1c0a02">
    <path d="M 0,25 C 20,25 70,24 95,20 C 105,18 115,10 120,5 C 110,20 85,32 60,32 C 30,32 10,28 0,25 Z"/>
    <line x1="50" y1="12" x2="35" y2="35" stroke="#1c0a02" stroke-width="2.5"/>
  </g>
</svg>`
};

function detectThemeFromTrip(trip) {
  if (!trip) return 'tropical';
  const text = `${trip.name || ''} ${trip.destination || ''}`.toLowerCase();

  // Beaches & Islands
  if (/goa|anjuna|baga|vagator|sunburn|panjim|morjim|candolim|arambol/.test(text)) return 'goa';
  if (/bali|ubud|seminyak|canggu|uluwatu|indonesia|kuta|denpasar|sanur/.test(text)) return 'bali';
  if (/maldives|male|atoll|bora bora/.test(text)) return 'maldives';
  if (/santorini|mykonos|greece|athens|aegean/.test(text)) return 'santorini';
  if (/vietnam|hanoi|da nang|ha long|halong|saigon|ho chi minh/.test(text)) return 'vietnam';

  // Mountains & Nature
  if (/ladakh|manali|spiti|alps|himalaya|mountain|trek|snow|shimla|kasol|leh/.test(text)) return 'mountains';
  if (/swiss|switzerland|matterhorn|zermatt|zurich|interlaken|lucerne|geneva/.test(text)) return 'swiss';
  if (/iceland|reykjavik|aurora|northern lights|norway|finland|arctic/.test(text)) return 'iceland';
  if (/safari|kenya|serengeti|tanzania|mara|africa|masai/.test(text)) return 'safari';

  // Metros & Luxury
  if (/dubai|abu dhabi|uae|doha|qatar|desert/.test(text)) return 'dubai';
  if (/singapore|sentosa|marina bay/.test(text)) return 'singapore';
  if (/tokyo|japan|kyoto|osaka|seoul|korea|cyber|neon/.test(text)) return 'cyber';
  if (/new york|nyc|manhattan|brooklyn|america|usa/.test(text)) return 'newyork';
  if (/london|uk|britain|england|big ben|thames/.test(text)) return 'london';
  if (/vegas|las vegas|casino|nevada/.test(text)) return 'vegas';
  if (/sydney|australia|melbourne|opera house|bondi/.test(text)) return 'sydney';

  // Heritage & Wonders
  if (/paris|france|eiffel|louvre/.test(text)) return 'paris';
  if (/rome|italy|vatican|colosseum|florence|venice/.test(text)) return 'rome';
  if (/egypt|cairo|giza|pyramid|nile|sphinx|luxor/.test(text)) return 'egypt';
  if (/rajasthan|jaipur|udaipur|jodhpur|agra|taj mahal|jaisalmer/.test(text)) return 'rajasthan';
  if (/istanbul|turkey|cappadocia|bosphorus|ankara/.test(text)) return 'istanbul';
  if (/rio|brazil|copacabana|carnival|samba/.test(text)) return 'rio';
  if (/amsterdam|netherlands|holland|canals/.test(text)) return 'amsterdam';
  if (/varanasi|banaras|kashi|ganga|ghat|haridwar|ayodhya|rishikesh/.test(text)) return 'varanasi';
  if (/europe|prague|barcelona|madrid/.test(text)) return 'paris';

  return 'tropical';
}

function applyDestinationTheme(themeKey) {
  const validKey = DESTINATION_THEMES[themeKey] ? themeKey : 'tropical';
  document.body.setAttribute('data-theme', validKey);

  // Update theme badge in settings
  const badge = document.getElementById('activeThemeBadge');
  if (badge) {
    badge.textContent = DESTINATION_THEMES[validKey].badge;
  }

  // Update hero atmosphere badge & text
  const heroBadge = document.getElementById('heroTripAtmosphereBadge');
  if (heroBadge) {
    heroBadge.innerHTML = `${DESTINATION_THEMES[validKey].emoji} <span id="heroTripAtmosphereText">${DESTINATION_THEMES[validKey].name}</span>`;
  }

  // 🎨 Update Hero Card Destination Horizon Scenic Graphic Artwork
  const scenicContainer = document.getElementById('heroScenicArtContainer');
  if (scenicContainer && DESTINATION_GRAPHICS[validKey]) {
    scenicContainer.style.opacity = '0';
    setTimeout(() => {
      scenicContainer.innerHTML = DESTINATION_GRAPHICS[validKey];
      scenicContainer.setAttribute('data-loaded-theme', validKey);
      scenicContainer.style.opacity = '0.48';
    }, 120);
  }

  // Update selection button styles in settings grid
  Object.keys(DESTINATION_THEMES).forEach(k => {
    const btn = document.getElementById(`themeBtn-${k}`);
    if (btn) {
      if (k === validKey) {
        btn.className = 'p-2.5 rounded-xl border border-brand-400 bg-brand-500/25 text-left active-press transition-all flex items-center gap-2 ring-2 ring-brand-400/50';
      } else {
        btn.className = 'p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-left active-press transition-all flex items-center gap-2 hover:border-slate-700';
      }
    }
  });

  // Update active nav button color to match theme
  const activeNav = document.getElementById(`nav-btn-${state.activeTab}`);
  if (activeNav) {
    activeNav.style.color = 'var(--theme-primary-light, #2DD4BF)';
  }
}

function setAppTheme(themeKey) {
  const trip = state.activeTrip;
  if (!trip) return;
  trip.theme = themeKey;
  saveTripsToStorage();
  applyDestinationTheme(themeKey);
  SoundEffects.playPop();
  showToast(`🎨 Atmosphere switched to ${DESTINATION_THEMES[themeKey].name}!`);
}

let currentThemeCategoryFilter = 'all';
let currentThemeSearchQuery = '';

function filterThemeCategory(cat) {
  currentThemeCategoryFilter = cat;
  const categories = ['all', 'beach', 'mountain', 'metro', 'heritage'];
  categories.forEach(c => {
    const btn = document.getElementById(`themeCatBtn-${c}`);
    if (btn) {
      if (c === cat) {
        btn.className = 'px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap bg-brand-500 text-slate-950 shadow-sm shadow-brand-500/30';
      } else {
        btn.className = 'px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700';
      }
    }
  });
  renderThemePickerGrid();
}

function filterThemeSearch(query) {
  currentThemeSearchQuery = (query || '').toLowerCase().trim();
  const clearBtn = document.getElementById('themeSearchClearBtn');
  if (clearBtn) {
    if (currentThemeSearchQuery.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderThemePickerGrid();
}

function clearThemeSearch() {
  const searchInput = document.getElementById('themeSearchInput');
  if (searchInput) searchInput.value = '';
  filterThemeSearch('');
}

function renderThemePickerGrid() {
  const container = document.getElementById('themeChoicesGrid');
  if (!container) return;

  const currentTheme = state.activeTrip ? (state.activeTrip.theme || 'tropical') : 'tropical';
  const effectiveTheme = (currentTheme === 'europe') ? 'paris' : currentTheme;

  // Filter keys: exclude 'europe' so Paris is not displayed twice
  const themeKeys = Object.keys(DESTINATION_THEMES).filter(k => k !== 'europe');

  const filteredKeys = themeKeys.filter(key => {
    const item = DESTINATION_THEMES[key];
    if (!item) return false;
    // Category filter
    if (currentThemeCategoryFilter !== 'all' && item.cat !== currentThemeCategoryFilter) {
      return false;
    }
    // Search query filter
    if (currentThemeSearchQuery) {
      const matchName = item.name.toLowerCase().includes(currentThemeSearchQuery);
      const matchSub = (item.sub || '').toLowerCase().includes(currentThemeSearchQuery);
      const matchDesc = (item.desc || '').toLowerCase().includes(currentThemeSearchQuery);
      const matchKey = key.toLowerCase().includes(currentThemeSearchQuery);
      if (!matchName && !matchSub && !matchDesc && !matchKey) {
        return false;
      }
    }
    return true;
  });

  if (filteredKeys.length === 0) {
    container.innerHTML = `
      <div class="col-span-1 sm:col-span-2 py-10 text-center text-slate-400 space-y-2">
        <i class="fa-solid fa-map-location-dot text-3xl text-slate-600 mb-1"></i>
        <p class="text-xs font-semibold text-slate-300">No destination found matching "${currentThemeSearchQuery}"</p>
        <p class="text-[11px] text-slate-500">Try searching for Bali, Dubai, Swiss, Tokyo, or switch category tab.</p>
        <button type="button" onclick="clearThemeSearch(); filterThemeCategory('all')" class="mt-2 text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-brand-400 hover:text-white font-medium active-press">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredKeys.map(key => {
    const item = DESTINATION_THEMES[key];
    const isActive = (key === effectiveTheme);
    const borderCls = isActive 
      ? 'border-brand-400 bg-brand-500/15 shadow-lg shadow-brand-500/10 ring-1 ring-brand-400/50' 
      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850';

    return `
      <button type="button" onclick="selectThemeFromModal('${key}')" 
        class="p-3 rounded-2xl border ${borderCls} text-left active-press transition-all flex items-center gap-3 group relative overflow-hidden">
        <span class="text-2xl p-2.5 rounded-xl bg-slate-800/80 group-hover:scale-110 transition-transform shrink-0 flex items-center justify-center shadow-inner">
          ${item.emoji}
        </span>
        <div class="min-w-0 flex-1">
          <div class="font-bold text-white text-xs flex items-center justify-between gap-1">
            <span class="truncate">${item.name}</span>
            ${isActive ? '<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-500/30 text-brand-300 font-bold shrink-0">✓ Active</span>' : ''}
          </div>
          <div class="text-[10px] text-brand-400/90 font-medium truncate mt-0.5">${item.sub || ''}</div>
          <div class="text-[9.5px] text-slate-400 truncate mt-0.5">${item.desc || ''}</div>
        </div>
      </button>
    `;
  }).join('');
}

function openThemePickerModal() {
  currentThemeCategoryFilter = 'all';
  currentThemeSearchQuery = '';
  const searchInput = document.getElementById('themeSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('themeSearchClearBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  
  const categories = ['all', 'beach', 'mountain', 'metro', 'heritage'];
  categories.forEach(c => {
    const btn = document.getElementById(`themeCatBtn-${c}`);
    if (btn) {
      if (c === 'all') {
        btn.className = 'px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap bg-brand-500 text-slate-950 shadow-sm shadow-brand-500/30';
      } else {
        btn.className = 'px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700';
      }
    }
  });

  renderThemePickerGrid();
  openModal('modalThemePicker');
  SoundEffects.playPop();
}

function selectThemeFromModal(themeKey) {
  setAppTheme(themeKey);
  closeModal('modalThemePicker');
}

// ==================== INITIALIZATION & CLEAN SLATE ====================
function initApp() {
  loadDiscreetMode();

  loadTripsFromStorage();

  // If trips exist, select saved active trip
  if (state.trips && state.trips.length > 0) {
    const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID);
    state.activeTrip = state.trips.find(t => t.id === savedActiveId) || state.trips[0] || null;
  } else {
    state.trips = [];
    state.activeTrip = null;
  }

  // Register Service Worker for Offline-First PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.update().catch(() => {});
    }).catch(err => {
      console.warn('SW registration skipped:', err);
    });
  }

  // Network online/offline event listeners
  window.addEventListener('online', updateSyncStatus);
  window.addEventListener('offline', updateSyncStatus);

  // Initialize Security Vault Engine
  if (window.SecurityVault) {
    window.SecurityVault.init();
    if (state.activeTrip) {
      window.SecurityVault.signTripLedger(state.activeTrip);
    }
  }

  // Apply Atmosphere Theme & Sound Status
  if (state.activeTrip) {
    applyDestinationTheme(state.activeTrip.theme || detectThemeFromTrip(state.activeTrip));
  } else {
    applyDestinationTheme('tropical');
  }
  updateSoundUI();
  applyAppLogo(getActiveAppLogoKey());

  // Initial UI Render
  renderAll();
  updateSyncStatus();

  if (window.SecurityVault) {
    window.SecurityVault.updateSecurityStatusUI();
  }

  // Real-time Cloud Sync & URL Join Handler
  checkUrlForJoinCode();
  startRealtimeCloudPolling();

  // Check if first-time visitor should see the interactive tour
  if (!localStorage.getItem('tb_tour_seen_v2')) {
    setTimeout(() => {
      openAppTourModal(0);
    }, 600);
  }
}

function loadTripsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (raw) {
      state.trips = JSON.parse(raw);
      state.trips.forEach(t => {
        if (!t.theme) {
          t.theme = detectThemeFromTrip(t);
        }
        if (!t.homeCurrency) {
          t.homeCurrency = 'INR';
          t.homeCurrencySymbol = '₹';
        }
        // Auto-detect destination currency for international trips if not explicitly configured
        const tripSearchText = `${t.name || ''} ${t.destination || ''}`.toLowerCase();
        if ((!t.baseCurrency || (t.baseCurrency === 'INR' && (!t.forexRate || t.forexRate === 1))) && (tripSearchText.includes('thai') || tripSearchText.includes('bangkok') || tripSearchText.includes('phuket') || tripSearchText.includes('pattaya'))) {
          t.baseCurrency = 'THB';
          t.currencySymbol = '฿';
          t.forexRate = 2.48;
        } else if ((!t.baseCurrency || (t.baseCurrency === 'INR' && (!t.forexRate || t.forexRate === 1))) && (tripSearchText.includes('dubai') || tripSearchText.includes('uae') || tripSearchText.includes('dhabi'))) {
          t.baseCurrency = 'AED';
          t.currencySymbol = 'د.إ';
          t.forexRate = 22.80;
        } else if ((!t.baseCurrency || (t.baseCurrency === 'INR' && (!t.forexRate || t.forexRate === 1))) && (tripSearchText.includes('europe') || tripSearchText.includes('paris') || tripSearchText.includes('rome') || tripSearchText.includes('amsterdam'))) {
          t.baseCurrency = 'EUR';
          t.currencySymbol = '€';
          t.forexRate = 92.50;
        } else if ((!t.baseCurrency || (t.baseCurrency === 'INR' && (!t.forexRate || t.forexRate === 1))) && (tripSearchText.includes('bali') || tripSearchText.includes('indonesia'))) {
          t.baseCurrency = 'IDR';
          t.currencySymbol = 'Rp';
          t.forexRate = 0.0054;
        }
        if (!t.kitty) {
          t.kitty = {
            balance: 0,
            targetPerMember: 0,
            totalCollected: 0,
            contributors: (t.members || []).map(m => m.id),
            transactions: []
          };
        }
        if (!t.budget) {
          t.budget = { total: 0, days: 3, currency: t.homeCurrency || 'INR' };
        }
        if (!t.pendingSettlements) t.pendingSettlements = [];
        if (!t.activityLog) {
          t.activityLog = [
            { id: 'log-1', timestamp: Date.now(), type: 'info', memberName: 'Trip Barabar', text: 'Trip loaded and ready', icon: 'fa-check' }
          ];
        }
      });
    }
  } catch (e) {
    console.error('Error reading trips from localStorage:', e);
    state.trips = [];
  }
}

function saveTripsToStorage() {
  if (window.SecurityVault && state.activeTrip) {
    window.SecurityVault.signTripLedger(state.activeTrip).catch(err => {
      console.warn('Security vault ledger sign warning:', err);
    });
  }
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(state.trips));
  if (state.activeTrip) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, state.activeTrip.id);
  }
  if (typeof debouncedCloudSync === 'function') {
    debouncedCloudSync();
  }
}

// ==================== DISCREET / STEALTH MODE ENGINE ====================
function loadDiscreetMode() {
  const saved = localStorage.getItem(STORAGE_KEYS.DISCREET_MODE);
  state.discreetMode = saved === 'true';
}

function toggleDiscreetMode() {
  state.discreetMode = !state.discreetMode;
  localStorage.setItem(STORAGE_KEYS.DISCREET_MODE, state.discreetMode);
  
  // Audio haptic feedback if available
  if (navigator.vibrate) navigator.vibrate(35);
  
  showToast(state.discreetMode ? '🛡️ Discreet Mode: Nightlife icons safely masked' : '👁️ Bro Mode: Candid icons activated');
  renderAll();
}

function getCategoryInfo(catId) {
  const allCats = [...DEFAULT_CATEGORIES, ...(state.activeTrip?.customCategories || [])];
  const cat = allCats.find(c => c.id === catId) || {
    id: 'misc', emoji: '💵', name: 'General', discreetName: 'General', color: '#64748B'
  };

  if (state.discreetMode) {
    let discreetEmoji = cat.emoji;
    if (cat.id === 'lapdance') discreetEmoji = '🎭';
    else if (cat.id === 'adult') discreetEmoji = '🌿';
    else if (cat.id === 'oral') discreetEmoji = '✨';
    else if (cat.id === 'ladydrinks') discreetEmoji = '🍹';
    else if (cat.id === 'dispensary') discreetEmoji = '🍵';

    return {
      ...cat,
      displayName: cat.discreetName || cat.name,
      displayEmoji: discreetEmoji
    };
  }

  return {
    ...cat,
    displayName: cat.name,
    displayEmoji: cat.emoji
  };
}

// ==================== RENDERING ENGINE ====================
function renderAll() {
  const welcomeView = document.getElementById('welcomeNoTripView');
  const activeTripView = document.getElementById('activeTripMainView');
  const bottomNav = document.getElementById('bottomNavBar');
  const fab = document.getElementById('fabContainer');

  if (!state.activeTrip) {
    if (welcomeView) welcomeView.classList.remove('hidden');
    if (activeTripView) activeTripView.classList.add('hidden');
    if (bottomNav) bottomNav.classList.add('hidden');
    if (fab) fab.classList.add('hidden');
    renderHeaderNoTrip();
    return;
  }

  if (welcomeView) welcomeView.classList.add('hidden');
  if (activeTripView) activeTripView.classList.remove('hidden');
  if (bottomNav) bottomNav.classList.remove('hidden');
  if (fab) fab.classList.remove('hidden');

  applyDestinationTheme(state.activeTrip.theme || detectThemeFromTrip(state.activeTrip));
  renderHeader();
  renderHeroCard();
  renderFriendsBreakdown();
  renderKittyCard();
  renderBudgetPaceCard();
  renderCategoryFilterChips();
  renderExpensesList();
  renderSettleUpTab();
  renderBilateralPendingContainer();
  renderAnalyticsTab();
  renderSettingsTab();
}

function renderHeaderNoTrip() {
  const nameEl = document.getElementById('headerTripName');
  if (nameEl) {
    nameEl.innerHTML = `<span class="text-amber-400 font-bold">+ Create / Join Trip</span>`;
  }
  const datesEl = document.getElementById('headerTripDates');
  if (datesEl) {
    datesEl.textContent = 'No Active Trip';
  }
  const syncBadge = document.getElementById('syncHeaderBadge');
  if (syncBadge) {
    const text = document.getElementById('syncHeaderText');
    if (text) text.textContent = 'Ready';
  }
}

function renderHeader() {
  const trip = state.activeTrip;
  if (!trip) return;

  document.getElementById('headerTripName').innerHTML = `
    <span>${escapeHtml(trip.name)}</span>
    <i class="fa-solid fa-chevron-down text-xs text-brand-400"></i>
  `;
  document.getElementById('headerTripDates').textContent = trip.dates || 'Ongoing';

  // Discreet Mode button UI
  const btnDiscreet = document.getElementById('btnToggleDiscreet');
  const discreetIcon = document.getElementById('discreetIcon');
  const discreetLabel = document.getElementById('discreetLabel');
  const discreetBanner = document.getElementById('discreetBanner');

  if (state.discreetMode) {
    btnDiscreet.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border active-press bg-emerald-950 text-emerald-300 border-emerald-500/50 stealth-pulse';
    discreetIcon.className = 'fa-solid fa-shield-halved text-emerald-400';
    discreetLabel.textContent = 'Discreet Mode';
    discreetBanner.classList.remove('hidden');
  } else {
    btnDiscreet.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border active-press bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-500';
    discreetIcon.className = 'fa-solid fa-eye text-emerald-400';
    discreetLabel.textContent = 'Bro Mode';
    discreetBanner.classList.add('hidden');
  }
}

function renderHeroCard() {
  const trip = state.activeTrip;
  if (!trip) return;

  const totalHome = (trip.expenses || []).reduce((sum, exp) => {
    let converted = exp.convertedAmount;
    if (converted === undefined || converted === null) {
      const expCur = exp.currency || trip.baseCurrency;
      if (expCur === trip.homeCurrency) converted = exp.amount;
      else if (expCur === trip.baseCurrency) converted = exp.amount * (trip.forexRate || 1);
      else converted = exp.amount * (DEFAULT_FOREX_RATES_TO_INR[expCur] || 1);
    }
    return sum + Number(converted);
  }, 0);

  const totalPrimary = (trip.baseCurrency === trip.homeCurrency || !trip.forexRate || trip.forexRate <= 0)
    ? totalHome
    : (totalHome / trip.forexRate);

  const heroTotalTripSpend = document.getElementById('heroTotalTripSpend');
  if (heroTotalTripSpend) heroTotalTripSpend.textContent = formatCurrency(totalPrimary, trip.baseCurrency);
  
  const heroTripCurrencyCode = document.getElementById('heroTripCurrencyCode');
  if (heroTripCurrencyCode) heroTripCurrencyCode.textContent = trip.baseCurrency;

  const heroTotalHomeSpend = document.getElementById('heroTotalHomeSpend');
  if (heroTotalHomeSpend) heroTotalHomeSpend.textContent = formatCurrency(totalHome, trip.homeCurrency);

  // Atmosphere badge
  const activeThemeKey = trip.theme || detectThemeFromTrip(trip);
  const themeInfo = DESTINATION_THEMES[activeThemeKey] || DESTINATION_THEMES.tropical;
  const atmosphereText = document.getElementById('heroTripAtmosphereText');
  if (atmosphereText) atmosphereText.textContent = themeInfo.badge || themeInfo.name;

  // Ensure scenic artwork is loaded in hero card
  const scenicContainer = document.getElementById('heroScenicArtContainer');
  if (scenicContainer && (!scenicContainer.innerHTML.trim() || scenicContainer.getAttribute('data-loaded-theme') !== activeThemeKey)) {
    if (DESTINATION_GRAPHICS[activeThemeKey]) {
      scenicContainer.innerHTML = DESTINATION_GRAPHICS[activeThemeKey];
      scenicContainer.setAttribute('data-loaded-theme', activeThemeKey);
      scenicContainer.style.opacity = '0.48';
    }
  }

  // Per-person average & total spends count
  const memberCount = (trip.members || []).length;
  const avgPerPerson = memberCount > 0 ? (totalHome / memberCount) : 0;
  const avgEl = document.getElementById('heroAvgPerPerson');
  if (avgEl) avgEl.textContent = formatCurrency(avgPerPerson, trip.homeCurrency);

  const billsCount = (trip.expenses || []).length;
  const billsEl = document.getElementById('heroTotalBillsCount');
  if (billsEl) billsEl.textContent = `${billsCount} Spends`;
  const billsElMobile = document.getElementById('heroTotalBillsCountMobile');
  if (billsElMobile) billsElMobile.textContent = `${billsCount} Spends`;

  // Forex rate pill
  const heroForexRateText = document.getElementById('heroForexRateText');
  if (heroForexRateText) {
    heroForexRateText.textContent = `1 ${trip.baseCurrency} = ${trip.homeCurrencySymbol}${Number(trip.forexRate || 1).toFixed(2)}`;
  }
  const forexBaseCode = document.getElementById('forexBaseCode');
  if (forexBaseCode) forexBaseCode.textContent = trip.baseCurrency;
  const forexTargetCode = document.getElementById('forexTargetCode');
  if (forexTargetCode) forexTargetCode.textContent = trip.homeCurrency;

  // Current user's net balance
  const savedUserName = (localStorage.getItem('tb_user_name') || '').toLowerCase();
  const myMember = (trip.myMemberId ? trip.members.find(m => m.id === trip.myMemberId) : null) 
    || (savedUserName ? trip.members.find(m => m.name.toLowerCase() === savedUserName) : null)
    || trip.members[0] 
    || { name: 'Me' };
  const avatarCircle = document.getElementById('myAvatarCircle');
  if (avatarCircle) avatarCircle.textContent = myMember.name.charAt(0);
  
  const balances = calculateNetBalances(trip);
  const myNet = balances[myMember.id] || 0;
  const myBalanceEl = document.getElementById('heroMyBalanceText');

  if (myBalanceEl) {
    if (myNet > 0.01) {
      myBalanceEl.textContent = `+${formatCurrency(myNet, trip.homeCurrency)} (You get back)`;
      myBalanceEl.className = 'font-bold font-mono-num text-emerald-400';
    } else if (myNet < -0.01) {
      myBalanceEl.textContent = `${formatCurrency(myNet, trip.homeCurrency)} (You owe)`;
      myBalanceEl.className = 'font-bold font-mono-num text-rose-400';
    } else {
      myBalanceEl.textContent = `All Settled (Barabar)`;
      myBalanceEl.className = 'font-bold font-mono-num text-slate-300';
    }
  }
}

// Global active member filter
let selectedMemberFilter = null;

function renderFriendsBreakdown() {
  const trip = state.activeTrip;
  const container = document.getElementById('friendsBreakdownCarousel');
  const countBadge = document.getElementById('memberBreakdownCount');
  const clearBtn = document.getElementById('btnClearMemberFilter');
  if (!trip || !container) return;

  if (countBadge) countBadge.textContent = trip.members.length;
  if (clearBtn) {
    if (selectedMemberFilter) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  const netBalances = calculateNetBalances(trip);
  const isAllActive = !selectedMemberFilter;
  const savedUserName = (localStorage.getItem('tb_user_name') || '').toLowerCase();
  const myId = (trip.myMemberId ? trip.members.find(m => m.id === trip.myMemberId)?.id : null) 
    || (savedUserName ? trip.members.find(m => m.name.toLowerCase() === savedUserName)?.id : null)
    || trip.members[0]?.id;

  // 1. "All Friends" Chip
  let html = `
    <button type="button" onclick="clearMemberFilter()" 
      class="member-chip shrink-0 ${isAllActive ? 'active' : ''}" 
      title="Show expenses for all ${trip.members.length} friends">
      <span class="w-6 h-6 rounded-full bg-slate-800 text-brand-300 flex items-center justify-center font-bold text-[10px] border border-slate-700">
        <i class="fa-solid fa-users text-[9px]"></i>
      </span>
      <span class="text-[11px] font-bold text-white">All</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono-num font-semibold">${trip.members.length}</span>
    </button>
  `;

  // 2. Individual Member Chips (Scales 2 to 25+ friends)
  trip.members.forEach(m => {
    const net = Math.round(netBalances[m.id] || 0);
    const isSelected = selectedMemberFilter === m.id;
    const isYou = m.id === myId;

    let balancePill = '';
    if (net > 5) {
      const displayAmt = net >= 1000 ? `+₹${(net / 1000).toFixed(1)}k` : `+₹${net}`;
      balancePill = `<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">${displayAmt}</span>`;
    } else if (net < -5) {
      const absNet = Math.abs(net);
      const displayAmt = absNet >= 1000 ? `-₹${(absNet / 1000).toFixed(1)}k` : `-₹${absNet}`;
      balancePill = `<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">${displayAmt}</span>`;
    } else {
      balancePill = `<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-medium">Barabar</span>`;
    }

    html += `
      <button type="button" onclick="toggleMemberFilter('${m.id}')" 
        class="member-chip shrink-0 ${isSelected ? 'active' : ''} ${isYou ? 'border-brand-500/40 bg-brand-500/5' : ''}" 
        title="Tap to filter expenses by ${escapeHtml(m.name)}${isYou ? ' (You)' : ''}">
        <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-sm shrink-0 border border-white/20" style="background: ${m.color || '#0D9488'};">
          ${escapeHtml(m.name.charAt(0))}
        </span>
        <span class="text-[11px] font-bold text-white truncate max-w-[85px] sm:max-w-[110px]">
          ${escapeHtml(m.name)}${isYou ? ' <span class="text-[9px] text-brand-400 font-semibold">(You)</span>' : ''}
        </span>
        ${balancePill}
      </button>
    `;
  });

  // 3. "+ Add Friend" Chip at the end
  html += `
    <button type="button" onclick="openAddMemberModal()" 
      class="member-chip-add shrink-0" 
      title="Add friend or paste 25+ friends">
      <i class="fa-solid fa-plus text-[10px] text-brand-400"></i>
      <span class="text-[11px] font-bold text-brand-300">Add Friend</span>
    </button>
  `;

  container.innerHTML = html;
}

function toggleMemberFilter(memberId) {
  if (selectedMemberFilter === memberId) {
    selectedMemberFilter = null;
  } else {
    selectedMemberFilter = memberId;
  }
  renderFriendsBreakdown();
  renderExpensesList();
}

function clearMemberFilter() {
  selectedMemberFilter = null;
  renderFriendsBreakdown();
  renderExpensesList();
}

function renderCategoryFilterChips() {
  const container = document.getElementById('categoryFilterChips');
  if (!container) return;

  const allCats = [{ id: 'all', emoji: '✨', name: 'All' }, ...DEFAULT_CATEGORIES];

  container.innerHTML = allCats.map(cat => {
    const isSelected = state.selectedFilterCategory === cat.id;
    let label = cat.name;
    let icon = cat.emoji;

    if (state.discreetMode && cat.id !== 'all') {
      const info = getCategoryInfo(cat.id);
      label = info.displayName;
      icon = info.displayEmoji;
    }

    return `
      <button onclick="setFilterCategory('${cat.id}')"
        class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active-press ${
          isSelected
            ? 'bg-brand-500/20 text-brand-300 border-brand-500 shadow-sm'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
        }">
        <span>${icon}</span>
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');
}

function renderExpensesList() {
  const trip = state.activeTrip;
  const container = document.getElementById('expenseListContainer');
  const countBadge = document.getElementById('expenseCountBadge');
  if (!trip || !container) return;

  let list = [...(trip.expenses || [])];

  // Filter by category
  if (state.selectedFilterCategory !== 'all') {
    list = list.filter(e => e.categoryId === state.selectedFilterCategory);
  }

  // Filter by selected friend if active
  if (selectedMemberFilter) {
    list = list.filter(e => {
      const isPayer = Array.isArray(e.paidBy)
        ? e.paidBy.some(p => p.memberId === selectedMemberFilter)
        : e.paidBy === selectedMemberFilter;
      const isConsumer = (e.sharedWith || []).includes(selectedMemberFilter);
      return isPayer || isConsumer;
    });
  }

  // Filter by search query
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(q));
  }

  // Sort by date descending
  list.sort((a, b) => b.createdAt - a.createdAt);

  countBadge.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 text-center space-y-3.5 my-2">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-amber-500/20 text-brand-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
          ✈️
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-white">Your Trip Ledger is Clean & Ready</h4>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">No expenses recorded yet. Tap below to log your first spend, or invite your friends to start splitting together.</p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button onclick="openAddExpenseModal()" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 active-press shadow-lg shadow-brand-500/20 transition-all">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>+ Add First Expense</span>
          </button>
          <button onclick="openInviteFriendsModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs inline-flex items-center gap-2 active-press border border-slate-700 transition-all">
            <i class="fa-solid fa-user-plus text-emerald-400 text-xs"></i>
            <span>Invite Friends</span>
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(exp => {
    const cat = getCategoryInfo(exp.categoryId);
    const expCur = exp.currency || trip.baseCurrency;
    let convertedHome = exp.convertedAmount;
    if (convertedHome === undefined || convertedHome === null) {
      if (expCur === trip.homeCurrency) convertedHome = exp.amount;
      else if (expCur === trip.baseCurrency) convertedHome = exp.amount * (trip.forexRate || 1);
      else convertedHome = exp.amount * (DEFAULT_FOREX_RATES_TO_INR[expCur] || 1);
    }
    const isHomeCurrency = (expCur === trip.homeCurrency);
    
    // Who paid label
    let paidByText = '';
    if (Array.isArray(exp.paidBy) && exp.paidBy.length > 1) {
      paidByText = `Paid by ${exp.paidBy.length} members`;
    } else {
      const payerId = Array.isArray(exp.paidBy) ? exp.paidBy[0]?.memberId : exp.paidBy;
      const payer = trip.members.find(m => m.id === payerId);
      paidByText = `Paid by ${payer ? payer.name : 'Unknown'}`;
    }

    // Shared with label ("3 of 9 members")
    const sharedCount = (exp.sharedWith || []).length;
    const totalMembers = trip.members.length;
    const isSubset = sharedCount < totalMembers;
    const sharedBadge = isSubset 
      ? `<span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/25">${sharedCount} of ${totalMembers}</span>`
      : `<span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">All ${totalMembers}</span>`;

    const hasReceipt = Boolean(exp.receipt);
    const reactions = exp.reactions || { '🔥': 0, '🍻': 0, '💀': 0, '💸': 0 };
    const isReacted = (k) => localStorage.getItem(`tb_reaction_${exp.id}_${k}`) === 'true';

    return `
      <div class="glass-card rounded-2xl p-3.5 border border-slate-800/90 shadow-sm space-y-2 hover:border-slate-700 transition-all">
        <div class="flex items-center justify-between gap-3">
          <!-- Category Icon & Details -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style="background: ${cat.color}20; border: 1px solid ${cat.color}40;">
              ${cat.displayEmoji}
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-white truncate">${escapeHtml(exp.title)}</h4>
              <div class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span class="text-brand-400 font-medium">${paidByText}</span>
                <span>•</span>
                ${sharedBadge}
                ${hasReceipt ? '<i class="fa-solid fa-paperclip text-[10px] text-emerald-400" title="Receipt attached"></i>' : ''}
              </div>
            </div>
          </div>

          <!-- Amounts & Quick Actions -->
          <div class="text-right shrink-0">
            <div class="text-sm font-extrabold text-white font-mono-num">
              ${formatCurrency(exp.amount, expCur)}
            </div>
            ${isHomeCurrency ? `
              <div class="text-[10px] font-semibold text-emerald-400 font-mono-num flex items-center justify-end gap-1">
                <span>🇮🇳</span><span>Home Spend</span>
              </div>
            ` : `
              <div class="text-[11px] font-semibold text-amber-400 font-mono-num">
                ≈ ${formatCurrency(convertedHome, trip.homeCurrency)}
              </div>
            `}
            <!-- Edit / Delete Buttons -->
            <div class="flex items-center justify-end gap-2 mt-1">
              <button onclick="editExpense('${exp.id}')" class="text-[10px] text-slate-400 hover:text-brand-300" title="Edit">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button onclick="deleteExpense('${exp.id}')" class="text-[10px] text-slate-500 hover:text-red-400" title="Delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Micro-Reactions Pill Bar -->
        <div class="flex items-center gap-1.5 pt-1.5 border-t border-slate-800/60 flex-wrap">
          <button onclick="toggleExpenseReaction('${exp.id}', '🔥')" class="reaction-pill ${isReacted('🔥') ? 'active' : ''}" title="Lit!">
            <span>🔥</span><span class="text-[10px] font-bold">${reactions['🔥'] || 0}</span>
          </button>
          <button onclick="toggleExpenseReaction('${exp.id}', '🍻')" class="reaction-pill ${isReacted('🍻') ? 'active' : ''}" title="Cheers!">
            <span>🍻</span><span class="text-[10px] font-bold">${reactions['🍻'] || 0}</span>
          </button>
          <button onclick="toggleExpenseReaction('${exp.id}', '💀')" class="reaction-pill ${isReacted('💀') ? 'active' : ''}" title="Ded!">
            <span>💀</span><span class="text-[10px] font-bold">${reactions['💀'] || 0}</span>
          </button>
          <button onclick="toggleExpenseReaction('${exp.id}', '💸')" class="reaction-pill ${isReacted('💸') ? 'active' : ''}" title="Loot / Big Spender!">
            <span>💸</span><span class="text-[10px] font-bold">${reactions['💸'] || 0}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== DEBT SIMPLIFICATION & SETTLEMENT ENGINE ====================
/**
 * Calculates net balance for every member in the trip (in Home Currency):
 * Net = Total Amount Paid - Total Amount Consumed + Direct Settlements
 */
function calculateNetBalances(trip) {
  const netBalances = {};
  trip.members.forEach(m => { netBalances[m.id] = 0; });

  (trip.expenses || []).forEach(exp => {
    const totalHome = Number(exp.convertedAmount) || (Number(exp.amount) * (trip.forexRate || 1));

    // 1. Credit the payers
    if (Array.isArray(exp.paidBy)) {
      exp.paidBy.forEach(p => {
        const ratio = Number(p.amount) / Number(exp.amount);
        const homePaid = totalHome * ratio;
        if (netBalances[p.memberId] !== undefined) {
          netBalances[p.memberId] += homePaid;
        }
      });
    } else if (netBalances[exp.paidBy] !== undefined) {
      netBalances[exp.paidBy] += totalHome;
    }

    // 2. Debit the consumers based on split mode
    const sharedMembers = exp.sharedWith || [];
    if (sharedMembers.length > 0) {
      if (exp.splitMode === 'exact' && exp.exactSplits) {
        Object.entries(exp.exactSplits).forEach(([mId, amt]) => {
          const ratio = Number(amt) / Number(exp.amount);
          const homeConsumed = totalHome * ratio;
          if (netBalances[mId] !== undefined) {
            netBalances[mId] -= homeConsumed;
          }
        });
      } else if (exp.splitMode === 'percentage' && exp.percentages) {
        Object.entries(exp.percentages).forEach(([mId, pct]) => {
          const ratio = (Number(pct) || 0) / 100;
          const homeConsumed = totalHome * ratio;
          if (netBalances[mId] !== undefined) {
            netBalances[mId] -= homeConsumed;
          }
        });
      } else if (exp.splitMode === 'shares' && exp.shares) {
        const totalShares = sharedMembers.reduce((sum, id) => sum + (Number(exp.shares[id]) || 1), 0);
        sharedMembers.forEach(mId => {
          const shareWeight = Number(exp.shares[mId]) || 1;
          const homeConsumed = totalHome * (shareWeight / (totalShares || 1));
          if (netBalances[mId] !== undefined) {
            netBalances[mId] -= homeConsumed;
          }
        });
      } else {
        // Equal split among selected members
        const perPersonHome = totalHome / sharedMembers.length;
        sharedMembers.forEach(mId => {
          if (netBalances[mId] !== undefined) {
            netBalances[mId] -= perPersonHome;
          }
        });
      }
    }
  });

  // 3. Apply direct recorded settlements
  (trip.settlements || []).forEach(s => {
    const amt = Number(s.amount);
    if (netBalances[s.fromMemberId] !== undefined) netBalances[s.fromMemberId] += amt;
    if (netBalances[s.toMemberId] !== undefined) netBalances[s.toMemberId] -= amt;
  });

  return netBalances;
}

/**
 * Greedy Min-Cash-Flow Debt Simplification Algorithm
 * Reduces 25+ cross-payments down to 3-4 clean transfers
 */
function calculateOptimalSettlements(trip) {
  const netBalances = calculateNetBalances(trip);
  const debtors = [];  // People who owe money (net < 0)
  const creditors = []; // People who get money back (net > 0)

  Object.entries(netBalances).forEach(([mId, net]) => {
    const rounded = Math.round(net * 100) / 100;
    if (rounded < -0.05) {
      debtors.push({ id: mId, amount: Math.abs(rounded) });
    } else if (rounded > 0.05) {
      creditors.push({ id: mId, amount: rounded });
    }
  });

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const transferAmt = Math.min(debtor.amount, creditor.amount);
    const roundedTransfer = Math.round(transferAmt * 100) / 100;

    if (roundedTransfer > 0.05) {
      transfers.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: roundedTransfer
      });
    }

    debtor.amount -= transferAmt;
    creditor.amount -= transferAmt;

    if (debtor.amount < 0.05) dIndex++;
    if (creditor.amount < 0.05) cIndex++;
  }

  return transfers;
}

function renderSettleUpTab() {
  const trip = state.activeTrip;
  const transfersContainer = document.getElementById('settlementTransfersContainer');
  const balancesContainer = document.getElementById('memberBalancesContainer');
  if (!trip || !transfersContainer || !balancesContainer) return;

  const netBalances = calculateNetBalances(trip);
  const transfers = calculateOptimalSettlements(trip);

  // 1. Render Minimal Settlements
  if (transfers.length === 0) {
    transfersContainer.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
        <i class="fa-solid fa-circle-check text-emerald-400 text-base mb-1 block"></i>
        <span><strong>Sabka Hisaab Barabar!</strong> All debts are currently settled.</span>
      </div>
    `;
  } else {
    transfersContainer.innerHTML = transfers.map(t => {
      const fromMember = trip.members.find(m => m.id === t.fromId) || { name: 'Friend', upi: '' };
      const toMember = trip.members.find(m => m.id === t.toId) || { name: 'Friend', upi: '' };
      
      // UPI Intent deep-link for instant mobile payment
      const upiUrl = `upi://pay?pa=${encodeURIComponent(toMember.upi || 'payment@upi')}&pn=${encodeURIComponent(toMember.name)}&am=${t.amount.toFixed(2)}&tn=${encodeURIComponent(`TripBarabar-${trip.name}`)}&cu=INR`;

      return `
        <div class="glass-card rounded-2xl p-3.5 border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold text-red-300">${escapeHtml(fromMember.name)}</span>
              <span class="text-slate-500 font-mono">➔</span>
              <span class="font-bold text-emerald-300">${escapeHtml(toMember.name)}</span>
            </div>
            <div class="text-sm font-black text-amber-400 font-mono-num">
              ₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div class="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 flex-wrap">
            <!-- 1-Tap UPI Settle Button with bilateral handshake hook -->
            <button onclick="handleUpiPayClick('${t.fromId}', '${t.toId}', ${t.amount}, '${upiUrl}')" class="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold text-center active-press flex items-center justify-center gap-1 hover:bg-emerald-500/30">
              <i class="fa-solid fa-bolt text-xs"></i>
              <span>Pay UPI</span>
            </button>
            <!-- Bilateral I Have Paid button -->
            <button onclick="recordPendingUpiSettlement('${t.fromId}', '${t.toId}', ${t.amount})" class="py-1.5 px-2 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold active-press" title="Mark as paid via UPI for receiver to confirm">
              I Paid
            </button>
            <!-- Friendly Nudge button -->
            <button onclick="openNudgeModal('${t.fromId}', '${t.toId}', ${t.amount})" class="py-1.5 px-2 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/30 text-[11px] font-bold active-press flex items-center gap-1 hover:border-purple-400" title="Send WhatsApp payment reminder">
              <i class="fa-brands fa-whatsapp text-emerald-400"></i>
              <span>Nudge</span>
            </button>
            <!-- Mark as Paid manually button -->
            <button onclick="quickSettle('${t.fromId}', '${t.toId}', ${t.amount})" class="py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold active-press" title="Record direct cash settlement">
              Direct Clear
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Render Member Net Balances
  balancesContainer.innerHTML = trip.members.map(m => {
    const net = Math.round((netBalances[m.id] || 0) * 100) / 100;
    const isPositive = net > 0.05;
    const isNegative = net < -0.05;

    let badgeClass = 'text-slate-400 bg-slate-800/70 border-slate-700';
    let label = 'Barabar';

    if (isPositive) {
      badgeClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      label = `Gets back +₹${net.toFixed(2)}`;
    } else if (isNegative) {
      badgeClass = 'text-red-400 bg-red-950/60 border-red-500/30';
      label = `Owes ₹${Math.abs(net).toFixed(2)}`;
    }

    return `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style="background: ${m.color || '#0D9488'};">
            ${m.name.charAt(0)}
          </div>
          <div>
            <div class="text-xs font-bold text-white">${escapeHtml(m.name)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.upi || 'No UPI added')}</div>
          </div>
        </div>
        <div class="text-xs font-extrabold px-2.5 py-1 rounded-lg border ${badgeClass}">
          ${label}
        </div>
      </div>
    `;
  }).join('');
}

function quickSettle(fromId, toId, amount) {
  const fromMember = state.activeTrip.members.find(m => m.id === fromId);
  const toMember = state.activeTrip.members.find(m => m.id === toId);

  const settlement = {
    id: 'settle-' + Date.now(),
    fromMemberId: fromId,
    toMemberId: toId,
    amount: Number(amount),
    note: `Quick settlement between ${fromMember?.name} and ${toMember?.name}`,
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };

  if (!state.activeTrip.settlements) state.activeTrip.settlements = [];
  state.activeTrip.settlements.push(settlement);
  saveTripsToStorage();
  renderAll();
  fireConfetti();
  showToast(`✓ Settled ₹${amount} between ${fromMember?.name} and ${toMember?.name}!`);
}

// ==================== ANALYTICS & INSIGHTS TAB ====================
function renderAnalyticsTab() {
  const trip = state.activeTrip;
  const catListContainer = document.getElementById('analyticsCategoryList');
  const leaderboardContainer = document.getElementById('analyticsMemberLeaderboard');
  const catCountEl = document.getElementById('analyticsCategoryCount');
  if (!trip || !catListContainer || !leaderboardContainer) return;

  const totalSpend = (trip.expenses || []).reduce((sum, exp) => {
    return sum + (exp.convertedAmount || (exp.amount * (trip.forexRate || 1)));
  }, 0);

  // Group by category
  const catTotals = {};
  (trip.expenses || []).forEach(exp => {
    const homeVal = exp.convertedAmount || (exp.amount * (trip.forexRate || 1));
    catTotals[exp.categoryId] = (catTotals[exp.categoryId] || 0) + homeVal;
  });

  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  catCountEl.textContent = `${sortedCats.length} Categories`;

  if (sortedCats.length === 0) {
    catListContainer.innerHTML = '<div class="text-xs text-slate-500 text-center py-4">No spending data yet</div>';
  } else {
    catListContainer.innerHTML = sortedCats.map(([catId, amt]) => {
      const cat = getCategoryInfo(catId);
      const percentage = totalSpend > 0 ? Math.round((amt / totalSpend) * 100) : 0;

      return `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5 text-slate-300 font-semibold">
              <span>${cat.displayEmoji}</span>
              <span>${escapeHtml(cat.displayName)}</span>
            </span>
            <span class="font-mono-num font-bold text-white">₹${amt.toFixed(0)} (${percentage}%)</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" style="width: ${percentage}%; background: ${cat.color || '#0D9488'};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Member Leaderboard: Who paid the most
  const memberPaid = {};
  trip.members.forEach(m => { memberPaid[m.id] = 0; });

  (trip.expenses || []).forEach(exp => {
    const homeVal = exp.convertedAmount || (exp.amount * (trip.forexRate || 1));
    if (Array.isArray(exp.paidBy)) {
      exp.paidBy.forEach(p => {
        const ratio = Number(p.amount) / Number(exp.amount);
        memberPaid[p.memberId] = (memberPaid[p.memberId] || 0) + (homeVal * ratio);
      });
    } else {
      memberPaid[exp.paidBy] = (memberPaid[exp.paidBy] || 0) + homeVal;
    }
  });

  const sortedMembers = Object.entries(memberPaid).sort((a, b) => b[1] - a[1]);

  leaderboardContainer.innerHTML = sortedMembers.map(([mId, amt], index) => {
    const member = trip.members.find(m => m.id === mId) || { name: 'Friend' };
    const percentage = totalSpend > 0 ? Math.round((amt / totalSpend) * 100) : 0;
    const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

    return `
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-6 text-center font-bold text-amber-400">${rankEmoji}</span>
          <span class="font-bold text-white">${escapeHtml(member.name)}</span>
        </div>
        <div class="font-mono-num text-right">
          <span class="font-bold text-white">₹${amt.toFixed(0)}</span>
          <span class="text-[10px] text-slate-500 block">${percentage}% of trip</span>
        </div>
      </div>
    `;
  }).join('');

  // Also render trip awards
  renderTripAwards();
}

// ==================== 🏆 TRIP HALL OF FAME & AWARDS ====================
function renderTripAwards() {
  const trip = state.activeTrip;
  const container = document.getElementById('tripAwardsContainer');
  if (!trip || !container) return;

  if (!trip.expenses || trip.expenses.length === 0) {
    container.innerHTML = '<div class="col-span-2 text-xs text-slate-500 text-center py-2">Add expenses to unlock trip awards!</div>';
    return;
  }

  const memberPaid = {};
  const memberFood = {};
  const memberNightlife = {};
  const memberCabs = {};

  trip.members.forEach(m => {
    memberPaid[m.id] = 0;
    memberFood[m.id] = 0;
    memberNightlife[m.id] = 0;
    memberCabs[m.id] = 0;
  });

  trip.expenses.forEach(exp => {
    const homeVal = exp.convertedAmount || (exp.amount * (trip.forexRate || 1));
    const payerId = Array.isArray(exp.paidBy) ? exp.paidBy[0]?.memberId : exp.paidBy;

    if (payerId && memberPaid[payerId] !== undefined) {
      memberPaid[payerId] += homeVal;

      if (exp.categoryId === 'food') {
        memberFood[payerId] += homeVal;
      } else if (['lapdance', 'adult', 'oral', 'ladydrinks', 'drinks'].includes(exp.categoryId)) {
        memberNightlife[payerId] += homeVal;
      } else if (exp.categoryId === 'cabs') {
        memberCabs[payerId] += homeVal;
      }
    }
  });

  const getTop = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
  const topBanker = getTop(memberPaid);
  const topFoodie = getTop(memberFood);
  const topNightlife = getTop(memberNightlife);
  const luckyGuy = Object.entries(memberPaid).sort((a, b) => a[1] - b[1])[0];

  const bankerName = trip.members.find(m => m.id === topBanker?.[0])?.name || 'Nobody';
  const foodieName = trip.members.find(m => m.id === topFoodie?.[0])?.name || 'Nobody';
  const nightlifeName = trip.members.find(m => m.id === topNightlife?.[0])?.name || 'Nobody';
  const luckyName = trip.members.find(m => m.id === luckyGuy?.[0])?.name || 'Nobody';

  container.innerHTML = `
    <!-- Award 1: Trip Banker -->
    <div class="award-card space-y-1">
      <div class="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px]">
        <span>👑</span>
        <span>The Trip Banker</span>
      </div>
      <div class="text-xs font-bold text-white truncate">${escapeHtml(bankerName)}</div>
      <div class="text-[10px] text-slate-400 font-mono-num">Funded ₹${(topBanker?.[1] || 0).toFixed(0)}</div>
    </div>

    <!-- Award 2: Foodie King -->
    <div class="award-card space-y-1">
      <div class="flex items-center gap-1.5 text-orange-400 font-extrabold text-[11px]">
        <span>🦞</span>
        <span>The Feast Master</span>
      </div>
      <div class="text-xs font-bold text-white truncate">${escapeHtml(foodieName)}</div>
      <div class="text-[10px] text-slate-400 font-mono-num">Treated ₹${(topFoodie?.[1] || 0).toFixed(0)} feast</div>
    </div>

    <!-- Award 3: Nightlife VIP -->
    <div class="award-card space-y-1">
      <div class="flex items-center gap-1.5 text-pink-400 font-extrabold text-[11px]">
        <span>🍾</span>
        <span>Nightlife Legend</span>
      </div>
      <div class="text-xs font-bold text-white truncate">${escapeHtml(nightlifeName)}</div>
      <div class="text-[10px] text-slate-400 font-mono-num">Fueled ₹${(topNightlife?.[1] || 0).toFixed(0)} party</div>
    </div>

    <!-- Award 4: The Lucky Guy -->
    <div class="award-card space-y-1">
      <div class="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px]">
        <span>🦥</span>
        <span>The Free Rider</span>
      </div>
      <div class="text-xs font-bold text-white truncate">${escapeHtml(luckyName)}</div>
      <div class="text-[10px] text-slate-400 font-mono-num">Enjoyed most with least cash!</div>
    </div>
  `;
}

// ==================== 🎲 WHO PAYS NEXT? BILL ROULETTE & MINI-STAKES ====================
let rouletteWinner = null;
let isSpinningRoulette = false;
let currentRouletteMode = 'bill'; // 'bill', 'drinks', 'seat', 'dare'

const TRAVEL_DARES = [
  "Order your next drink or food in a fake foreign accent! 🗣️",
  "Take a selfie with a total stranger and post to the group! 📸",
  "Do 10 jumping jacks or pushups right now with full enthusiasm! 💪",
  "Sing the chorus of a 90s Bollywood song out loud! 🎵",
  "You are designated group photographer for the next 2 hours! 📷",
  "You must address everyone as 'Sir / Madam' for the next hour! 🎩",
  "Tell your most embarrassing travel story to the group right now! 😂",
  "Compliment 3 strangers genuinely within the next 30 minutes! 🌟"
];

function setRouletteGameMode(mode) {
  currentRouletteMode = mode;
  ['bill', 'drinks', 'seat', 'dare'].forEach(m => {
    const btn = document.getElementById(`btnRouletteMode-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = 'py-1.5 px-2 rounded-lg bg-amber-500 text-slate-950 font-bold';
      } else {
        btn.className = 'py-1.5 px-2 rounded-lg text-slate-400 hover:text-white font-bold';
      }
    }
  });

  const subtitle = document.getElementById('rouletteSubtitle');
  if (subtitle) {
    if (mode === 'bill') subtitle.textContent = 'Spin to pick who pays this bill!';
    else if (mode === 'drinks') subtitle.textContent = 'Spin to see who sponsors the next round! 🍹';
    else if (mode === 'seat') subtitle.textContent = 'Spin for the dreaded cab middle seat! 🚗';
    else if (mode === 'dare') subtitle.textContent = 'Spin to assign a funny travel dare! 🎭';
  }
}

function openBillRouletteModal() {
  const trip = state.activeTrip;
  if (!trip || !trip.members || trip.members.length === 0) return;

  rouletteWinner = null;
  setRouletteGameMode('bill');
  document.getElementById('rouletteAvatar').textContent = '?';
  document.getElementById('rouletteAvatar').style.background = '#0D9488';
  document.getElementById('rouletteName').textContent = 'Ready to Spin?';
  document.getElementById('btnSpinRoulette').classList.remove('hidden');
  document.getElementById('btnRouletteAction').classList.add('hidden');

  openModal('modalBillRoulette');
}

function spinBillRoulette() {
  const trip = state.activeTrip;
  if (!trip || isSpinningRoulette) return;

  isSpinningRoulette = true;
  const btn = document.getElementById('btnSpinRoulette');
  btn.disabled = true;
  btn.classList.add('opacity-50');

  const avatar = document.getElementById('rouletteAvatar');
  const nameEl = document.getElementById('rouletteName');
  const subtitleEl = document.getElementById('rouletteSubtitle');
  avatar.classList.add('roulette-spin');

  let speed = 50;
  let counter = 0;
  const totalSteps = 24 + Math.floor(Math.random() * 12);
  const members = trip.members;

  function step() {
    counter++;
    const currentMember = members[counter % members.length];
    avatar.textContent = currentMember.name.charAt(0);
    avatar.style.background = currentMember.color || '#0D9488';
    nameEl.textContent = currentMember.name;
    subtitleEl.textContent = 'Spinning... 🎲';

    if (navigator.vibrate) navigator.vibrate(15);
    SoundEffects.playPop();

    if (counter < totalSteps) {
      speed += 14;
      setTimeout(step, speed);
    } else {
      isSpinningRoulette = false;
      btn.disabled = false;
      btn.classList.remove('opacity-50');
      avatar.classList.remove('roulette-spin');

      rouletteWinner = currentMember;

      if (currentRouletteMode === 'bill') {
        nameEl.textContent = `👑 ${currentMember.name.toUpperCase()} PAYS!`;
        subtitleEl.textContent = 'The wheel has spoken. No excuses, bro! 🍻';
        document.getElementById('btnRouletteAction').classList.remove('hidden');
        document.getElementById('btnRouletteActionText').textContent = `Log Bill with ${currentMember.name} as Payer`;
      } else if (currentRouletteMode === 'drinks') {
        nameEl.textContent = `🍹 ROUND ON ${currentMember.name.toUpperCase()}!`;
        subtitleEl.textContent = 'Bar rules: Winner buys everyone drinks! 🥂';
        document.getElementById('btnRouletteAction').classList.remove('hidden');
        document.getElementById('btnRouletteActionText').textContent = `Log Drinks Round with ${currentMember.name}`;
      } else if (currentRouletteMode === 'seat') {
        nameEl.textContent = `🚗 ${currentMember.name.toUpperCase()} IN MIDDLE SEAT!`;
        subtitleEl.textContent = 'Window seats are taken! Squeeze in tight! 😂';
        document.getElementById('btnRouletteAction').classList.add('hidden');
      } else if (currentRouletteMode === 'dare') {
        const dare = TRAVEL_DARES[Math.floor(Math.random() * TRAVEL_DARES.length)];
        nameEl.textContent = `🎭 DARE FOR ${currentMember.name.toUpperCase()}!`;
        subtitleEl.textContent = dare;
        document.getElementById('btnRouletteAction').classList.add('hidden');
      }

      fireConfetti();
      SoundEffects.playVictory();
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    }
  }

  step();
}

function useRoulettePayer() {
  closeModal('modalBillRoulette');
  if (rouletteWinner) {
    openAddExpenseModal();
    const select = document.getElementById('selectSinglePayer');
    if (select) select.value = rouletteWinner.id;
  }
}

// ==================== 🎉 FULLSCREEN CANVAS CONFETTI ENGINE ====================
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  canvas.classList.remove('hidden');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const pieces = [];
  const colors = ['#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#8B5CF6', '#FBBF24', '#FFFFFF'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 50,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1) * 16 - 4,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.add('hidden');
    }
  }

  cancelAnimationFrame(animationFrame);
  update();
}

// ==================== SETTINGS & TRIP MANAGEMENT TAB ====================
function renderSettingsTab() {
  const trip = state.activeTrip;
  if (!trip) return;

  document.getElementById('settingsTripTitle').textContent = trip.name;
  document.getElementById('settingsTripDescription').textContent = `${trip.destination || ''} • ${trip.dates || ''}`;
  document.getElementById('settingsTripCurrency').textContent = `${trip.baseCurrency} (${trip.currencySymbol || ''})`;
  document.getElementById('settingsHomeCurrency').textContent = `${trip.homeCurrency} (${trip.homeCurrencySymbol || ''})`;
  document.getElementById('settingsForexRateDisplay').textContent = `1 ${trip.baseCurrency} = ${Number(trip.forexRate || 1).toFixed(2)} ${trip.homeCurrency}`;
  document.getElementById('settingsTripCode').textContent = trip.code || 'TRIP26';
  document.getElementById('settingsMemberCount').textContent = trip.members.length;

  const memberListEl = document.getElementById('settingsMemberList');
  if (memberListEl) {
    memberListEl.innerHTML = trip.members.map(m => `
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white" style="background: ${m.color || '#0D9488'};">
            ${m.name.charAt(0)}
          </div>
          <div>
            <div class="font-bold text-white">${escapeHtml(m.name)}</div>
            <div class="text-[10px] text-slate-500 font-mono">${escapeHtml(m.upi || 'No UPI ID')}</div>
          </div>
        </div>
        <button onclick="editMemberModal('${m.id}')" class="text-slate-400 hover:text-brand-400 text-xs px-2 py-1">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>
    `).join('');
  }
}

// ==================== ADD / EDIT EXPENSE MODAL LOGIC ====================
function openAddExpenseModal(editId = null) {
  const trip = state.activeTrip;
  if (!trip) return;

  const form = document.getElementById('formExpense');
  form.reset();
  state.tempReceiptBase64 = null;
  state.isMultiPayer = false;
  state.splitMode = 'equal';

  document.getElementById('expenseEditId').value = editId || '';
  document.getElementById('modalExpenseTitle').textContent = editId ? 'Edit Expense' : 'Add New Expense';
  document.getElementById('btnSaveExpenseText').textContent = editId ? 'Update Expense' : 'Save Expense & Update Balances';
  const initialCur = editId ? (trip.expenses.find(e => e.id === editId)?.currency || trip.baseCurrency) : trip.baseCurrency;
  document.getElementById('selectExpenseCurrency').value = initialCur;
  renderModalCurrencyPills(initialCur);
  document.getElementById('inputExpenseDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('containerReceiptPreview').classList.add('hidden');
  document.getElementById('labelReceiptAttached').textContent = 'Attach Photo';

  // Render Category Grid in Modal
  renderModalCategoryGrid();

  // Render Payers list
  renderModalPayerSection();

  // Render Shared With ("3 out of 9" rule)
  renderModalSplitGrid();

  // If editing an existing expense, populate values
  if (editId) {
    const exp = trip.expenses.find(e => e.id === editId);
    if (exp) {
      document.getElementById('inputExpenseTitle').value = exp.title;
      document.getElementById('inputExpenseAmount').value = exp.amount;
      document.getElementById('selectExpenseCurrency').value = exp.currency || trip.baseCurrency;
      renderModalCurrencyPills(exp.currency || trip.baseCurrency);
      document.getElementById('inputExpenseDate').value = exp.date || new Date().toISOString().split('T')[0];
      
      // Select category
      selectModalCategory(exp.categoryId);

      // Payer
      if (Array.isArray(exp.paidBy) && exp.paidBy.length > 1) {
        toggleMultiPayerMode(true);
        exp.paidBy.forEach(p => {
          const input = document.getElementById(`multiPayerInput_${p.memberId}`);
          if (input) input.value = p.amount;
        });
        updateMultiPayerSum();
      } else {
        const payerId = Array.isArray(exp.paidBy) ? exp.paidBy[0]?.memberId : exp.paidBy;
        document.getElementById('selectSinglePayer').value = payerId;
      }

      // Shared with
      trip.members.forEach(m => {
        const checkbox = document.getElementById(`splitMemberCheckbox_${m.id}`);
        if (checkbox) checkbox.checked = exp.sharedWith.includes(m.id);
      });

      // Split Mode
      setSplitMode(exp.splitMode || 'equal');

      // Receipt
      if (exp.receipt) {
        state.tempReceiptBase64 = exp.receipt;
        document.getElementById('imgReceiptPreview').src = exp.receipt;
        document.getElementById('containerReceiptPreview').classList.remove('hidden');
        document.getElementById('labelReceiptAttached').textContent = 'Change Photo';
      }
    }
  } else {
    // Default select first category
    selectModalCategory('food');
    // Default select all members
    setSplitPreset('all');
  }

  updateModalCurrencyPreview();
  openModal('modalAddExpense');
}

function renderModalCategoryGrid() {
  const container = document.getElementById('modalCategoryGrid');
  if (!container) return;

  const allCats = [...DEFAULT_CATEGORIES, ...(state.activeTrip?.customCategories || [])];

  container.innerHTML = allCats.map(cat => {
    const info = getCategoryInfo(cat.id);
    return `
      <div onclick="selectModalCategory('${cat.id}')" id="catCard_${cat.id}"
        class="cat-card p-2 rounded-xl bg-slate-900 border border-slate-800 text-center cursor-pointer active-press hover:border-slate-700 transition-all flex flex-col items-center">
        <span class="text-xl mb-1">${info.displayEmoji}</span>
        <span class="text-[10px] font-semibold text-slate-300 leading-tight truncate w-full">${escapeHtml(info.displayName)}</span>
      </div>
    `;
  }).join('');
}

let selectedModalCategoryId = 'food';
function selectModalCategory(catId) {
  selectedModalCategoryId = catId;
  document.querySelectorAll('.cat-card').forEach(el => {
    el.classList.remove('border-brand-500', 'bg-brand-500/15', 'shadow-sm');
    el.classList.add('border-slate-800', 'bg-slate-900');
  });

  const target = document.getElementById(`catCard_${catId}`);
  if (target) {
    target.classList.remove('border-slate-800', 'bg-slate-900');
    target.classList.add('border-brand-500', 'bg-brand-500/15', 'shadow-sm');
  }
}

function renderModalPayerSection() {
  const trip = state.activeTrip;
  const singleSelect = document.getElementById('selectSinglePayer');
  const multiInputs = document.getElementById('multiPayerInputsList');
  if (!trip || !singleSelect || !multiInputs) return;

  const savedUserName = (localStorage.getItem('tb_user_name') || '').toLowerCase();
  const myId = (trip.myMemberId ? trip.members.find(m => m.id === trip.myMemberId)?.id : null) 
    || (savedUserName ? trip.members.find(m => m.name.toLowerCase() === savedUserName)?.id : null)
    || trip.members[0]?.id;

  singleSelect.innerHTML = `
    <option value="kitty">💰 Trip Kitty / Common Pool (Treasurer Mode)</option>
  ` + trip.members.map(m => `
    <option value="${m.id}">${escapeHtml(m.name)}${m.id === myId ? ' (You)' : ''}</option>
  `).join('');

  if (myId && singleSelect && !document.getElementById('expenseEditId')?.value) {
    singleSelect.value = myId;
  }

  multiInputs.innerHTML = trip.members.map(m => `
    <div class="flex items-center justify-between gap-2 text-xs">
      <span class="text-slate-300 font-semibold w-24 truncate">${escapeHtml(m.name)}:</span>
      <input type="number" step="any" min="0" id="multiPayerInput_${m.id}" oninput="updateMultiPayerSum()" placeholder="0.00"
        class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs">
    </div>
  `).join('');
}

function toggleMultiPayerMode(forceState = null) {
  state.isMultiPayer = forceState !== null ? forceState : !state.isMultiPayer;
  const singleContainer = document.getElementById('containerSinglePayer');
  const multiContainer = document.getElementById('containerMultiPayer');
  const labelToggle = document.getElementById('labelMultiPayerToggle');

  if (state.isMultiPayer) {
    singleContainer.classList.add('hidden');
    multiContainer.classList.remove('hidden');
    labelToggle.textContent = 'Switch to Single Payer';
  } else {
    singleContainer.classList.remove('hidden');
    multiContainer.classList.add('hidden');
    labelToggle.textContent = 'Switch to Multi-Payer';
  }
}

function updateMultiPayerSum() {
  const trip = state.activeTrip;
  if (!trip) return;

  let sum = 0;
  trip.members.forEach(m => {
    const input = document.getElementById(`multiPayerInput_${m.id}`);
    if (input) sum += Number(input.value) || 0;
  });

  document.getElementById('multiPayerTotalSum').textContent = sum.toFixed(2);
}

function renderModalSplitGrid() {
  const trip = state.activeTrip;
  const grid = document.getElementById('splitMembersGrid');
  if (!trip || !grid) return;

  grid.innerHTML = trip.members.map(m => `
    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
      <label class="flex items-center gap-2 cursor-pointer text-xs">
        <input type="checkbox" id="splitMemberCheckbox_${m.id}" checked onchange="updateSharedSummary()"
          class="w-4 h-4 rounded text-brand-500 bg-slate-800 border-slate-700 focus:ring-0">
        <span class="font-bold text-white">${escapeHtml(m.name)}</span>
      </label>
      
      <!-- Input for exact amounts, percentages or shares (hidden by default) -->
      <div id="splitInputWrap_${m.id}" class="hidden">
        <input type="number" step="any" id="splitAmountInput_${m.id}" placeholder="Exact"
          class="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs font-mono">
      </div>
    </div>
  `).join('');

  updateSharedSummary();
}

function setSplitMode(mode) {
  state.splitMode = mode;
  ['equal', 'exact', 'percentage', 'shares'].forEach(m => {
    const btn = document.getElementById(`btnSplitMode-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = 'py-1.5 rounded-lg bg-brand-500 text-slate-950 font-bold';
      } else {
        btn.className = 'py-1.5 rounded-lg text-slate-400 hover:text-white';
      }
    }
  });

  const trip = state.activeTrip;
  if (!trip) return;

  trip.members.forEach(m => {
    const wrap = document.getElementById(`splitInputWrap_${m.id}`);
    const input = document.getElementById(`splitAmountInput_${m.id}`);
    if (wrap && input) {
      if (mode === 'exact') {
        wrap.classList.remove('hidden');
        input.placeholder = 'Amt ₹/฿';
      } else if (mode === 'percentage') {
        wrap.classList.remove('hidden');
        input.placeholder = '% (e.g. 20)';
      } else if (mode === 'shares') {
        wrap.classList.remove('hidden');
        input.placeholder = 'Shares (1)';
        if (!input.value) input.value = 1;
      } else {
        wrap.classList.add('hidden');
      }
    }
  });
}

function setSplitPreset(preset) {
  const trip = state.activeTrip;
  if (!trip) return;

  if (preset === 'kids') {
    setSplitMode('shares');
    trip.members.forEach((m, idx) => {
      const cb = document.getElementById(`splitMemberCheckbox_${m.id}`);
      const input = document.getElementById(`splitAmountInput_${m.id}`);
      if (cb) cb.checked = true;
      if (input) {
        // Last member counts as kid (0.5x) or prompt
        if (idx === trip.members.length - 1) input.value = 0.5;
        else input.value = 1;
      }
    });
    showToast('👶 Fairness: Set last member as Child (0.5x half-share)');
  } else if (preset === 'couples') {
    setSplitMode('shares');
    trip.members.forEach((m, idx) => {
      const cb = document.getElementById(`splitMemberCheckbox_${m.id}`);
      const input = document.getElementById(`splitAmountInput_${m.id}`);
      if (cb) cb.checked = true;
      if (input) {
        // First member counts as couple (2x)
        if (idx === 0) input.value = 2;
        else input.value = 1;
      }
    });
    showToast('👫 Fairness: Set first member as Couple (2x share)');
  } else {
    trip.members.forEach((m, idx) => {
      const checkbox = document.getElementById(`splitMemberCheckbox_${m.id}`);
      if (!checkbox) return;

      if (preset === 'all') {
        checkbox.checked = true;
      } else if (preset === 'cab3') {
        checkbox.checked = idx < 3; // First 3 members
      } else if (preset === 'drinkers') {
        checkbox.checked = idx < 6; // First 6 members (exclude non-drinkers)
      } else if (preset === 'clear') {
        checkbox.checked = false;
      }
    });
  }

  updateSharedSummary();
}

function updateSharedSummary() {
  const trip = state.activeTrip;
  if (!trip) return;

  let selectedCount = 0;
  trip.members.forEach(m => {
    const cb = document.getElementById(`splitMemberCheckbox_${m.id}`);
    if (cb && cb.checked) selectedCount++;
  });

  document.getElementById('sharedSummaryCount').textContent = `Selected: ${selectedCount} of ${trip.members.length} friends`;
}

// ==================== MULTI-CURRENCY PILLS & CONVERSION PREVIEW ====================
function renderModalCurrencyPills(selectedCur) {
  const container = document.getElementById('expenseCurrencyPillsContainer');
  if (!container) return;

  const trip = state.activeTrip;
  const baseCur = trip?.baseCurrency || 'THB';
  const homeCur = trip?.homeCurrency || 'INR';

  const baseSymbol = CURRENCY_SYMBOLS[baseCur] || baseCur;
  const homeSymbol = CURRENCY_SYMBOLS[homeCur] || '₹';

  const isBaseSelected = selectedCur === baseCur;
  const isHomeSelected = selectedCur === homeCur;

  let pillsHtml = '';

  // 1. Destination currency pill (e.g. ฿ THB)
  pillsHtml += `
    <button type="button" onclick="setExpenseCurrencyQuick('${baseCur}')"
      class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 active-press ${isBaseSelected ? 'bg-amber-500/25 text-amber-300 border-amber-500/80 ring-1 ring-amber-500/50 shadow-sm' : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-slate-600'}">
      <span>${baseSymbol}</span>
      <span>${baseCur}</span>
      <span class="text-[9px] font-normal text-slate-400">(${baseCur === 'THB' ? 'Thailand' : 'Destination'})</span>
    </button>
  `;

  // 2. Home currency pill (e.g. ₹ INR)
  if (homeCur !== baseCur) {
    pillsHtml += `
      <button type="button" onclick="setExpenseCurrencyQuick('${homeCur}')"
        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 active-press ${isHomeSelected ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/80 ring-1 ring-emerald-500/50 shadow-sm' : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-slate-600'}">
        <span>${homeSymbol}</span>
        <span>${homeCur}</span>
        <span class="text-[9px] font-normal text-slate-400">(Airport / Pre-trip)</span>
      </button>
    `;
  }

  // 3. If a 3rd currency is chosen in the dropdown (like USD)
  if (!isBaseSelected && !isHomeSelected && selectedCur) {
    const sym = CURRENCY_SYMBOLS[selectedCur] || selectedCur;
    pillsHtml += `
      <button type="button"
        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 bg-cyan-500/25 text-cyan-300 border-cyan-500/80 ring-1 ring-cyan-500/50 shadow-sm">
        <span>${sym}</span>
        <span>${selectedCur}</span>
        <span class="text-[9px] font-normal text-slate-400">(Selected)</span>
      </button>
    `;
  }

  container.innerHTML = pillsHtml;
}

function setExpenseCurrencyQuick(cur) {
  const sel = document.getElementById('selectExpenseCurrency');
  if (sel) {
    sel.value = cur;
  }
  renderModalCurrencyPills(cur);
  updateModalCurrencyPreview();
}

function handleExpenseCurrencyDropdownChange() {
  const sel = document.getElementById('selectExpenseCurrency');
  const cur = sel ? sel.value : 'THB';
  renderModalCurrencyPills(cur);
  updateModalCurrencyPreview();
}

function updateModalCurrencyPreview() {
  const trip = state.activeTrip;
  if (!trip) return;

  const amt = Number(document.getElementById('inputExpenseAmount').value) || 0;
  const currency = document.getElementById('selectExpenseCurrency').value;

  let converted = amt;
  let rateNote = '';

  if (currency === trip.homeCurrency) {
    converted = amt;
    rateNote = 'Direct Home Currency';
  } else if (currency === trip.baseCurrency) {
    const rate = trip.forexRate || DEFAULT_FOREX_RATES_TO_INR[trip.baseCurrency] || 1;
    converted = amt * rate;
    rateNote = `1 ${currency} = ${formatCurrency(rate, trip.homeCurrency)}`;
  } else {
    const rate = DEFAULT_FOREX_RATES_TO_INR[currency] || 1;
    converted = amt * rate;
    rateNote = `1 ${currency} = ${formatCurrency(rate, trip.homeCurrency)}`;
  }

  const previewEl = document.getElementById('modalConvertedPreview');
  if (previewEl) {
    if (currency === trip.homeCurrency) {
      previewEl.innerHTML = `<span class="text-emerald-400 font-bold">${formatCurrency(converted, trip.homeCurrency)}</span> <span class="text-[10px] text-emerald-500/80 font-normal">(${rateNote})</span>`;
    } else {
      previewEl.innerHTML = `<span class="text-amber-400 font-bold">≈ ${formatCurrency(converted, trip.homeCurrency)}</span> <span class="text-[10px] text-slate-400 font-normal">(${rateNote})</span>`;
    }
  }
}

function handleSaveExpense(event) {
  event.preventDefault();
  const trip = state.activeTrip;
  if (!trip) return;

  const editId = document.getElementById('expenseEditId').value;
  const title = document.getElementById('inputExpenseTitle').value.trim();
  const amount = Number(document.getElementById('inputExpenseAmount').value);
  const currency = document.getElementById('selectExpenseCurrency').value;
  const date = document.getElementById('inputExpenseDate').value;

  if (!title || !amount || amount <= 0) {
    alert('Please enter a valid expense title and amount.');
    return;
  }

  // Determine who paid
  let paidBy = [];
  if (state.isMultiPayer) {
    let multiTotal = 0;
    trip.members.forEach(m => {
      const input = document.getElementById(`multiPayerInput_${m.id}`);
      const val = Number(input?.value) || 0;
      if (val > 0) {
        paidBy.push({ memberId: m.id, amount: val });
        multiTotal += val;
      }
    });

    if (Math.abs(multiTotal - amount) > 0.05) {
      alert(`Multi-payer sum (${multiTotal.toFixed(2)}) must match the total amount (${amount.toFixed(2)}).`);
      return;
    }
  } else {
    const payerId = document.getElementById('selectSinglePayer').value;
    paidBy = [{ memberId: payerId, amount: amount }];
  }

  // Determine shared with and custom splits
  const sharedWith = [];
  const exactSplits = {};
  const percentages = {};
  const shares = {};

  trip.members.forEach(m => {
    const cb = document.getElementById(`splitMemberCheckbox_${m.id}`);
    if (cb && cb.checked) {
      sharedWith.push(m.id);
      const amtInput = document.getElementById(`splitAmountInput_${m.id}`);
      const val = Number(amtInput?.value) || 0;
      if (state.splitMode === 'exact') {
        exactSplits[m.id] = val;
      } else if (state.splitMode === 'percentage') {
        percentages[m.id] = val;
      } else if (state.splitMode === 'shares') {
        shares[m.id] = val || 1;
      }
    }
  });

  if (sharedWith.length === 0) {
    alert('Please select at least 1 person to share this expense with.');
    return;
  }

  // Calculate home currency conversion
  let convertedAmount = amount;
  if (currency === trip.homeCurrency) {
    convertedAmount = amount;
  } else if (currency === trip.baseCurrency) {
    convertedAmount = amount * (trip.forexRate || DEFAULT_FOREX_RATES_TO_INR[trip.baseCurrency] || 1);
  } else {
    const fx = DEFAULT_FOREX_RATES_TO_INR[currency] || 1;
    convertedAmount = amount * fx;
  }

  // If paid from Kitty, reduce Kitty pool balance
  const isPaidFromKitty = paidBy.some(p => p.memberId === 'kitty');
  if (isPaidFromKitty && trip.kitty) {
    trip.kitty.balance = Math.max(0, (Number(trip.kitty.balance) || 0) - convertedAmount);
    if (!trip.kitty.transactions) trip.kitty.transactions = [];
    trip.kitty.transactions.push({
      id: 'k-' + Date.now(),
      type: 'expense',
      amount: convertedAmount,
      note: title,
      timestamp: Date.now()
    });

    if (trip.kitty.totalCollected > 0 && (trip.kitty.balance / trip.kitty.totalCollected) < 0.2) {
      showToast('⚠️ Alert: Trip Kitty balance running low (<20% remaining)!');
    }
  }

  const expenseObj = {
    id: editId || 'exp-' + Date.now(),
    title,
    amount,
    currency,
    convertedAmount,
    categoryId: selectedModalCategoryId,
    paidBy,
    sharedWith,
    splitMode: state.splitMode,
    exactSplits: state.splitMode === 'exact' ? exactSplits : null,
    percentages: state.splitMode === 'percentage' ? percentages : null,
    shares: state.splitMode === 'shares' ? shares : null,
    date,
    receipt: state.tempReceiptBase64,
    createdAt: editId ? (trip.expenses.find(e => e.id === editId)?.createdAt || Date.now()) : Date.now()
  };

  if (editId) {
    const idx = trip.expenses.findIndex(e => e.id === editId);
    if (idx !== -1) trip.expenses[idx] = expenseObj;
  } else {
    if (!trip.expenses) trip.expenses = [];
    trip.expenses.push(expenseObj);
  }

  const payerLabel = isPaidFromKitty ? 'Trip Kitty' : (trip.members.find(m => m.id === paidBy[0]?.memberId)?.name || 'Friend');
  logActivity(editId ? 'edit' : 'expense', payerLabel, `${editId ? 'Updated' : 'Added'} "${title}" (${currency} ${amount})`, 'fa-receipt');

  saveTripsToStorage();
  closeModal('modalAddExpense');
  renderAll();
  SoundEffects.playCoin();
  showToast(editId ? '✓ Expense updated!' : `✓ Added ${title}!`);

  // Silent background sync
  queueSilentSync(expenseObj);
}

function editExpense(expId) {
  openAddExpenseModal(expId);
}

function deleteExpense(expId) {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  const trip = state.activeTrip;
  const exp = trip.expenses.find(e => e.id === expId);
  trip.expenses = trip.expenses.filter(e => e.id !== expId);

  // Tombstone tracking so cloud sync does not resurrect deleted expense
  if (!trip.deletedExpenseIds) trip.deletedExpenseIds = [];
  if (!trip.deletedExpenseIds.includes(expId)) {
    trip.deletedExpenseIds.push(expId);
  }

  logActivity('delete', 'Friend', `Deleted expense "${exp?.title || 'Expense'}"`, 'fa-trash');

  saveTripsToStorage();
  renderAll();
  showToast('✓ Expense deleted');
  syncActiveTripToCloud(false);
}

// ==================== RECEIPT ATTACHMENT & CLIENT COMPRESSION ====================
function handleReceiptUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Compress using HTML5 Canvas to <100KB WebP/JPEG
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 900;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
      state.tempReceiptBase64 = compressedDataUrl;

      document.getElementById('imgReceiptPreview').src = compressedDataUrl;
      document.getElementById('containerReceiptPreview').classList.remove('hidden');
      document.getElementById('labelReceiptAttached').textContent = 'Photo Attached';
      showToast('✓ Receipt compressed & attached');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removeReceipt() {
  state.tempReceiptBase64 = null;
  document.getElementById('containerReceiptPreview').classList.add('hidden');
  document.getElementById('labelReceiptAttached').textContent = 'Attach Photo';
  document.getElementById('inputReceiptFile').value = '';
}

// ==================== FOREX RATE OVERRIDE ====================
function openForexModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const selectDest = document.getElementById('selectForexDestinationCurrency');
  if (selectDest) {
    selectDest.value = trip.baseCurrency || 'THB';
  }

  document.getElementById('inputCustomForexRate').value = trip.forexRate || DEFAULT_FOREX_RATES_TO_INR[trip.baseCurrency] || 2.48;
  document.getElementById('forexBaseCode').textContent = trip.baseCurrency || 'THB';
  document.getElementById('forexTargetCode').textContent = trip.homeCurrency || 'INR';
  const unitLabel = document.getElementById('forexUnitLabel');
  if (unitLabel) unitLabel.textContent = trip.homeCurrency || 'INR';

  openModal('modalForex');
}

function handleForexDestinationChange() {
  const selectDest = document.getElementById('selectForexDestinationCurrency');
  if (!selectDest) return;
  const newBaseCur = selectDest.value;
  const selectedOpt = selectDest.options[selectDest.selectedIndex];
  const defaultRate = Number(selectedOpt?.getAttribute('data-rate')) || DEFAULT_FOREX_RATES_TO_INR[newBaseCur] || 1;

  const baseCodeEl = document.getElementById('forexBaseCode');
  if (baseCodeEl) baseCodeEl.textContent = newBaseCur;
  const rateInput = document.getElementById('inputCustomForexRate');
  if (rateInput) rateInput.value = defaultRate;
}

function saveCustomForexRate() {
  const trip = state.activeTrip;
  if (!trip) return;

  const selectDest = document.getElementById('selectForexDestinationCurrency');
  const selectedCur = selectDest ? selectDest.value : trip.baseCurrency;
  const selectedOpt = selectDest ? selectDest.options[selectDest.selectedIndex] : null;
  const selectedSymbol = selectedOpt?.getAttribute('data-symbol') || CURRENCY_SYMBOLS[selectedCur] || selectedCur;

  const rate = Number(document.getElementById('inputCustomForexRate').value);
  if (!rate || rate <= 0) {
    alert('Please enter a valid rate greater than 0.');
    return;
  }

  trip.baseCurrency = selectedCur;
  trip.currencySymbol = selectedSymbol;
  trip.forexRate = rate;

  // Re-calculate convertedAmount for all expenses
  (trip.expenses || []).forEach(exp => {
    if (exp.currency === trip.baseCurrency) {
      exp.convertedAmount = exp.amount * rate;
    } else if (exp.currency === trip.homeCurrency) {
      exp.convertedAmount = exp.amount;
    } else {
      const fx = DEFAULT_FOREX_RATES_TO_INR[exp.currency] || 1;
      exp.convertedAmount = exp.amount * fx;
    }
  });

  saveTripsToStorage();
  closeModal('modalForex');
  renderAll();
  showToast(`✓ Currency locked: 1 ${trip.baseCurrency} = ₹${rate.toFixed(2)} ${trip.homeCurrency}`);
}

async function fetchLiveForexRate() {
  const trip = state.activeTrip;
  if (!trip) return;

  const baseCur = document.getElementById('forexBaseCode')?.textContent || trip.baseCurrency || 'THB';
  const targetCur = trip.homeCurrency || 'INR';

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCur}`);
    const data = await res.json();
    if (data && data.rates && data.rates[targetCur]) {
      const liveRate = data.rates[targetCur];
      document.getElementById('inputCustomForexRate').value = Number(liveRate).toFixed(4);
      showToast(`✓ Fetched live rate: 1 ${baseCur} = ₹${Number(liveRate).toFixed(2)} ${targetCur}`);
    } else {
      throw new Error('Rate not found');
    }
  } catch (err) {
    alert('Could not fetch live rate. Please enter your rate manually.');
  }
}

// ==================== 1-TAP WHATSAPP DAILY SUMMARY GENERATOR ====================
function openWhatsAppSummaryModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const totalPrimary = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalHome = (trip.expenses || []).reduce((sum, exp) => {
    return sum + (exp.convertedAmount || (exp.amount * (trip.forexRate || 1)));
  }, 0);

  const transfers = calculateOptimalSettlements(trip);
  const netBalances = calculateNetBalances(trip);

  // Format top transactions
  const topExpenses = [...(trip.expenses || [])]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(exp => {
      const cat = getCategoryInfo(exp.categoryId);
      const payerId = Array.isArray(exp.paidBy) ? exp.paidBy[0]?.memberId : exp.paidBy;
      const payer = trip.members.find(m => m.id === payerId)?.name || 'Friend';
      return `• ${cat.displayEmoji} ${exp.title}: ${formatCurrency(exp.amount, exp.currency || trip.baseCurrency)} (${payer})`;
    })
    .join('\n');

  // Format Standings
  const standings = trip.members.map(m => {
    const net = Math.round((netBalances[m.id] || 0));
    if (net > 5) return `• ${m.name}: +₹${net} (Gets back)`;
    if (net < -5) return `• ${m.name}: -₹${Math.abs(net)} (Owes)`;
    return `• ${m.name}: Barabar (₹0)`;
  }).join('\n');

  // Format Optimal Transfers
  const transfersText = transfers.length > 0 
    ? transfers.map(t => {
        const from = trip.members.find(m => m.id === t.fromId)?.name;
        const to = trip.members.find(m => m.id === t.toId)?.name;
        return `👉 ${from} pays ${to}: ₹${t.amount.toFixed(0)}`;
      }).join('\n')
    : '✨ Sabka Hisaab Barabar! Zero pending transfers.';

  const summary = `🌴 *${trip.name.toUpperCase()}* — TRIP RECAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Spend:* ${formatCurrency(totalPrimary, trip.baseCurrency)} (~₹${totalHome.toFixed(0)} INR)
💱 *Exchange Rate:* 1 ${trip.baseCurrency} = ₹${Number(trip.forexRate || 1).toFixed(2)}

🔥 *Top Spends:*
${topExpenses || '• No expenses logged yet'}

⚖️ *Current Standings:*
${standings}

🤝 *Hisaab Barabar (Minimal Transfers):*
${transfersText}

📲 *Open Live Ledger:* https://tripbarabar.pages.dev/join/${trip.code || 'THAI26'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Trip Sorted. Hisaab Barabar._`;

  document.getElementById('whatsappSummaryText').value = summary;
  openModal('modalWhatsAppSummary');
}

function copyWhatsAppSummary() {
  const textarea = document.getElementById('whatsappSummaryText');
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    document.getElementById('btnCopyWhatsAppText').textContent = 'Copied to Clipboard!';
    setTimeout(() => {
      document.getElementById('btnCopyWhatsAppText').textContent = 'Copy to WhatsApp';
    }, 2500);
    showToast('✓ WhatsApp recap copied to clipboard!');
  }).catch(() => {
    document.execCommand('copy');
    showToast('✓ Copied to clipboard!');
  });
}

// ==================== CSV EXPORT ====================
function exportTripCSV() {
  const trip = state.activeTrip;
  if (!trip || !trip.expenses || trip.expenses.length === 0) {
    alert('No expenses to export yet.');
    return;
  }

  let csv = 'Date,Title,Category,Amount,Currency,Home Currency Amount (INR),Paid By,Shared With\n';

  trip.expenses.forEach(exp => {
    const cat = getCategoryInfo(exp.categoryId);
    const converted = exp.convertedAmount || (exp.amount * (trip.forexRate || 1));
    const payerName = Array.isArray(exp.paidBy)
      ? exp.paidBy.map(p => trip.members.find(m => m.id === p.memberId)?.name).join('; ')
      : trip.members.find(m => m.id === exp.paidBy)?.name;
    const sharedNames = (exp.sharedWith || []).map(id => trip.members.find(m => m.id === id)?.name).join('; ');

    csv += `"${exp.date}","${exp.title.replace(/"/g, '""')}","${cat.displayName}",${exp.amount},"${exp.currency || trip.baseCurrency}",${converted},"${payerName}","${sharedNames}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${trip.name.replace(/\s+/g, '_')}_Expenses.csv`;
  a.click();
  showToast('✓ Exported CSV successfully!');
}

// ==================== MULTI-TRIP COMMAND HUB ====================
function openTripSwitcherModal(defaultTab) {
  const tab = defaultTab || (state.trips.length === 0 ? 'create' : 'trips');
  switchTripHubTab(tab);
  renderTripHubList();
  openModal('modalTripSwitcher');
}

function switchTripHubTab(tabName) {
  const tabs = ['trips', 'create', 'join'];
  tabs.forEach(t => {
    const btn = document.getElementById('tabBtnHub' + t.charAt(0).toUpperCase() + t.slice(1));
    const sec = document.getElementById('hubSection' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn && sec) {
      if (t === tabName) {
        btn.className = 'py-1.5 rounded-lg font-bold text-xs bg-brand-500 text-slate-950 transition-all';
        sec.classList.remove('hidden');
      } else {
        btn.className = 'py-1.5 rounded-lg font-bold text-xs text-slate-400 hover:text-slate-200 transition-all';
        sec.classList.add('hidden');
      }
    }
  });

  if (tabName === 'create') {
    const yourNameInput = document.getElementById('newTripYourName');
    if (yourNameInput && !yourNameInput.value) {
      yourNameInput.value = localStorage.getItem('tb_user_name') || '';
    }
  }
}

function renderTripHubList() {
  const container = document.getElementById('tripSwitcherList');
  const countBadge = document.getElementById('hubTripsCount');
  if (!container) return;

  if (countBadge) countBadge.textContent = state.trips.length;

  if (!state.trips || state.trips.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 px-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 space-y-2">
        <div class="text-3xl">🌴</div>
        <div class="text-xs font-bold text-white">No trips created yet</div>
        <p class="text-[11px] text-slate-400 max-w-xs mx-auto">Create your own trip or join one with your friends' room code to get started!</p>
        <div class="pt-2 flex items-center justify-center gap-2">
          <button onclick="switchTripHubTab('create')" class="px-3.5 py-2 rounded-xl bg-brand-500 text-slate-950 font-black text-xs active-press shadow-md">
            ➕ Create Trip
          </button>
          <button onclick="switchTripHubTab('join')" class="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs active-press">
            🔑 Join Code
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = state.trips.map(t => {
    const isActive = state.activeTrip?.id === t.id;
    const totalExpBase = (t.expenses || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const forex = Number(t.forexRate) || 1.0;
    const totalExpHome = Math.round(totalExpBase * forex);
    const destinationFlag = getDestinationEmoji(t.destination || t.name);

    return `
      <div class="p-3.5 rounded-2xl border transition-all ${
        isActive
          ? 'bg-gradient-to-r from-brand-950/70 to-slate-900 border-brand-500 shadow-lg'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
      }">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
              ${destinationFlag}
            </div>
            <div>
              <div class="text-xs font-black text-white flex items-center gap-2">
                <span>${escapeHtml(t.name)}</span>
                ${isActive ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-brand-500 text-slate-950 font-black">ACTIVE</span>' : ''}
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">
                ${escapeHtml(t.destination || 'Trip')} • ${escapeHtml(t.dates || 'Upcoming')} • ${(t.members || []).length} friends
              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="font-mono text-xs font-black text-amber-400">
              ${t.currencySymbol || '₹'}${Math.round(totalExpBase).toLocaleString()}
            </div>
            ${t.baseCurrency !== (t.homeCurrency || 'INR') ? `
              <div class="text-[9px] font-mono text-slate-400">
                ≈ ₹${totalExpHome.toLocaleString('en-IN')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-slate-500 font-mono">Code:</span>
            <span class="text-[10px] font-mono font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">${escapeHtml(t.code || 'TRIP')}</span>
          </div>

          <div class="flex items-center gap-1.5">
            ${!isActive ? `
              <button onclick="selectTrip('${t.id}')" class="px-2.5 py-1 rounded-lg bg-brand-500 text-slate-950 font-bold text-[11px] active-press">
                Switch Here
              </button>
            ` : `
              <span class="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Currently Selected
              </span>
            `}
            <button onclick="copyTripShareLinkWithCode('${t.code || 'TRIP'}')" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white" title="Copy Share Link">
              <i class="fa-solid fa-share-nodes text-xs"></i>
            </button>
            ${state.trips.length > 1 && !isActive ? `
              <button onclick="deleteTripFromHub('${t.id}')" class="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white" title="Delete Trip">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getDestinationEmoji(dest) {
  const d = (dest || '').toLowerCase();
  if (d.includes('thai') || d.includes('phuket') || d.includes('bangkok') || d.includes('pattaya')) return '🌴';
  if (d.includes('goa') || d.includes('beach') || d.includes('bali')) return '🏖️';
  if (d.includes('dubai') || d.includes('uae') || d.includes('desert')) return '🏜️';
  if (d.includes('europe') || d.includes('paris') || d.includes('rome') || d.includes('london')) return '🏰';
  if (d.includes('japan') || d.includes('tokyo') || d.includes('kyoto')) return '⛩️';
  if (d.includes('mountain') || d.includes('ladakh') || d.includes('manali') || d.includes('alps')) return '🏔️';
  return '✈️';
}

function selectTrip(tripId) {
  const trip = state.trips.find(t => t.id === tripId);
  if (!trip) return;

  state.activeTrip = trip;
  if (!trip.theme) {
    trip.theme = detectThemeFromTrip(trip);
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, trip.id);
  saveTripsToStorage();

  // Immediately apply atmosphere theme
  applyDestinationTheme(trip.theme);

  closeModal('modalTripSwitcher');
  renderAll();
  SoundEffects.playPop();
  const themeName = DESTINATION_THEMES[trip.theme]?.name || 'Theme';
  const themeEmoji = DESTINATION_THEMES[trip.theme]?.emoji || '🏖️';
  showToast(`${themeEmoji} Switched to ${trip.name} (${themeName})!`);
}

function selectNewTripCurrency(curr, sym, forex) {
  document.getElementById('selectedNewTripCurrency').value = curr;
  document.getElementById('selectedNewTripSymbol').value = sym;
  document.getElementById('selectedNewTripForex').value = forex;

  const currs = ['INR', 'THB', 'AED', 'EUR', 'USD', 'JPY', 'VND', 'GBP'];
  currs.forEach(c => {
    const btn = document.getElementById('currBtn-' + c);
    if (btn) {
      if (c === curr) {
        btn.className = 'py-1.5 px-2 rounded-xl border text-center font-bold text-xs bg-brand-500/20 text-brand-300 border-brand-500';
      } else {
        btn.className = 'py-1.5 px-2 rounded-xl border text-center font-bold text-xs bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';
      }
    }
  });
}

function confirmCreateTripFromHub() {
  const nameInput = document.getElementById('newTripName');
  const destInput = document.getElementById('newTripDestination');
  const datesInput = document.getElementById('newTripDates');
  const yourNameInput = document.getElementById('newTripYourName');
  const friendsInput = document.getElementById('newTripFriends');

  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    showToast('⚠️ Please enter a trip name');
    if (nameInput) nameInput.focus();
    return;
  }

  const destination = destInput && destInput.value.trim() ? destInput.value.trim() : name;
  const dates = datesInput && datesInput.value.trim() ? datesInput.value.trim() : 'Upcoming';
  const curr = document.getElementById('selectedNewTripCurrency')?.value || 'INR';
  const sym = document.getElementById('selectedNewTripSymbol')?.value || '₹';
  const forex = Number(document.getElementById('selectedNewTripForex')?.value) || 1.0;

  // Creator's name
  let yourName = yourNameInput && yourNameInput.value.trim() 
    ? yourNameInput.value.trim() 
    : (localStorage.getItem('tb_user_name') || '');

  // Parse friends
  const rawFriends = friendsInput && friendsInput.value.trim() 
    ? friendsInput.value.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  if (!yourName && rawFriends.length === 0) {
    showToast('⚠️ Please enter your name and traveling friends');
    if (yourNameInput) yourNameInput.focus();
    return;
  }

  if (yourName) {
    localStorage.setItem('tb_user_name', yourName);
  } else {
    yourName = 'You';
  }

  // Combine creator as #1, followed by friends (avoiding duplicate creator name)
  const allNames = [yourName];
  rawFriends.forEach(fn => {
    if (fn.toLowerCase() !== yourName.toLowerCase() && !allNames.some(n => n.toLowerCase() === fn.toLowerCase())) {
      allNames.push(fn);
    }
  });

  const colors = ['#0D9488', '#0284C7', '#7C3AED', '#D97706', '#E11D48', '#10B981', '#6366F1', '#EC4899', '#F59E0B'];
  const members = allNames.map((fn, idx) => ({
    id: 'm' + (idx + 1),
    name: fn,
    phone: '',
    upi: '',
    color: colors[idx % colors.length]
  }));

  const code = (name.replace(/[^A-Za-z]/g, '').slice(0, 4) || 'TRIP').toUpperCase() + Math.floor(10 + Math.random() * 90);

  const newTrip = {
    id: 'trip-' + Date.now(),
    name: name,
    destination: destination,
    dates: dates,
    code: code,
    theme: detectThemeFromTrip({ name, destination }),
    baseCurrency: curr,
    currencySymbol: sym,
    homeCurrency: 'INR',
    homeCurrencySymbol: '₹',
    forexRate: forex,
    myMemberId: 'm1',
    members: members,
    customCategories: [],
    expenses: [],
    settlements: [],
    itinerary: [],
    kitty: {
      balance: 0,
      targetPerMember: 0,
      totalCollected: 0,
      contributors: members.map(m => m.id),
      transactions: []
    },
    budget: { total: 0, days: 3, currency: curr },
    pendingSettlements: [],
    activityLog: [{
      id: 'act-' + Date.now(),
      action: 'create_trip',
      text: `Created new trip "${name}" (${destination})`,
      timestamp: Date.now(),
      memberId: members[0]?.id || 'm1'
    }]
  };

  state.trips.push(newTrip);
  state.activeTrip = newTrip;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, newTrip.id);
  saveTripsToStorage();

  // Clear input fields
  if (nameInput) nameInput.value = '';
  if (destInput) destInput.value = '';
  if (datesInput) datesInput.value = '';
  if (friendsInput) friendsInput.value = '';

  closeModal('modalTripSwitcher');
  renderAll();
  SoundEffects.playVictory();
  fireConfetti();
  showToast(`🎉 Created "${newTrip.name}"! Room Code: ${newTrip.code}`);
  syncActiveTripToCloud(true);
}

function handleJoinTripByCode() {
  const codeInput = document.getElementById('inputJoinTripCode');
  const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
  if (!code) {
    showToast('⚠️ Please enter a room code');
    return;
  }
  closeModal('modalJoinTripCode');
  joinTripByCode(code);
}

async function joinTripByCode(directCode) {
  let code = directCode;
  if (!code) {
    const codeInput = document.getElementById('inputJoinTripCode');
    code = codeInput ? codeInput.value.trim().toUpperCase() : '';
  } else {
    code = code.trim().toUpperCase();
  }
  if (!code) {
    showToast('⚠️ Please enter a room code');
    return;
  }

  showToast(`⏳ Connecting to trip room ${code}...`);
  try {
    const res = await fetch(`/api/sync/trip?code=${encodeURIComponent(code)}&_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.trip) {
        const cloudTrip = data.trip;
        cloudTrip.code = code;
        const existingIdx = state.trips.findIndex(t => (t.code || '').toUpperCase() === code || t.id === cloudTrip.id);
        if (existingIdx >= 0) {
          const merged = mergeTrips(state.trips[existingIdx], cloudTrip);
          state.trips[existingIdx] = merged;
          state.activeTrip = merged;
        } else {
          state.trips.push(cloudTrip);
          state.activeTrip = cloudTrip;
        }
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, state.activeTrip.id);
        saveTripsToStorage();
        applyDestinationTheme(state.activeTrip.theme || detectThemeFromTrip(state.activeTrip));
        renderAll();
        SoundEffects.playSuccess();
        showToast(`🎉 Connected to "${state.activeTrip.name}"! Synced ${state.activeTrip.expenses.length} expenses.`);
        syncActiveTripToCloud(false);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not reach sync server, falling back to local:', err);
  }

  // Fallback if not found on server or offline
  const existing = state.trips.find(t => (t.code || '').toUpperCase() === code);
  if (existing) {
    selectTrip(existing.id);
    return;
  }

  const joinedTrip = {
    id: 'trip-join-' + Date.now(),
    name: 'Joined Trip (' + code + ')',
    destination: 'Trip',
    dates: 'Live',
    code: code,
    baseCurrency: 'INR',
    currencySymbol: '₹',
    homeCurrency: 'INR',
    homeCurrencySymbol: '₹',
    forexRate: 1.0,
    members: [
      { id: 'm1', name: 'Host', phone: '', upi: '', color: '#0D9488' },
      { id: 'm2', name: 'Me', phone: '', upi: '', color: '#0284C7' }
    ],
    expenses: [],
    settlements: [],
    itinerary: []
  };

  state.trips.push(joinedTrip);
  selectTrip(joinedTrip.id);
  syncActiveTripToCloud(true);
}

function deleteTripFromHub(tripId) {
  if (!confirm('Are you sure you want to delete this trip and all its records?')) return;
  state.trips = state.trips.filter(t => t.id !== tripId);
  if (state.activeTrip?.id === tripId) {
    state.activeTrip = state.trips[0] || null;
  }
  saveTripsToStorage();
  renderTripHubList();
  renderAll();
  showToast('✓ Trip removed');
}

function copyTripShareLinkWithCode(code) {
  const url = `${window.location.origin}${window.location.pathname}#join=${code}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`✓ Share link for ${code} copied!`);
  }).catch(() => {
    showToast(`Room Code: ${code}`);
  });
}

function openAppStoreInfoModal() {
  openModal('modalAppStoreInfo');
}

// ==================== REALTIME MULTI-FRIEND CLOUD SYNC ENGINE ====================
let lastCloudSyncTime = 0;
let cloudSyncTimer = null;
let isSyncingToCloud = false;

// Conflict-Free Offline/Online Trip Merger (Tombstone-Aware)
function mergeTrips(localTrip, cloudTrip) {
  if (!localTrip) return cloudTrip;
  if (!cloudTrip) return localTrip;

  const localExpenses = Array.isArray(localTrip.expenses) ? localTrip.expenses : [];
  const cloudExpenses = Array.isArray(cloudTrip.expenses) ? cloudTrip.expenses : [];
  const deletedIds = new Set([
    ...(localTrip.deletedExpenseIds || []),
    ...(cloudTrip.deletedExpenseIds || [])
  ]);

  const expenseMap = new Map();
  // Preserve all local non-deleted expenses
  localExpenses.forEach(exp => {
    if (exp && exp.id && !deletedIds.has(exp.id)) {
      expenseMap.set(exp.id, exp);
    }
  });

  // Merge cloud non-deleted expenses
  cloudExpenses.forEach(cloudExp => {
    if (!cloudExp || !cloudExp.id || deletedIds.has(cloudExp.id)) return;
    if (!expenseMap.has(cloudExp.id)) {
      expenseMap.set(cloudExp.id, cloudExp);
    } else {
      const localExp = expenseMap.get(cloudExp.id);
      const cloudTime = cloudExp.updatedAt || cloudExp.createdAt || 0;
      const localTime = localExp.updatedAt || localExp.createdAt || 0;
      if (cloudTime > localTime) {
        expenseMap.set(cloudExp.id, cloudExp);
      }
    }
  });

  // Merge members
  const memberMap = new Map();
  (localTrip.members || []).forEach(m => {
    if (m && m.id) memberMap.set(m.id, m);
  });
  (cloudTrip.members || []).forEach(m => {
    if (!m || !m.id) return;
    if (!memberMap.has(m.id)) {
      memberMap.set(m.id, m);
    } else {
      const localM = memberMap.get(m.id);
      memberMap.set(m.id, {
        ...m,
        upi: m.upi || localM.upi || '',
        phone: m.phone || localM.phone || '',
        color: m.color || localM.color
      });
    }
  });

  // Merge settlements
  const settlementMap = new Map();
  (localTrip.settlements || []).forEach(s => {
    if (s && s.id) settlementMap.set(s.id, s);
  });
  (cloudTrip.settlements || []).forEach(s => {
    if (s && s.id) settlementMap.set(s.id, s);
  });

  return {
    ...cloudTrip,
    ...localTrip,
    code: localTrip.code || cloudTrip.code,
    name: localTrip.name || cloudTrip.name,
    destination: localTrip.destination || cloudTrip.destination,
    baseCurrency: localTrip.baseCurrency || cloudTrip.baseCurrency || 'INR',
    currencySymbol: localTrip.currencySymbol || cloudTrip.currencySymbol || '₹',
    homeCurrency: localTrip.homeCurrency || cloudTrip.homeCurrency || 'INR',
    homeCurrencySymbol: localTrip.homeCurrencySymbol || cloudTrip.homeCurrencySymbol || '₹',
    forexRate: localTrip.forexRate || cloudTrip.forexRate || 1,
    members: memberMap.size > 0 ? Array.from(memberMap.values()) : (localTrip.members || cloudTrip.members || []),
    expenses: Array.from(expenseMap.values()),
    settlements: Array.from(settlementMap.values()),
    deletedExpenseIds: Array.from(deletedIds),
    myMemberId: localTrip.myMemberId || cloudTrip.myMemberId,
    kitty: (cloudTrip.kitty && (cloudTrip.kitty.transactions?.length || 0) > (localTrip.kitty?.transactions?.length || 0))
      ? cloudTrip.kitty
      : (localTrip.kitty || cloudTrip.kitty),
    theme: localTrip.theme || cloudTrip.theme
  };
}

function updateSyncStatusUI(status) {
  // Update header sync badge
  const headerIcon = document.getElementById('syncHeaderIcon');
  const headerText = document.getElementById('syncHeaderText');
  const headerBadge = document.getElementById('syncHeaderBadge');
  
  // Update modal sync pill
  const pill = document.getElementById('syncStatusPill');
  const text = document.getElementById('syncStatusText');

  if (status === 'syncing') {
    if (headerIcon) headerIcon.className = 'fa-solid fa-spinner fa-spin text-[10px] text-amber-400';
    if (headerText) headerText.textContent = 'Syncing...';
    if (headerBadge) headerBadge.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 transition-all';
    if (text) text.textContent = 'Syncing...';
  } else if (status === 'offline' || !navigator.onLine) {
    if (headerIcon) headerIcon.className = 'fa-solid fa-cloud text-[10px] text-slate-400';
    if (headerText) headerText.textContent = 'Offline';
    if (headerBadge) headerBadge.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800/80 border border-slate-700/80 text-slate-400 transition-all';
    if (text) text.textContent = 'Offline';
  } else {
    if (headerIcon) headerIcon.className = 'fa-solid fa-cloud-arrow-up text-[10px] text-emerald-400';
    if (headerText) headerText.textContent = 'Live';
    if (headerBadge) headerBadge.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800/80 border border-slate-700/80 text-emerald-400 cursor-pointer active-press hover:border-emerald-500/40 transition-all';
    if (text) text.textContent = 'Live Sync';
  }
}

function updateSyncStatus() {
  updateSyncStatusUI(navigator.onLine ? 'online' : 'offline');
}

async function syncActiveTripToCloud(forceToast = false) {
  const trip = state.activeTrip;
  if (!trip || !navigator.onLine || isSyncingToCloud) return;

  if (!trip.code) {
    const dest = (trip.destination || 'TRIP').replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() || 'TRIP';
    trip.code = dest + Math.floor(100 + Math.random() * 900);
  }

  isSyncingToCloud = true;
  updateSyncStatusUI('syncing');

  try {
    const res = await fetch(`/api/sync/trip?_t=${Date.now()}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: trip.code,
        trip: trip,
        sender: localStorage.getItem('tb_user_name') || 'Device',
        timestamp: Date.now()
      })
    });

    if (res.ok) {
      const data = await res.json();
      lastCloudSyncTime = data.lastModified || Date.now();
      localStorage.setItem('tb_last_cloud_sync_' + trip.id, lastCloudSyncTime.toString());
      updateSyncStatusUI('online');
      if (forceToast) {
        showToast(`☁️ Room ${trip.code} synced to cloud!`);
      }
    } else {
      updateSyncStatusUI('offline');
    }
  } catch (err) {
    console.warn('Sync to cloud error:', err);
    updateSyncStatusUI('offline');
  } finally {
    isSyncingToCloud = false;
  }
}

function debouncedCloudSync() {
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    syncActiveTripToCloud(false);
  }, 200);
}

async function fetchCloudUpdates(silent = true) {
  const trip = state.activeTrip;
  if (!trip || !trip.code || !navigator.onLine || isSyncingToCloud) return;

  try {
    const res = await fetch(`/api/sync/trip?code=${encodeURIComponent(trip.code)}&_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.trip) {
        const cloudTrip = data.trip;
        const currentExpCount = (trip.expenses || []).length;

        // Perform conflict-free CRDT merge so local data is NEVER lost
        const merged = mergeTrips(trip, cloudTrip);
        const newExpCount = (merged.expenses || []).length;

        const hasNewExpensesFromFriends = newExpCount > currentExpCount;
        const hasUnsyncedLocalExpenses = currentExpCount > (cloudTrip.expenses || []).length;
        const hasMemberChanges = merged.members.length !== (trip.members || []).length;

        // Update active trip and storage with merged result
        Object.assign(trip, merged);
        const idx = state.trips.findIndex(t => t.id === trip.id);
        if (idx !== -1) {
          state.trips[idx] = trip;
        }

        lastCloudSyncTime = Math.max(data.lastModified || 0, Date.now());
        localStorage.setItem('tb_last_cloud_sync_' + trip.id, lastCloudSyncTime.toString());
        saveTripsToStorage();

        if (hasNewExpensesFromFriends || hasMemberChanges) {
          renderAll();
          if (hasNewExpensesFromFriends) {
            SoundEffects.playCoin();
            showToast(`🔄 Synced with friends: ${newExpCount} total expenses!`);
          }
        } else if (!silent) {
          showToast('✓ Everything is up to date!');
        }

        // If local had expenses not yet on cloud, upload merged trip to cloud immediately
        if (hasUnsyncedLocalExpenses) {
          syncActiveTripToCloud(false);
        }
      }
    }
  } catch (e) {
    // Silent fail on network blips
  }
}

function startRealtimeCloudPolling() {
  // Push active trip state first, then fetch friend updates
  setTimeout(() => {
    syncActiveTripToCloud(false).then(() => {
      fetchCloudUpdates(true);
    });
  }, 600);

  // Poll every 5 seconds for incoming friend expenses
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchCloudUpdates(true);
    }
  }, 5000);

  // Sync immediately when user switches back to tab
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      fetchCloudUpdates(true);
      syncActiveTripToCloud(false);
    }
  });
}

function queueSilentSync(item) {
  // Immediate upload to avoid loss on refresh
  syncActiveTripToCloud(false);
  debouncedCloudSync();
}

function triggerSyncManual() {
  if (navigator.vibrate) navigator.vibrate(25);
  showToast('🔄 Checking cloud updates...');
  syncActiveTripToCloud(true);
  fetchCloudUpdates(false);
}

function copyTripShareLink() {
  openInviteFriendsModal();
}

function openInviteFriendsModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  if (!trip.code) {
    const dest = (trip.destination || 'TRIP').replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() || 'TRIP';
    trip.code = dest + Math.floor(100 + Math.random() * 900);
    saveTripsToStorage();
  }

  const roomCodeEl = document.getElementById('inviteModalRoomCode');
  const titleEl = document.getElementById('inviteModalTripTitle');
  const urlInput = document.getElementById('inviteModalShareUrl');
  const qrImg = document.getElementById('inviteQrImage');

  const shareUrl = `${window.location.origin}${window.location.pathname}#join=${trip.code}`;

  if (roomCodeEl) roomCodeEl.textContent = trip.code;
  if (titleEl) titleEl.textContent = trip.name;
  if (urlInput) urlInput.value = shareUrl;
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;
  }

  // Ensure room exists on server
  syncActiveTripToCloud(false);

  openModal('modalInviteFriends');
  SoundEffects.playPop();
}

function copyInviteModalLink() {
  const input = document.getElementById('inviteModalShareUrl');
  const url = input ? input.value : `${window.location.origin}${window.location.pathname}#join=${state.activeTrip?.code || 'GOA26'}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      SoundEffects.playCoin();
      showToast('✓ Live trip link copied to clipboard!');
    }).catch(() => {
      showToast(`Trip Code: ${state.activeTrip?.code || 'GOA26'}`);
    });
  } else {
    showToast(`Trip Code: ${state.activeTrip?.code || 'GOA26'}`);
  }
}

function shareTripViaWhatsApp() {
  const trip = state.activeTrip;
  const code = trip?.code || 'GOA26';
  const shareUrl = `${window.location.origin}${window.location.pathname}#join=${code}`;
  const text = `Hey! Join our trip "${trip?.name || 'Vacation'}" on Trip Barabar to view & add expenses together in real time:\n\n${shareUrl}`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

async function shareTripViaNative() {
  const trip = state.activeTrip;
  const code = trip?.code || 'GOA26';
  const shareUrl = `${window.location.origin}${window.location.pathname}#join=${code}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Trip Barabar: ${trip?.name || 'Vacation'}`,
        text: `Join our trip "${trip?.name}" to track & split expenses together live:`,
        url: shareUrl
      });
    } catch (e) {
      copyInviteModalLink();
    }
  } else {
    copyInviteModalLink();
  }
}

function toggleInviteQrCode() {
  const qrContainer = document.getElementById('inviteQrContainer');
  const toggleText = document.getElementById('inviteQrToggleText');
  if (!qrContainer) return;
  
  if (qrContainer.classList.contains('hidden')) {
    qrContainer.classList.remove('hidden');
    if (toggleText) toggleText.textContent = 'Hide QR Code';
  } else {
    qrContainer.classList.add('hidden');
    if (toggleText) toggleText.textContent = 'Show QR Code for In-Person Scanning';
  }
}

async function checkUrlForJoinCode() {
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  let joinCode = null;

  const hashMatch = hash.match(/#join=([A-Za-z0-9_-]+)/i);
  if (hashMatch) joinCode = hashMatch[1];

  if (!joinCode) {
    const searchParams = new URLSearchParams(search);
    joinCode = searchParams.get('join') || searchParams.get('code');
  }

  // AUTO-RESTORE: If no code in URL, and device has no active trip or 0 expenses:
  if (!joinCode && (!state.activeTrip || (state.activeTrip.expenses || []).length === 0)) {
    // 1. Try last stored room code
    joinCode = localStorage.getItem('tb_last_room_code');

    // 2. If none, check server for active room with highest expenses
    if (!joinCode) {
      try {
        const res = await fetch(`/api/sync/status?_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.rooms && data.rooms.length > 0) {
            const bestRoom = data.rooms.sort((a, b) => (b.expensesCount || 0) - (a.expensesCount || 0))[0];
            if (bestRoom && bestRoom.code) {
              joinCode = bestRoom.code;
            }
          }
        }
      } catch (err) {
        console.warn('Auto-detect active room from server error:', err);
      }
    }

    // 3. Fallback to THAI59
    if (!joinCode) {
      joinCode = 'THAI59';
    }
  }

  if (joinCode) {
    console.log('Connecting to trip room code:', joinCode);
    await joinTripByCode(joinCode);

    if (state.activeTrip && state.activeTrip.code) {
      localStorage.setItem('tb_last_room_code', state.activeTrip.code);
    }

    if (hashMatch) {
      // Clean hash from browser URL bar so subsequent page refreshes do not re-run join logic
      try {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.warn('Could not clean join url parameter:', e);
      }
    }
  }
}

// ==================== TAB SWITCHING & HELPERS ====================
function switchTab(tabId) {
  state.activeTab = tabId;
  const tabs = ['expenses', 'settle', 'analytics', 'settings'];

  tabs.forEach(t => {
    const section = document.getElementById(`tab-${t}`);
    const navBtn = document.getElementById(`nav-btn-${t}`);
    if (section) {
      if (t === tabId) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    }
    if (navBtn) {
      if (t === tabId) {
        navBtn.className = 'flex flex-col items-center py-1 rounded-xl text-brand-400 font-bold transition-all active-press';
      } else {
        navBtn.className = 'flex flex-col items-center py-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all active-press';
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setFilterCategory(catId) {
  state.selectedFilterCategory = catId;
  renderCategoryFilterChips();
  renderExpensesList();
}

function filterExpenses() {
  state.searchQuery = document.getElementById('expenseSearchInput').value;
  renderExpensesList();
}

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('hidden');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('hidden');
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
  }, 2400);
}

function formatCurrency(amount, currencyCode) {
  const num = Number(amount) || 0;
  const sym = CURRENCY_SYMBOLS[currencyCode];
  if (currencyCode === 'INR') {
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (sym) {
    return `${sym}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currencyCode || '₹'} ${num.toFixed(2)}`;
}

function openRecordSettlementModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const payerSelect = document.getElementById('selectSettlementPayer');
  const receiverSelect = document.getElementById('selectSettlementReceiver');
  if (!payerSelect || !receiverSelect) return;

  const options = trip.members.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
  payerSelect.innerHTML = options;
  receiverSelect.innerHTML = options;

  if (trip.members.length > 1) {
    receiverSelect.selectedIndex = 1;
  }

  document.getElementById('inputSettlementAmount').value = '';
  document.getElementById('inputSettlementNote').value = 'Paid via Google Pay / UPI';
  openModal('modalRecordSettlement');
}

function saveDirectSettlement() {
  const trip = state.activeTrip;
  if (!trip) return;

  const fromId = document.getElementById('selectSettlementPayer').value;
  const toId = document.getElementById('selectSettlementReceiver').value;
  const amount = Number(document.getElementById('inputSettlementAmount').value);
  const note = document.getElementById('inputSettlementNote').value.trim() || 'Settlement';

  if (fromId === toId) {
    alert('Payer and Receiver cannot be the same person.');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Please enter a valid settlement amount.');
    return;
  }

  const settlement = {
    id: 'settle-' + Date.now(),
    fromMemberId: fromId,
    toMemberId: toId,
    amount: amount,
    note: note,
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };

  if (!trip.settlements) trip.settlements = [];
  trip.settlements.push(settlement);
  saveTripsToStorage();
  closeModal('modalRecordSettlement');
  renderAll();
  fireConfetti();
  SoundEffects.playVictory();

  const fromName = trip.members.find(m => m.id === fromId)?.name;
  const toName = trip.members.find(m => m.id === toId)?.name;
  showToast(`✓ Settled ₹${amount} from ${fromName} to ${toName}!`);
}

function openAddMemberModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const countBadge = document.getElementById('modalCurrentMembersCount');
  if (countBadge) countBadge.textContent = trip.members.length;

  renderModalCurrentMembersList();

  // Reset input fields
  const nameInput = document.getElementById('inputNewMemberName');
  if (nameInput) nameInput.value = '';
  const upiInput = document.getElementById('inputNewMemberUpi');
  if (upiInput) upiInput.value = '';
  const phoneInput = document.getElementById('inputNewMemberPhone');
  if (phoneInput) phoneInput.value = '';
  const bulkInput = document.getElementById('textareaBulkMemberNames');
  if (bulkInput) bulkInput.value = '';

  switchAddMemberTab('single');
  openModal('modalAddMember');
}

function switchAddMemberTab(tab) {
  const btnSingle = document.getElementById('tabBtnMemberSingle');
  const btnBulk = document.getElementById('tabBtnMemberBulk');
  const secSingle = document.getElementById('sectionMemberSingle');
  const secBulk = document.getElementById('sectionMemberBulk');

  if (tab === 'bulk') {
    if (btnBulk) btnBulk.className = 'py-1.5 rounded-lg font-bold text-xs bg-brand-500 text-slate-950 transition-all';
    if (btnSingle) btnSingle.className = 'py-1.5 rounded-lg font-bold text-xs text-slate-400 hover:text-slate-200 transition-all';
    if (secBulk) secBulk.classList.remove('hidden');
    if (secSingle) secSingle.classList.add('hidden');
  } else {
    if (btnSingle) btnSingle.className = 'py-1.5 rounded-lg font-bold text-xs bg-brand-500 text-slate-950 transition-all';
    if (btnBulk) btnBulk.className = 'py-1.5 rounded-lg font-bold text-xs text-slate-400 hover:text-slate-200 transition-all';
    if (secSingle) secSingle.classList.remove('hidden');
    if (secBulk) secBulk.classList.add('hidden');
  }
}

function renderModalCurrentMembersList() {
  const trip = state.activeTrip;
  const listEl = document.getElementById('modalCurrentMembersList');
  if (!trip || !listEl) return;

  const countBadge = document.getElementById('modalCurrentMembersCount');
  if (countBadge) countBadge.textContent = trip.members.length;

  if (trip.members.length === 0) {
    listEl.innerHTML = '<div class="text-[11px] text-slate-500 text-center py-2">No friends added yet</div>';
    return;
  }

  const savedUserName = (localStorage.getItem('tb_user_name') || '').toLowerCase();
  const myId = (trip.myMemberId ? trip.members.find(m => m.id === trip.myMemberId)?.id : null) 
    || (savedUserName ? trip.members.find(m => m.name.toLowerCase() === savedUserName)?.id : null)
    || trip.members[0]?.id;

  listEl.innerHTML = trip.members.map(m => {
    const isYou = m.id === myId;
    return `
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border ${isYou ? 'border-brand-500/50 bg-brand-500/5' : 'border-slate-800'} text-[11px]">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-sm" style="background: ${m.color || '#0D9488'};">
            ${escapeHtml(m.name.charAt(0))}
          </span>
          <div class="min-w-0">
            <div class="font-bold text-white flex items-center gap-1.5 truncate">
              <span>${escapeHtml(m.name)}</span>
              ${isYou ? '<span class="px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 text-[9px] font-bold border border-brand-500/40">You</span>' : ''}
            </div>
            <div class="text-[9px] text-slate-400 truncate">${escapeHtml(m.upi || 'No UPI')}</div>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          ${!isYou ? `
            <button onclick="setMyMemberId('${m.id}')" class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-300 transition-all active-press" title="Click if this is you">
              This is Me
            </button>
          ` : ''}
          <button onclick="editMemberPrompt('${m.id}')" class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-brand-300" title="Edit">
            <i class="fa-solid fa-pen text-[9px]"></i>
          </button>
          <button onclick="deleteMember('${m.id}')" class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-rose-400 hover:text-rose-300" title="Remove">
            <i class="fa-solid fa-trash text-[9px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function saveSingleMemberFromModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const nameInput = document.getElementById('inputNewMemberName');
  const upiInput = document.getElementById('inputNewMemberUpi');
  const phoneInput = document.getElementById('inputNewMemberPhone');
  const isMeCheckbox = document.getElementById('checkboxIsCurrentUser');

  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    showToast('⚠️ Please enter member\'s name');
    return;
  }

  const colors = ['#0D9488', '#0284C7', '#7C3AED', '#EA580C', '#DB2777', '#16A34A', '#D97706', '#2563EB', '#64748B', '#F59E0B', '#10B981', '#E11D48'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newMember = {
    id: 'm-' + Date.now(),
    name: name,
    phone: phoneInput ? phoneInput.value.trim() : '',
    upi: upiInput ? upiInput.value.trim() : '',
    color: randomColor
  };

  trip.members.push(newMember);

  if (isMeCheckbox && isMeCheckbox.checked) {
    trip.myMemberId = newMember.id;
    localStorage.setItem('tb_user_name', newMember.name);
  }

  saveTripsToStorage();
  renderAll();
  renderModalCurrentMembersList();
  if (nameInput) nameInput.value = '';
  if (upiInput) upiInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (isMeCheckbox) isMeCheckbox.checked = false;

  SoundEffects.playPop();
  showToast(`✓ Added ${newMember.name} to the trip!`);
}

function setMyMemberId(memberId) {
  const trip = state.activeTrip;
  if (!trip) return;
  const m = trip.members.find(x => x.id === memberId);
  if (!m) return;

  trip.myMemberId = memberId;
  localStorage.setItem('tb_user_name', m.name);
  saveTripsToStorage();
  renderAll();
  renderModalCurrentMembersList();
  SoundEffects.playPop();
  showToast(`✓ Marked "${m.name}" as You!`);
}

function saveBulkMembersFromModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const textarea = document.getElementById('textareaBulkMemberNames');
  const rawText = textarea ? textarea.value.trim() : '';
  if (!rawText) {
    showToast('⚠️ Please paste or type names');
    return;
  }

  const names = rawText.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  if (names.length === 0) {
    showToast('⚠️ No valid names found');
    return;
  }

  const colors = ['#0D9488', '#0284C7', '#7C3AED', '#EA580C', '#DB2777', '#16A34A', '#D97706', '#2563EB', '#64748B', '#F59E0B', '#10B981', '#E11D48'];

  let addedCount = 0;
  names.forEach((name, idx) => {
    const exists = trip.members.some(m => m.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      trip.members.push({
        id: 'm-' + Date.now() + '-' + idx,
        name: name,
        phone: '',
        upi: '',
        color: colors[(trip.members.length + idx) % colors.length]
      });
      addedCount++;
    }
  });

  saveTripsToStorage();
  renderAll();
  renderModalCurrentMembersList();
  if (textarea) textarea.value = '';

  SoundEffects.playVictory();
  fireConfetti();
  showToast(`🎉 Added ${addedCount} friends to "${trip.name}"!`);
}

function deleteMember(memberId) {
  const trip = state.activeTrip;
  if (!trip) return;

  const member = trip.members.find(m => m.id === memberId);
  if (!member) return;

  const isUsed = (trip.expenses || []).some(e => {
    const isPayer = Array.isArray(e.paidBy) ? e.paidBy.some(p => p.memberId === memberId) : e.paidBy === memberId;
    const isConsumer = (e.sharedWith || []).includes(memberId);
    return isPayer || isConsumer;
  });

  if (isUsed) {
    if (!confirm(`"${member.name}" is already linked to expenses in this trip. Removing them will affect calculations. Remove anyway?`)) {
      return;
    }
  }

  trip.members = trip.members.filter(m => m.id !== memberId);
  if (selectedMemberFilter === memberId) selectedMemberFilter = null;

  saveTripsToStorage();
  renderAll();
  renderModalCurrentMembersList();
  showToast(`Removed ${member.name}`);
}

function editMemberPrompt(memberId) {
  const trip = state.activeTrip;
  if (!trip) return;
  const member = trip.members.find(m => m.id === memberId);
  if (!member) return;

  const newName = prompt('Edit friend\'s name:', member.name);
  if (!newName || !newName.trim()) return;
  const newUpi = prompt('Edit UPI ID:', member.upi || '') ?? member.upi;
  const newPhone = prompt('Edit phone number:', member.phone || '') ?? member.phone;

  member.name = newName.trim();
  member.upi = newUpi ? newUpi.trim() : '';
  member.phone = newPhone ? newPhone.trim() : '';

  saveTripsToStorage();
  renderAll();
  renderModalCurrentMembersList();
  showToast(`✓ Updated ${member.name}`);
}

function editMemberModal(memberId) {
  editMemberPrompt(memberId);
}

function openAddCustomCategoryModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const name = prompt('Enter Custom Category Name (e.g. Scuba Diving, Jet Ski, Cigars):');
  if (!name || !name.trim()) return;

  const emoji = prompt('Enter an emoji or symbol for this category (e.g. 🤿, 🚤, 💨):', '🏷️') || '🏷️';

  const newCat = {
    id: 'cat-' + Date.now(),
    emoji: emoji.trim(),
    name: name.trim(),
    discreetName: name.trim(),
    color: '#14B8A6'
  };

  if (!trip.customCategories) trip.customCategories = [];
  trip.customCategories.push(newCat);
  saveTripsToStorage();
  renderModalCategoryGrid();
  selectModalCategory(newCat.id);
  showToast(`✓ Created custom category "${newCat.name}"!`);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resetToDemoTrip() {
  seedInitialTrip();
  renderAll();
  showToast('✓ Loaded Thailand Boys Trip demo data!');
}

function clearTripExpenses() {
  if (!confirm('Are you sure you want to clear all expenses for this trip and start with a clean slate?')) return;
  state.activeTrip.expenses = [];
  state.activeTrip.settlements = [];
  saveTripsToStorage();
  renderAll();
  showToast('✓ Trip cleared! Ready for your real expenses.');
}

// ==================== 1. DISPUTE-PROOF ACTIVITY LOG & AUDIT TRAIL ====================
function logActivity(type, memberName, text, icon = 'fa-info-circle') {
  const trip = state.activeTrip;
  if (!trip) return;
  if (!trip.activityLog) trip.activityLog = [];

  trip.activityLog.unshift({
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    type,
    memberName,
    text,
    icon
  });

  if (trip.activityLog.length > 150) trip.activityLog.pop();
  saveTripsToStorage();
}

function openActivityLogModal() {
  const trip = state.activeTrip;
  const list = document.getElementById('activityLogList');
  if (!trip || !list) return;

  const logs = trip.activityLog || [];
  if (logs.length === 0) {
    list.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
        No recent activities recorded yet.
      </div>
    `;
  } else {
    list.innerHTML = logs.map(l => {
      const timeStr = formatRelativeTime(l.timestamp);
      return `
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-brand-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
            <i class="fa-solid ${l.icon || 'fa-bolt'}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="font-bold text-white text-xs">${escapeHtml(l.memberName || 'Friend')}</span>
              <span class="text-[10px] text-slate-500 font-mono">${timeStr}</span>
            </div>
            <p class="text-[11px] text-slate-300 mt-0.5 leading-relaxed">${escapeHtml(l.text)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  openModal('modalActivityLog');
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ==================== 2. HINGLISH NATURAL-LANGUAGE MAGIC ENTRY & VOICE ====================
let recognition = null;
let isRecording = false;

function toggleVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('⚠️ Voice recognition not supported in this browser. Please type in the box.');
    return;
  }

  const micBtn = document.getElementById('btnVoiceMic');

  if (isRecording && recognition) {
    recognition.stop();
    isRecording = false;
    micBtn.classList.remove('mic-listening');
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
      isRecording = true;
      micBtn.classList.add('mic-listening');
      showToast('🎙️ Listening... Speak naturally (e.g. "Rohan ne 1200 ka dinner diya, sabme barabar")');
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('inputHinglishMagic').value = transcript;
      submitHinglishEntry();
    };

    recognition.onerror = function(event) {
      isRecording = false;
      micBtn.classList.remove('mic-listening');
      showToast('⚠️ Speech recognition ended: ' + (event.error || 'No speech'));
    };

    recognition.onend = function() {
      isRecording = false;
      micBtn.classList.remove('mic-listening');
    };

    recognition.start();
  } catch (err) {
    console.error('Speech recognition error:', err);
    isRecording = false;
    micBtn.classList.remove('mic-listening');
  }
}

function handleHinglishKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitHinglishEntry();
  }
}

function setHinglishExample(exampleText) {
  document.getElementById('inputHinglishMagic').value = exampleText;
  submitHinglishEntry();
}

function submitHinglishEntry() {
  const input = document.getElementById('inputHinglishMagic');
  const text = input ? input.value.trim() : '';
  if (!text) {
    showToast('Please type or speak an expense first!');
    return;
  }

  const parsed = parseHinglishInput(text);
  if (!parsed || !parsed.amount || parsed.amount <= 0) {
    showToast('⚠️ Could not find amount. Try e.g. "Rohan 1200 dinner sabme"');
    return;
  }

  openAddExpenseModal();

  document.getElementById('inputExpenseTitle').value = parsed.title;
  document.getElementById('inputExpenseAmount').value = parsed.amount;
  document.getElementById('selectExpenseCurrency').value = parsed.currency;
  updateModalCurrencyPreview();

  selectModalCategory(parsed.categoryId);

  if (parsed.payerId === 'kitty') {
    document.getElementById('selectSinglePayer').value = 'kitty';
  } else {
    document.getElementById('selectSinglePayer').value = parsed.payerId;
  }

  const trip = state.activeTrip;
  trip.members.forEach(m => {
    const cb = document.getElementById(`splitMemberCheckbox_${m.id}`);
    if (cb) {
      cb.checked = parsed.sharedWith.includes(m.id);
    }
  });
  updateSharedSummary();

  input.value = '';
  showToast(`✨ Hinglish Magic: Pre-filled ${parsed.title} (₹${parsed.amount})! Tap Save.`);
}

function parseHinglishInput(rawText) {
  if (!rawText || !rawText.trim()) return null;
  const trip = state.activeTrip;
  if (!trip) return null;

  const text = rawText.toLowerCase().replace(/,/g, ' ');

  // 1. Amount Extraction
  let amount = 0;
  let currency = trip.homeCurrency || 'INR';

  if (text.includes('thb') || text.includes('baht') || text.includes('฿')) {
    currency = 'THB';
  } else if (text.includes('usd') || text.includes('$')) {
    currency = 'USD';
  }

  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
  } else {
    const numMatch = text.match(/(?:(?:rs\.?|inr|thb|baht|₹|\$)\s*)?(\d+(?:\.\d+)?)(?:\s*(?:ka|ki|rs|inr|thb|baht|rupaye|bucks))?/i);
    if (numMatch) {
      amount = parseFloat(numMatch[1]);
    }
  }

  // 2. Payer Matching
  let payerId = trip.members[0].id;
  for (const m of trip.members) {
    const nameLower = m.name.toLowerCase();
    if (text.includes(nameLower)) {
      payerId = m.id;
      break;
    }
  }
  if (text.includes('kitty') || text.includes('pool') || text.includes('common')) {
    payerId = 'kitty';
  }

  // 3. Category & Title Extraction
  let categoryId = 'food';
  let title = 'Expense';

  if (text.includes('dinner') || text.includes('lunch') || text.includes('khana') || text.includes('food') || text.includes('burger') || text.includes('pizza') || text.includes('seafood') || text.includes('breakfast')) {
    categoryId = 'food';
    title = text.includes('dinner') ? 'Dinner Feast' : (text.includes('lunch') ? 'Lunch' : 'Food & Dining');
  } else if (text.includes('cab') || text.includes('taxi') || text.includes('grab') || text.includes('bolt') || text.includes('uber') || text.includes('auto')) {
    categoryId = 'cabs';
    title = text.includes('grab') ? 'Grab Ride' : 'Cab / Transport';
  } else if (text.includes('beer') || text.includes('drinks') || text.includes('daaru') || text.includes('alcohol') || text.includes('whiskey') || text.includes('cocktail') || text.includes('club') || text.includes('party')) {
    categoryId = 'drinks';
    title = text.includes('club') ? 'Nightclub Party' : 'Beer & Drinks';
  } else if (text.includes('massage') || text.includes('spa')) {
    categoryId = 'massage';
    title = 'Thai Massage & Spa';
  } else if (text.includes('hotel') || text.includes('villa') || text.includes('room') || text.includes('resort') || text.includes('stay')) {
    categoryId = 'stay';
    title = 'Hotel / Villa Stay';
  } else if (text.includes('fuel') || text.includes('petrol') || text.includes('diesel') || text.includes('toll') || text.includes('fastag')) {
    categoryId = 'cabs';
    title = text.includes('toll') ? 'Toll & FASTag' : 'Road Trip Fuel';
  } else if (text.includes('lapdance') || text.includes('gogo')) {
    categoryId = 'lapdance';
    title = 'Nightlife & Lounge';
  } else if (text.includes('flight') || text.includes('ticket')) {
    categoryId = 'flight';
    title = 'Flight Tickets';
  } else if (text.includes('shopping') || text.includes('7-eleven') || text.includes('seven eleven')) {
    categoryId = 'shopping';
    title = '7-Eleven & Shopping';
  }

  // 4. Shared With Extraction
  let sharedWith = trip.members.map(m => m.id);
  if (text.includes('sabme barabar') || text.includes('sab') || text.includes('everyone') || text.includes('all') || text.includes('barabar')) {
    sharedWith = trip.members.map(m => m.id);
  } else {
    const mentionedMembers = [];
    trip.members.forEach(m => {
      const name = m.name.toLowerCase();
      if (text.includes(name)) {
        mentionedMembers.push(m.id);
      }
    });

    if (mentionedMembers.length > 1) {
      sharedWith = mentionedMembers;
    } else if (text.match(/(\d+)\s*(?:log|people|friends|out of 9|me)/)) {
      const countMatch = text.match(/(\d+)\s*(?:log|people|friends|out of 9|me)/);
      const count = parseInt(countMatch[1]) || 3;
      sharedWith = trip.members.slice(0, Math.min(count, trip.members.length)).map(m => m.id);
    }
  }

  return {
    amount,
    currency,
    payerId,
    categoryId,
    title,
    sharedWith,
    rawText
  };
}

// ==================== 3. TRIP KITTY / COMMON FUND (TREASURER MODE) ====================
function renderKittyCard() {
  const trip = state.activeTrip;
  const balanceEl = document.getElementById('kittyBalanceDisplay');
  const collectedEl = document.getElementById('kittyCollectedText');
  const spentEl = document.getElementById('kittySpentText');
  const progressEl = document.getElementById('kittyProgressBar');
  const alertEl = document.getElementById('kittyBadgeAlert');
  const cardEl = document.getElementById('tripKittyCard');
  if (!trip || !balanceEl) return;

  const kitty = trip.kitty || { balance: 0, totalCollected: 0, transactions: [] };
  const balance = Number(kitty.balance) || 0;
  const collected = Number(kitty.totalCollected) || 0;
  const spent = Math.max(0, collected - balance);

  balanceEl.textContent = `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  collectedEl.textContent = `Collected: ₹${collected.toLocaleString('en-IN')}`;
  spentEl.textContent = `Spent: ₹${spent.toLocaleString('en-IN')}`;

  const pct = collected > 0 ? Math.max(0, Math.min(100, (balance / collected) * 100)) : 0;
  if (progressEl) progressEl.style.width = `${pct}%`;

  const isLow = collected > 0 && (balance / collected) < 0.2;
  if (alertEl) {
    if (isLow) alertEl.classList.remove('hidden');
    else alertEl.classList.add('hidden');
  }
  if (cardEl) {
    if (isLow) cardEl.classList.add('kitty-low-alert');
    else cardEl.classList.remove('kitty-low-alert');
  }
}

function openKittyManagerModal() {
  const trip = state.activeTrip;
  if (!trip) return;
  const kitty = trip.kitty || { balance: 0, totalCollected: 0, contributors: [] };

  document.getElementById('kittyModalBalance').textContent = `₹${(Number(kitty.balance) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('kittyModalCollected').textContent = `₹${(Number(kitty.totalCollected) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const perPersonRefund = trip.members.length > 0 ? ((Number(kitty.balance) || 0) / trip.members.length).toFixed(2) : 0;
  document.getElementById('kittyRefundPerPersonLabel').textContent = `₹${perPersonRefund} / person`;

  const list = document.getElementById('kittyMemberListCheck');
  if (list) {
    list.innerHTML = trip.members.map(m => {
      const isContrib = (kitty.contributors || []).includes(m.id);
      return `
        <label class="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="kittyContrib_${m.id}" ${isContrib ? 'checked' : ''} onchange="toggleKittyContributor('${m.id}')" class="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700">
            <span class="font-bold text-white">${escapeHtml(m.name)}</span>
          </div>
          <span class="text-[10px] ${isContrib ? 'text-emerald-400 font-semibold' : 'text-slate-500'}">${isContrib ? '✓ Deposited ₹5,000' : 'Pending Deposit'}</span>
        </label>
      `;
    }).join('');
  }

  openModal('modalKittyManager');
}

function toggleKittyContributor(memberId) {
  const trip = state.activeTrip;
  if (!trip.kitty) trip.kitty = { balance: 0, totalCollected: 0, contributors: [], transactions: [] };
  const kitty = trip.kitty;
  if (!kitty.contributors) kitty.contributors = [];

  const cb = document.getElementById(`kittyContrib_${memberId}`);
  const member = trip.members.find(m => m.id === memberId);
  const depositAmt = Number(document.getElementById('inputKittyDepositPerPerson')?.value) || 5000;

  if (cb && cb.checked) {
    if (!kitty.contributors.includes(memberId)) {
      kitty.contributors.push(memberId);
      kitty.balance = (Number(kitty.balance) || 0) + depositAmt;
      kitty.totalCollected = (Number(kitty.totalCollected) || 0) + depositAmt;
      logActivity('kitty', member?.name || 'Friend', `Deposited ₹${depositAmt} into Trip Kitty Pool`, 'fa-piggy-bank');
    }
  } else {
    kitty.contributors = kitty.contributors.filter(id => id !== memberId);
    kitty.balance = Math.max(0, (Number(kitty.balance) || 0) - depositAmt);
    kitty.totalCollected = Math.max(0, (Number(kitty.totalCollected) || 0) - depositAmt);
  }

  saveTripsToStorage();
  renderAll();
  openKittyManagerModal();
}

function collectKittyBatch() {
  const trip = state.activeTrip;
  if (!trip) return;
  const depositAmt = Number(document.getElementById('inputKittyDepositPerPerson')?.value) || 5000;

  if (!trip.kitty) trip.kitty = { balance: 0, totalCollected: 0, contributors: [], transactions: [] };
  const kitty = trip.kitty;

  kitty.contributors = trip.members.map(m => m.id);
  const totalBatch = depositAmt * trip.members.length;
  kitty.balance = (Number(kitty.balance) || 0) + totalBatch;
  kitty.totalCollected = (Number(kitty.totalCollected) || 0) + totalBatch;

  logActivity('kitty', 'All Friends', `Collected ₹${depositAmt} from all ${trip.members.length} friends (Pool +₹${totalBatch})`, 'fa-piggy-bank');

  saveTripsToStorage();
  renderAll();
  openKittyManagerModal();
  fireConfetti();
  showToast(`✓ Collected ₹${totalBatch.toLocaleString('en-IN')} for Trip Kitty!`);
}

function openKittyRefundModal() {
  openKittyManagerModal();
}

function calculateAndRefundKitty() {
  const trip = state.activeTrip;
  if (!trip) return;
  const kitty = trip.kitty;
  const balance = Number(kitty?.balance) || 0;

  if (balance <= 0) {
    alert('There is no leftover balance in the kitty to refund.');
    return;
  }

  const perPerson = (balance / trip.members.length).toFixed(2);
  const msg = `🌴 *${trip.name} — Leftover Kitty Refund*\n\n` +
    `💰 *Remaining Pool Balance:* ₹${balance.toLocaleString('en-IN')}\n` +
    `👥 *Total Friends:* ${trip.members.length}\n` +
    `💸 *Fair Refund Per Friend:* ₹${perPerson} each\n\n` +
    `Treasurer has initiated UPI refunds. Hisaab Barabar! ✨\n#TripBarabar`;

  navigator.clipboard.writeText(msg).then(() => {
    fireConfetti();
    showToast(`✓ Refund calculated: ₹${perPerson}/friend copied to clipboard!`);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  }).catch(() => {
    prompt('Copy this refund message for your WhatsApp group:', msg);
  });
}

// ==================== 4. DAILY BUDGET PACE ENGINE ====================
function renderBudgetPaceCard() {
  const trip = state.activeTrip;
  const ratioEl = document.getElementById('budgetPaceTotalRatio');
  const barEl = document.getElementById('budgetPaceProgressBar');
  const forecastEl = document.getElementById('budgetPaceForecastText');
  if (!trip || !ratioEl) return;

  const budget = trip.budget || { total: 100000, days: 8, currency: 'INR' };
  const totalBudget = Number(budget.total) || 100000;
  const totalDays = Number(budget.days) || 8;

  const totalSpentHome = (trip.expenses || []).reduce((sum, exp) => {
    return sum + (Number(exp.convertedAmount) || (Number(exp.amount) * (trip.forexRate || 1)));
  }, 0);

  ratioEl.textContent = `₹${Math.round(totalSpentHome).toLocaleString('en-IN')} / ₹${totalBudget.toLocaleString('en-IN')}`;

  const pct = Math.max(0, Math.min(100, (totalSpentHome / totalBudget) * 100));
  if (barEl) {
    barEl.style.width = `${pct}%`;
    if (pct > 90) barEl.className = 'bg-red-500 h-1.5 rounded-full transition-all duration-300';
    else if (pct > 70) barEl.className = 'bg-amber-400 h-1.5 rounded-full transition-all duration-300';
    else barEl.className = 'bg-brand-500 h-1.5 rounded-full transition-all duration-300';
  }

  const distinctDays = Math.max(1, new Set((trip.expenses || []).map(e => e.date)).size);
  const burnRate = Math.round(totalSpentHome / distinctDays);
  const projected = Math.round(burnRate * totalDays);
  const diff = projected - totalBudget;

  if (forecastEl) {
    if (diff > 500) {
      forecastEl.innerHTML = `
        <span class="text-slate-400">Burn rate: ₹${burnRate.toLocaleString('en-IN')}/day</span>
        <span class="text-amber-400 font-semibold">Projected +₹${diff.toLocaleString('en-IN')} over budget ⚠️</span>
      `;
    } else {
      const under = Math.abs(diff);
      forecastEl.innerHTML = `
        <span class="text-slate-400">Burn rate: ₹${burnRate.toLocaleString('en-IN')}/day</span>
        <span class="text-emerald-400 font-semibold">On Track (₹${under.toLocaleString('en-IN')} under) 🎉</span>
      `;
    }
  }
}

function openBudgetModal() {
  const trip = state.activeTrip;
  if (!trip) return;
  const budget = trip.budget || { total: 100000, days: 8 };

  document.getElementById('inputTripBudgetTarget').value = budget.total || 100000;
  document.getElementById('inputTripDurationDays').value = budget.days || 8;

  openModal('modalBudgetSettings');
}

function saveTripBudgetSettings() {
  const trip = state.activeTrip;
  if (!trip) return;

  const total = Number(document.getElementById('inputTripBudgetTarget').value) || 100000;
  const days = Number(document.getElementById('inputTripDurationDays').value) || 8;

  trip.budget = { total, days, currency: 'INR' };
  saveTripsToStorage();
  closeModal('modalBudgetSettings');
  renderAll();
  showToast('✓ Trip budget target updated!');
}

// ==================== 5. BILATERAL UPI SETTLEMENT HANDSHAKE ====================
function handleUpiPayClick(fromId, toId, amount, upiUrl) {
  window.location.href = upiUrl;

  setTimeout(() => {
    if (confirm(`Did you complete your UPI payment of ₹${amount}?\n\nTap OK to record "I Have Paid" so the receiver can verify and confirm receipt.`)) {
      recordPendingUpiSettlement(fromId, toId, amount);
    }
  }, 1000);
}

function recordPendingUpiSettlement(fromId, toId, amount) {
  const trip = state.activeTrip;
  if (!trip) return;
  if (!trip.pendingSettlements) trip.pendingSettlements = [];

  const fromMember = trip.members.find(m => m.id === fromId);
  const toMember = trip.members.find(m => m.id === toId);

  const pending = {
    id: 'pend-' + Date.now(),
    fromId,
    toId,
    amount: Number(amount),
    timestamp: Date.now()
  };

  trip.pendingSettlements.push(pending);
  logActivity('settle', fromMember?.name || 'Friend', `Marked ₹${amount} paid to ${toMember?.name || 'Friend'} via UPI (Pending confirmation)`, 'fa-handshake');

  saveTripsToStorage();
  renderAll();
  showToast(`✓ Marked paid! Awaiting ${toMember?.name || 'Receiver'}'s confirmation.`);
}

function renderBilateralPendingContainer() {
  const trip = state.activeTrip;
  const container = document.getElementById('bilateralPendingContainer');
  if (!trip || !container) return;

  const pending = trip.pendingSettlements || [];
  if (pending.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <i class="fa-solid fa-clock-rotate-left animate-spin text-sm"></i>
          <span>Bilateral UPI Confirmations Pending (${pending.length})</span>
        </div>
        <span class="text-[10px] text-amber-400/80">Double-Verification</span>
      </div>

      <div class="space-y-2">
        ${pending.map(p => {
          const fromMember = trip.members.find(m => m.id === p.fromId) || { name: 'Payer' };
          const toMember = trip.members.find(m => m.id === p.toId) || { name: 'Receiver' };
          return `
            <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div>
                <div class="font-bold text-white">${escapeHtml(fromMember.name)} ➔ ${escapeHtml(toMember.name)}</div>
                <div class="text-[11px] text-amber-400 font-mono font-bold">₹${p.amount.toFixed(2)}</div>
                <div class="text-[9px] text-slate-400">Waiting for ${escapeHtml(toMember.name)} to confirm receipt</div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="confirmReceivedSettlement('${p.id}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] active-press flex items-center gap-1">
                  <i class="fa-solid fa-check"></i>
                  <span>Confirm Received</span>
                </button>
                <button onclick="disputeSettlement('${p.id}')" class="px-2 py-1.5 rounded-lg bg-slate-800 text-red-400 border border-slate-700 text-[11px] active-press" title="Dispute / Not received">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function confirmReceivedSettlement(pendingId) {
  const trip = state.activeTrip;
  if (!trip || !trip.pendingSettlements) return;

  const idx = trip.pendingSettlements.findIndex(p => p.id === pendingId);
  if (idx === -1) return;

  const p = trip.pendingSettlements[idx];
  trip.pendingSettlements.splice(idx, 1);

  if (!trip.settlements) trip.settlements = [];
  trip.settlements.push({
    id: 'stl-' + Date.now(),
    fromMemberId: p.fromId,
    toMemberId: p.toId,
    amount: p.amount,
    currency: trip.homeCurrency || 'INR',
    note: 'Bilateral UPI Confirmed',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  });

  const fromMember = trip.members.find(m => m.id === p.fromId);
  const toMember = trip.members.find(m => m.id === p.toId);
  logActivity('settle', toMember?.name || 'Receiver', `Confirmed receipt of ₹${p.amount} from ${fromMember?.name || 'Payer'}! Debt Cleared.`, 'fa-circle-check');

  saveTripsToStorage();
  renderAll();
  fireConfetti();
  showToast(`🎉 Settlement confirmed! ₹${p.amount} debt cleared.`);
}

function disputeSettlement(pendingId) {
  const trip = state.activeTrip;
  if (!trip || !trip.pendingSettlements) return;

  if (!confirm('Mark this payment as not received / disputed? The debt will remain active.')) return;

  const idx = trip.pendingSettlements.findIndex(p => p.id === pendingId);
  if (idx !== -1) {
    const p = trip.pendingSettlements[idx];
    trip.pendingSettlements.splice(idx, 1);
    logActivity('dispute', 'Friend', `Disputed unverified payment of ₹${p.amount}`, 'fa-triangle-exclamation');
    saveTripsToStorage();
    renderAll();
    showToast('Payment marked as unreceived. Debt remains open.');
  }
}

// ==================== 6. HINGLISH PAYMENT REMINDERS (NUDGES) ====================
let currentNudge = {
  debtorId: null,
  creditorId: null,
  amount: 0,
  tone: 'filmy'
};

function openNudgeModal(debtorId, creditorId, amount) {
  currentNudge = {
    debtorId,
    creditorId,
    amount: Number(amount),
    tone: 'filmy'
  };

  const trip = state.activeTrip;
  const debtor = trip?.members.find(m => m.id === debtorId) || { name: 'Friend' };
  const creditor = trip?.members.find(m => m.id === creditorId) || { name: 'Friend', upi: 'upi@bank' };

  document.getElementById('nudgeAmountText').textContent = `₹${currentNudge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('nudgeRecipientText').textContent = debtor.name;

  setNudgeTone('filmy');
  openModal('modalPaymentNudge');
}

function setNudgeTone(tone) {
  currentNudge.tone = tone;
  ['filmy', 'cheeky', 'polite', 'urgent'].forEach(t => {
    const btn = document.getElementById(`btnTone-${t}`);
    if (btn) {
      if (t === tone) {
        btn.className = 'py-2 px-2.5 rounded-xl border border-brand-500/50 bg-brand-500/15 text-brand-300 text-left active-press font-bold';
      } else {
        btn.className = 'py-2 px-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-left active-press';
      }
    }
  });

  const trip = state.activeTrip;
  const debtor = trip?.members.find(m => m.id === currentNudge.debtorId) || { name: 'Bhai' };
  const creditor = trip?.members.find(m => m.id === currentNudge.creditorId) || { name: 'Dost', upi: 'payment@upi' };
  const amt = currentNudge.amount.toFixed(2);
  const tripTitle = trip?.name || 'Trip';

  let msg = '';
  if (tone === 'filmy') {
    msg = `Oye ${debtor.name}! 🎬 Babu Bhaiya ne kaha tha - "Hisaab me koi sharam nahi, hisaab barabar chahiye!" Apne ${tripTitle} ka ₹${amt} baaki hai. Jaldi GPay/PhonePe kar de is UPI pe: ${creditor.upi}! 🚀`;
  } else if (tone === 'cheeky') {
    msg = `Bhai ${debtor.name}, trip pe cocktails aur moj-masti karne me sabse aage the, ab hisaab dene me sanyasi ban gaye kya? 😂 ₹${amt} pending hai tera. Fatafat settle kar de is UPI pe: ${creditor.upi}!`;
  } else if (tone === 'polite') {
    msg = `Hey ${debtor.name}! Hope you're doing great. A quick friendly reminder regarding our ${tripTitle} expenses. Your balance is ₹${amt}. Whenever you get a moment, please UPI to ${creditor.upi}. Thanks a ton! 🙏`;
  } else if (tone === 'urgent') {
    msg = `🚨 FINAL CALL ${debtor.name}: Clear ₹${amt} for ${tripTitle} today on UPI: ${creditor.upi} warna agle trip me car me sabse peeche bithaayenge aur AC band kar denge! 🚗💨`;
  }

  document.getElementById('nudgeMessageText').value = msg;
}

function sendNudgeViaWhatsApp() {
  const trip = state.activeTrip;
  const debtor = trip?.members.find(m => m.id === currentNudge.debtorId);
  const msg = document.getElementById('nudgeMessageText').value;

  const phone = debtor?.phone ? debtor.phone.replace(/[^0-9]/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
  closeModal('modalPaymentNudge');
  showToast('🚀 WhatsApp opened with your reminder!');
}

// ==================== 7. ROAD TRIP FUEL & TOLL CALCULATOR ====================
function openRoadTripModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  const driverSelect = document.getElementById('selectRoadDriver');
  if (driverSelect) {
    driverSelect.innerHTML = trip.members.map(m => `
      <option value="${m.id}">${escapeHtml(m.name)}</option>
    `).join('');
  }

  const passList = document.getElementById('roadTripPassengersList');
  if (passList) {
    passList.innerHTML = trip.members.map(m => `
      <label class="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] cursor-pointer">
        <input type="checkbox" id="roadPass_${m.id}" checked onchange="calculateRoadTrip()" class="w-3.5 h-3.5 rounded text-sky-500 bg-slate-900 border-slate-700">
        <span class="truncate text-white font-semibold">${escapeHtml(m.name)}</span>
      </label>
    `).join('');
  }

  calculateRoadTrip();
  openModal('modalRoadTrip');
}

function calculateRoadTrip() {
  const dist = Number(document.getElementById('inputRoadDistance')?.value) || 0;
  const mileage = Number(document.getElementById('inputRoadMileage')?.value) || 15;
  const fuelPrice = Number(document.getElementById('inputRoadFuelPrice')?.value) || 96.5;
  const tolls = Number(document.getElementById('inputRoadTolls')?.value) || 0;
  const misc = Number(document.getElementById('inputRoadMisc')?.value) || 0;
  const isDriverExempt = document.getElementById('chkDriverExempt')?.checked;
  const driverId = document.getElementById('selectRoadDriver')?.value;

  const litres = mileage > 0 ? (dist / mileage) : 0;
  const fuelCost = litres * fuelPrice;
  const totalCost = fuelCost + tolls + misc;

  const trip = state.activeTrip;
  let selectedPass = [];
  trip?.members.forEach(m => {
    const cb = document.getElementById(`roadPass_${m.id}`);
    if (cb && cb.checked) selectedPass.push(m.id);
  });

  let payingCount = selectedPass.length;
  if (isDriverExempt && selectedPass.includes(driverId) && payingCount > 1) {
    payingCount -= 1;
  }

  const perPerson = payingCount > 0 ? (totalCost / payingCount) : 0;

  document.getElementById('roadTripTotalCost').textContent = `₹${Math.round(totalCost).toLocaleString('en-IN')}`;
  document.getElementById('roadTripPerPassenger').textContent = `₹${Math.round(perPerson).toLocaleString('en-IN')} / passenger (${payingCount} paying)`;
}

function saveRoadTripExpense() {
  const trip = state.activeTrip;
  if (!trip) return;

  const dist = Number(document.getElementById('inputRoadDistance')?.value) || 0;
  const mileage = Number(document.getElementById('inputRoadMileage')?.value) || 15;
  const fuelPrice = Number(document.getElementById('inputRoadFuelPrice')?.value) || 96.5;
  const tolls = Number(document.getElementById('inputRoadTolls')?.value) || 0;
  const misc = Number(document.getElementById('inputRoadMisc')?.value) || 0;
  const isDriverExempt = document.getElementById('chkDriverExempt')?.checked;
  const driverId = document.getElementById('selectRoadDriver')?.value;

  const litres = mileage > 0 ? (dist / mileage) : 0;
  const fuelCost = litres * fuelPrice;
  const totalCost = Math.round(fuelCost + tolls + misc);

  let selectedPass = [];
  trip.members.forEach(m => {
    const cb = document.getElementById(`roadPass_${m.id}`);
    if (cb && cb.checked) selectedPass.push(m.id);
  });

  let payingPassengers = [...selectedPass];
  if (isDriverExempt && payingPassengers.includes(driverId) && payingPassengers.length > 1) {
    payingPassengers = payingPassengers.filter(id => id !== driverId);
  }

  if (payingPassengers.length === 0) {
    alert('Please select at least 1 paying passenger.');
    return;
  }

  const expObj = {
    id: 'exp-' + Date.now(),
    title: `Road Trip Fuel & Tolls (${dist} km)`,
    amount: totalCost,
    currency: trip.homeCurrency || 'INR',
    convertedAmount: totalCost,
    categoryId: 'cabs',
    paidBy: [{ memberId: driverId, amount: totalCost }],
    sharedWith: payingPassengers,
    splitMode: 'equal',
    date: new Date().toISOString().split('T')[0],
    receipt: null,
    createdAt: Date.now()
  };

  trip.expenses.push(expObj);
  logActivity('expense', trip.members.find(m => m.id === driverId)?.name || 'Driver', `Logged Road Trip expense: ₹${totalCost} for ${dist} km`, 'fa-car');

  saveTripsToStorage();
  closeModal('modalRoadTrip');
  renderAll();
  fireConfetti();
  showToast(`🚗 Added Road Trip expense: ₹${totalCost} split across ${payingPassengers.length} friends!`);
}

// ==================== 8. INDIAN BILL & RECEIPT ITEMIZER ====================
let billItemRows = [];

function openBillItemizerModal() {
  billItemRows = [
    { name: 'Butter Chicken & Gravy', price: 650, members: [] },
    { name: 'Garlic Naans (8 pcs)', price: 320, members: [] },
    { name: 'Chang Beers & Cocktails', price: 1400, members: [] }
  ];

  const trip = state.activeTrip;
  if (trip && trip.members.length > 0) {
    billItemRows[0].members = trip.members.map(m => m.id);
    billItemRows[1].members = trip.members.map(m => m.id);
    billItemRows[2].members = trip.members.slice(0, 5).map(m => m.id);
  }

  renderBillItemRows();
  calculateItemizedBill();
  openModal('modalBillItemizer');
}

function addBillItemRow() {
  const trip = state.activeTrip;
  billItemRows.push({
    name: 'New Item',
    price: 300,
    members: trip ? trip.members.map(m => m.id) : []
  });
  renderBillItemRows();
  calculateItemizedBill();
}

function removeBillItemRow(idx) {
  billItemRows.splice(idx, 1);
  renderBillItemRows();
  calculateItemizedBill();
}

function renderBillItemRows() {
  const trip = state.activeTrip;
  const container = document.getElementById('billItemRowsContainer');
  if (!container || !trip) return;

  container.innerHTML = billItemRows.map((row, idx) => `
    <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
      <div class="flex items-center gap-2">
        <input type="text" value="${escapeHtml(row.name)}" oninput="billItemRows[${idx}].name = this.value; calculateItemizedBill()" placeholder="Dish / Drink name"
          class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold text-xs">
        <div class="flex items-center gap-1 w-28">
          <span class="text-slate-400">₹</span>
          <input type="number" value="${row.price}" oninput="billItemRows[${idx}].price = Number(this.value) || 0; calculateItemizedBill()" placeholder="Price"
            class="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-xs">
        </div>
        <button type="button" onclick="removeBillItemRow(${idx})" class="w-6 h-6 rounded-lg bg-slate-800 text-red-400 hover:text-white flex items-center justify-center shrink-0">
          ✕
        </button>
      </div>

      <div class="text-[10px] text-slate-400">Shared by:</div>
      <div class="flex items-center gap-1 flex-wrap">
        ${trip.members.map(m => {
          const isSelected = row.members.includes(m.id);
          return `
            <button type="button" onclick="toggleBillItemMember(${idx}, '${m.id}')"
              class="px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${isSelected ? 'bg-brand-500/20 text-brand-300 border-brand-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}">
              ${escapeHtml(m.name)}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleBillItemMember(rowIdx, memberId) {
  const row = billItemRows[rowIdx];
  if (!row) return;
  if (row.members.includes(memberId)) {
    row.members = row.members.filter(id => id !== memberId);
  } else {
    row.members.push(memberId);
  }
  renderBillItemRows();
  calculateItemizedBill();
}

function calculateItemizedBill() {
  const trip = state.activeTrip;
  const breakdownContainer = document.getElementById('billItemizedBreakdownContainer');
  if (!trip || !breakdownContainer) return;

  const gstPct = Number(document.getElementById('inputBillGst')?.value) || 0;
  const srvPct = Number(document.getElementById('inputBillService')?.value) || 0;

  const memberSubtotals = {};
  trip.members.forEach(m => { memberSubtotals[m.id] = 0; });

  let itemsSubtotal = 0;
  billItemRows.forEach(row => {
    const price = Number(row.price) || 0;
    itemsSubtotal += price;
    if (row.members.length > 0) {
      const perHead = price / row.members.length;
      row.members.forEach(mId => {
        if (memberSubtotals[mId] !== undefined) memberSubtotals[mId] += perHead;
      });
    }
  });

  const gstTotal = (itemsSubtotal * gstPct) / 100;
  const srvTotal = (itemsSubtotal * srvPct) / 100;
  const grandTotal = itemsSubtotal + gstTotal + srvTotal;

  const memberTotals = {};
  trip.members.forEach(m => {
    const sub = memberSubtotals[m.id];
    const ratio = itemsSubtotal > 0 ? (sub / itemsSubtotal) : 0;
    const taxShare = (gstTotal + srvTotal) * ratio;
    memberTotals[m.id] = sub + taxShare;
  });

  breakdownContainer.innerHTML = `
    <div class="flex items-center justify-between font-bold text-xs text-slate-200 border-b border-slate-800 pb-1.5">
      <span>Grand Total: ₹${Math.round(grandTotal).toLocaleString('en-IN')}</span>
      <span class="text-[10px] text-slate-400">Subtotal ₹${Math.round(itemsSubtotal)} + Tax/Srv ₹${Math.round(gstTotal + srvTotal)}</span>
    </div>
    <div class="space-y-1 pt-1 max-h-36 overflow-y-auto">
      ${trip.members.map(m => {
        const amt = memberTotals[m.id] || 0;
        if (amt <= 0.05) return '';
        return `
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-300">${escapeHtml(m.name)}:</span>
            <span class="font-bold text-amber-300 font-mono">₹${amt.toFixed(2)}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function saveItemizedBillToLedger() {
  const trip = state.activeTrip;
  if (!trip) return;

  const gstPct = Number(document.getElementById('inputBillGst')?.value) || 0;
  const srvPct = Number(document.getElementById('inputBillService')?.value) || 0;

  let itemsSubtotal = 0;
  const memberSubtotals = {};
  trip.members.forEach(m => { memberSubtotals[m.id] = 0; });

  billItemRows.forEach(row => {
    const price = Number(row.price) || 0;
    itemsSubtotal += price;
    if (row.members.length > 0) {
      const perHead = price / row.members.length;
      row.members.forEach(mId => {
        if (memberSubtotals[mId] !== undefined) memberSubtotals[mId] += perHead;
      });
    }
  });

  const gstTotal = (itemsSubtotal * gstPct) / 100;
  const srvTotal = (itemsSubtotal * srvPct) / 100;
  const grandTotal = Math.round(itemsSubtotal + gstTotal + srvTotal);

  const exactSplits = {};
  const sharedWith = [];
  trip.members.forEach(m => {
    const sub = memberSubtotals[m.id];
    const ratio = itemsSubtotal > 0 ? (sub / itemsSubtotal) : 0;
    const totalHead = Math.round((sub + (gstTotal + srvTotal) * ratio) * 100) / 100;
    if (totalHead > 0.05) {
      exactSplits[m.id] = totalHead;
      sharedWith.push(m.id);
    }
  });

  const expObj = {
    id: 'exp-' + Date.now(),
    title: 'Itemized Dinner & Drinks Bill',
    amount: grandTotal,
    currency: trip.homeCurrency || 'INR',
    convertedAmount: grandTotal,
    categoryId: 'food',
    paidBy: [{ memberId: trip.members[0].id, amount: grandTotal }],
    sharedWith,
    splitMode: 'exact',
    exactSplits,
    date: new Date().toISOString().split('T')[0],
    receipt: null,
    createdAt: Date.now()
  };

  trip.expenses.push(expObj);
  logActivity('expense', trip.members[0].name, `Itemized Bill: ₹${grandTotal} logged with proportional taxes`, 'fa-receipt');

  saveTripsToStorage();
  closeModal('modalBillItemizer');
  renderAll();
  fireConfetti();
  showToast(`🧾 Itemized bill of ₹${grandTotal} saved to ledger!`);
}

// ==================== RECEIPT OCR SCANNER & SMART PARSER ====================
function togglePasteReceiptBox() {
  const box = document.getElementById('ocrPasteBox');
  if (box) box.classList.toggle('hidden');
}

function loadSampleReceipt() {
  const sample = `Phuket Seaside Seafood & Grill
Table 12 - 9 Pax
1 Garlic Butter Tiger Prawns  1200
2 Steamed Sea Bass Lime & Chili 980
3 Tom Yum Goong (Hot Pot)      450
4 Pineapple Fried Rice XL      350
4 Singha Draught Pitchers      1400
1 Tropical Fruit Platter       220
Subtotal                       4600
VAT 7%                          322
Service Charge 10%              460
Total Amount                   5382
Thank you! Enjoy Thailand!`;

  const input = document.getElementById('receiptTextInput');
  if (input) input.value = sample;
  showToast('✓ Sample Phuket receipt loaded. Tap Extract to process!');
}

function parsePastedReceipt() {
  const input = document.getElementById('receiptTextInput');
  if (!input || !input.value.trim()) {
    showToast('⚠️ Please paste or type bill text first');
    return;
  }
  parseReceiptTextIntoRows(input.value);
  const box = document.getElementById('ocrPasteBox');
  if (box) box.classList.add('hidden');
}

async function handleReceiptScan(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  const progressBox = document.getElementById('ocrProgressBox');
  const progressBar = document.getElementById('ocrProgressBar');
  const progressStatus = document.getElementById('ocrProgressStatus');

  if (progressBox) progressBox.classList.remove('hidden');
  if (progressBar) progressBar.style.width = '20%';
  if (progressStatus) progressStatus.textContent = 'Reading receipt photo...';

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    state.tempReceiptBase64 = base64Data; // Save photo for attachment

    try {
      if (progressBar) progressBar.style.width = '45%';
      if (progressStatus) progressStatus.textContent = 'Enhancing image contrast for OCR...';

      // Load Tesseract.js dynamically if not yet on window
      if (!window.Tesseract) {
        if (progressStatus) progressStatus.textContent = 'Loading AI OCR engine...';
        await loadTesseractScript();
      }

      if (progressBar) progressBar.style.width = '70%';
      if (progressStatus) progressStatus.textContent = 'Recognizing items, dishes and prices...';

      const result = await window.Tesseract.recognize(base64Data, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text' && m.progress) {
            const pct = Math.round(70 + m.progress * 25);
            if (progressBar) progressBar.style.width = `${pct}%`;
          }
        }
      });

      if (progressBar) progressBar.style.width = '100%';
      if (progressStatus) progressStatus.textContent = 'Done! Populating items...';

      const text = result?.data?.text || '';
      parseReceiptTextIntoRows(text);

      setTimeout(() => {
        if (progressBox) progressBox.classList.add('hidden');
      }, 600);

    } catch (err) {
      console.warn('Tesseract OCR error:', err);
      if (progressStatus) progressStatus.textContent = 'OCR service offline. Switching to smart parser...';
      
      // Fallback: Show paste box and toast
      setTimeout(() => {
        if (progressBox) progressBox.classList.add('hidden');
        togglePasteReceiptBox();
        showToast('💡 Photo saved! You can also paste bill lines or use sample bill.');
      }, 1000);
    }
  };

  reader.readAsDataURL(file);
}

function loadTesseractScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Tesseract.js'));
    document.head.appendChild(script);
  });
}

function parseReceiptTextIntoRows(rawText) {
  if (!rawText || !rawText.trim()) {
    showToast('⚠️ No readable text found in bill');
    return;
  }

  const trip = state.activeTrip;
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const extracted = [];
  let detectedGst = null;
  let detectedService = null;

  lines.forEach(line => {
    const lower = line.toLowerCase();

    // Check for tax / VAT
    if (lower.includes('gst') || lower.includes('vat') || lower.includes('tax') || lower.includes('cgst') || lower.includes('sgst')) {
      const match = line.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) detectedGst = (detectedGst || 0) + parseFloat(match[1]);
      return;
    }

    // Check for service charge
    if (lower.includes('service') || lower.includes('srv chg') || lower.includes('sc')) {
      const match = line.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) detectedService = parseFloat(match[1]);
      return;
    }

    // Filter noise
    if (lower.includes('total') || lower.includes('subtotal') || lower.includes('balance') ||
        lower.includes('cash') || lower.includes('visa') || lower.includes('mastercard') ||
        lower.includes('thank you') || lower.includes('invoice') || lower.includes('bill no') ||
        lower.includes('table') || lower.includes('date') || lower.includes('pax')) {
      return;
    }

    // Match item + price
    const match = line.match(/(.*?)(?:[\s:xX]+)([0-9]+(?:[\.,][0-9]{2})?)\s*$/);
    if (match) {
      let name = match[1].replace(/^[0-9]+[\s\.\-]+/, '').trim();
      let price = parseFloat(match[2].replace(',', '.'));
      if (name.length >= 2 && !isNaN(price) && price > 0 && price < 500000) {
        name = name.replace(/^[\*\-\•\#\d\s]+/, '').trim();
        extracted.push({
          name: name || 'Dish ' + (extracted.length + 1),
          price: Math.round(price),
          members: trip ? trip.members.map(m => m.id) : []
        });
      }
    }
  });

  if (extracted.length > 0) {
    billItemRows = extracted;
    if (detectedGst !== null) {
      const g = document.getElementById('inputBillGst');
      if (g) g.value = detectedGst;
    }
    if (detectedService !== null) {
      const s = document.getElementById('inputBillService');
      if (s) s.value = detectedService;
    }
    renderBillItemRows();
    calculateItemizedBill();
    SoundEffects.playCoin();
    showToast(`✓ Auto-extracted ${extracted.length} dishes & items from bill!`);
  } else {
    showToast('⚠️ Could not isolate dishes. Try pasting text or adjust photo.');
  }
}

// ==================== FLIGHTS, VILLAS & ITINERARY PLANNER ====================
function ensureItinerarySeeded(trip) {
  if (!trip) return;
  if (!trip.itinerary || trip.itinerary.length === 0) {
    trip.itinerary = [
      {
        id: 'itin-1',
        category: 'flight',
        icon: '✈️',
        title: 'Indigo Delhi ⇄ Phuket Roundtrip Non-Stop',
        bookingRef: '6E-1082 / PNR: K9X7W2',
        dates: 'Oct 15 - Oct 23, 2026',
        cost: 216000,
        advancePaid: 216000,
        remainingDue: 0,
        bookedBy: trip.members[0]?.id || 'm1',
        splitWith: (trip.members || []).map(m => m.id),
        status: 'confirmed',
        notes: 'Includes 20kg baggage + standard group meals'
      },
      {
        id: 'itin-2',
        category: 'stay',
        icon: '🏨',
        title: 'Rawai Sea View Luxury Pool Villa (4 Nights)',
        bookingRef: 'Airbnb #HM892K1',
        dates: 'Oct 16 - Oct 20, 2026',
        cost: 72000,
        advancePaid: 36000,
        remainingDue: 36000,
        bookedBy: trip.members[0]?.id || 'm1',
        splitWith: (trip.members || []).map(m => m.id),
        status: 'deposit_paid',
        notes: '4 Master suites, private pool, ocean view, remaining due on check-in'
      },
      {
        id: 'itin-3',
        category: 'activity',
        icon: '🚤',
        title: 'Phi Phi Islands Private Speedboat Charter',
        bookingRef: 'Phuket Marina Pier 3',
        dates: 'Oct 18, 2026',
        cost: 18500,
        advancePaid: 5000,
        remainingDue: 13500,
        bookedBy: trip.members[1]?.id || 'm2',
        splitWith: (trip.members || []).map(m => m.id),
        status: 'deposit_paid',
        notes: 'Maya Bay, Monkey Beach, snorkeling kits included'
      }
    ];
    saveTripsToStorage();
  }
}

function openTripItineraryModal() {
  const trip = state.activeTrip;
  if (!trip) return;

  ensureItinerarySeeded(trip);

  const itinerary = trip.itinerary || [];
  let totalBookings = 0;
  let advancePaid = 0;
  let remainingDue = 0;

  itinerary.forEach(item => {
    const cost = Number(item.cost) || 0;
    const adv = Number(item.advancePaid) || 0;
    totalBookings += cost;
    advancePaid += adv;
    remainingDue += Math.max(0, cost - adv);
  });

  const sym = trip.currencySymbol || '₹';
  const totalEl = document.getElementById('itineraryTotalVal');
  const paidEl = document.getElementById('itineraryPaidVal');
  const dueEl = document.getElementById('itineraryDueVal');

  if (totalEl) totalEl.textContent = `${sym}${totalBookings.toLocaleString('en-IN')}`;
  if (paidEl) paidEl.textContent = `${sym}${advancePaid.toLocaleString('en-IN')}`;
  if (dueEl) dueEl.textContent = `${sym}${remainingDue.toLocaleString('en-IN')}`;

  renderItineraryList();
  openModal('modalTripItinerary');
}

function renderItineraryList() {
  const trip = state.activeTrip;
  const container = document.getElementById('itineraryListContainer');
  if (!trip || !container) return;

  const itinerary = trip.itinerary || [];
  if (itinerary.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 text-xs">
        No flights or hotel bookings added yet. Tap below to log one!
      </div>
    `;
    return;
  }

  container.innerHTML = itinerary.map((item, idx) => {
    const cost = Number(item.cost) || 0;
    const adv = Number(item.advancePaid) || 0;
    const due = Math.max(0, cost - adv);
    const sym = trip.currencySymbol || '₹';
    const payer = trip.members.find(m => m.id === item.bookedBy)?.name || 'Friend';
    const perHead = Math.round(cost / Math.max(1, (item.splitWith || []).length));

    return `
      <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-xl shrink-0">
              ${item.icon || '✈️'}
            </div>
            <div>
              <div class="text-xs font-bold text-white">${escapeHtml(item.title)}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">
                ${escapeHtml(item.bookingRef || '')} • ${escapeHtml(item.dates || '')}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <div class="font-mono text-xs font-black text-white">
              ${sym}${cost.toLocaleString('en-IN')}
            </div>
            <div class="text-[10px] text-brand-400 font-mono">
              ${sym}${perHead.toLocaleString('en-IN')}/person
            </div>
          </div>
        </div>

        <!-- Status & Due Pill Row -->
        <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
          <div class="flex items-center gap-1.5">
            <span class="text-slate-400">Booked by:</span>
            <span class="font-bold text-slate-200">${escapeHtml(payer)}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md font-bold text-[10px] ${
              due === 0 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }">
              ${due === 0 ? '✓ Fully Paid' : `Due: ${sym}${due.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        <!-- Action Row -->
        <div class="flex items-center justify-between pt-1">
          <span class="text-[10px] text-slate-500">
            Split across ${(item.splitWith || []).length} friends
          </span>
          <div class="flex items-center gap-1.5">
            <button onclick="pushItineraryToExpenses('${item.id}')" 
              class="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold hover:bg-sky-500/30 active-press">
              <i class="fa-solid fa-receipt mr-1"></i> Push to Ledger
            </button>
            <button onclick="deleteItineraryBooking('${item.id}')" 
              class="p-1 rounded-lg text-slate-500 hover:text-rose-400 active-press" title="Delete Booking">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddItineraryForm() {
  const trip = state.activeTrip;
  if (!trip) return;

  const select = document.getElementById('itinBookedBy');
  if (select) {
    select.innerHTML = trip.members.map(m => `
      <option value="${m.id}">${escapeHtml(m.name)}</option>
    `).join('');
  }

  // Reset fields
  document.getElementById('itinTitle').value = '';
  document.getElementById('itinRef').value = '';
  document.getElementById('itinDates').value = '';
  document.getElementById('itinCost').value = '';
  document.getElementById('itinAdvance').value = '';
  document.getElementById('itinRemainingPreview').textContent = '₹0';
  selectItinCategory('flight', '✈️');

  openModal('modalAddItineraryBooking');
}

function selectItinCategory(cat, icon) {
  document.getElementById('itinCategory').value = cat;
  document.getElementById('itinCategoryIcon').value = icon;

  const cats = ['flight', 'stay', 'activity', 'transport'];
  cats.forEach(c => {
    const btn = document.getElementById('itinCatBtn-' + c);
    if (btn) {
      if (c === cat) {
        btn.className = 'py-1.5 rounded-lg border text-center font-bold bg-sky-500/20 text-sky-300 border-sky-500';
      } else {
        btn.className = 'py-1.5 rounded-lg border text-center font-bold bg-slate-950 text-slate-400 border-slate-800';
      }
    }
  });
}

function autoUpdateItinDue() {
  const trip = state.activeTrip;
  const cost = Number(document.getElementById('itinCost')?.value) || 0;
  const adv = Number(document.getElementById('itinAdvance')?.value) || 0;
  const due = Math.max(0, cost - adv);
  const sym = trip ? (trip.currencySymbol || '₹') : '₹';
  const preview = document.getElementById('itinRemainingPreview');
  if (preview) preview.textContent = `${sym}${due.toLocaleString('en-IN')}`;
}

function confirmSaveItineraryBooking() {
  const trip = state.activeTrip;
  if (!trip) return;

  const title = document.getElementById('itinTitle')?.value?.trim();
  const cost = Number(document.getElementById('itinCost')?.value) || 0;
  if (!title || cost <= 0) {
    showToast('⚠️ Please enter booking title and total cost');
    return;
  }

  const category = document.getElementById('itinCategory')?.value || 'flight';
  const icon = document.getElementById('itinCategoryIcon')?.value || '✈️';
  const ref = document.getElementById('itinRef')?.value?.trim() || '';
  const dates = document.getElementById('itinDates')?.value?.trim() || 'Upcoming';
  const advance = Number(document.getElementById('itinAdvance')?.value) || 0;
  const bookedBy = document.getElementById('itinBookedBy')?.value || trip.members[0].id;
  const pushToLedger = document.getElementById('itinPushToLedger')?.checked;

  const booking = {
    id: 'itin-' + Date.now(),
    category,
    icon,
    title,
    bookingRef: ref,
    dates,
    cost,
    advancePaid: advance,
    remainingDue: Math.max(0, cost - advance),
    bookedBy,
    splitWith: trip.members.map(m => m.id),
    status: advance >= cost ? 'confirmed' : 'deposit_paid'
  };

  trip.itinerary = trip.itinerary || [];
  trip.itinerary.push(booking);

  if (pushToLedger && advance > 0) {
    const payerName = trip.members.find(m => m.id === bookedBy)?.name || 'Friend';
    trip.expenses.push({
      id: 'exp-' + Date.now(),
      title: `${icon} ${title} (Pre-Trip Booking)`,
      amount: advance,
      currency: trip.baseCurrency,
      convertedAmount: Math.round(advance * (trip.forexRate || 1)),
      categoryId: category === 'stay' ? 'hotel' : 'transport',
      paidBy: [{ memberId: bookedBy, amount: advance }],
      sharedWith: trip.members.map(m => m.id),
      splitMode: 'equal',
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    });
    logActivity('expense', payerName, `Booked ${title} (Paid ${trip.currencySymbol}${advance})`, 'fa-plane');
  }

  saveTripsToStorage();
  closeModal('modalAddItineraryBooking');
  openTripItineraryModal();
  renderAll();
  SoundEffects.playCoin();
  showToast(`✓ Booking saved to itinerary!`);
}

function pushItineraryToExpenses(itinId) {
  const trip = state.activeTrip;
  if (!trip) return;

  const booking = (trip.itinerary || []).find(i => i.id === itinId);
  if (!booking) return;

  const amtToPush = booking.advancePaid > 0 ? booking.advancePaid : booking.cost;
  const payerName = trip.members.find(m => m.id === booking.bookedBy)?.name || 'Friend';

  trip.expenses.push({
    id: 'exp-' + Date.now(),
    title: `${booking.icon || '✈️'} ${booking.title}`,
    amount: amtToPush,
    currency: trip.baseCurrency,
    convertedAmount: Math.round(amtToPush * (trip.forexRate || 1)),
    categoryId: booking.category === 'stay' ? 'hotel' : 'transport',
    paidBy: [{ memberId: booking.bookedBy, amount: amtToPush }],
    sharedWith: booking.splitWith || trip.members.map(m => m.id),
    splitMode: 'equal',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  });

  logActivity('expense', payerName, `Pushed booking to ledger: ${booking.title}`, 'fa-receipt');
  saveTripsToStorage();
  renderAll();
  SoundEffects.playCoin();
  showToast(`✓ ${booking.title} added to live expenses ledger!`);
}

function deleteItineraryBooking(itinId) {
  const trip = state.activeTrip;
  if (!trip) return;
  if (!confirm('Remove this booking from itinerary?')) return;

  trip.itinerary = (trip.itinerary || []).filter(i => i.id !== itinId);
  saveTripsToStorage();
  openTripItineraryModal();
  showToast('✓ Booking removed');
}

// ==================== 9. TRIP WRAPPED (SPOTIFY WRAPPED STORY) ====================
let currentWrappedSlide = 0;
const TOTAL_WRAPPED_SLIDES = 5;

function openTripWrappedModal() {
  currentWrappedSlide = 0;
  renderWrappedSlide(0);
  openModal('modalTripWrapped');
}

function nextWrappedSlide() {
  if (currentWrappedSlide < TOTAL_WRAPPED_SLIDES - 1) {
    currentWrappedSlide++;
    renderWrappedSlide(currentWrappedSlide);
  } else {
    closeModal('modalTripWrapped');
  }
}

function prevWrappedSlide() {
  if (currentWrappedSlide > 0) {
    currentWrappedSlide--;
    renderWrappedSlide(currentWrappedSlide);
  }
}

function renderWrappedSlide(slideIdx) {
  const trip = state.activeTrip;
  const container = document.getElementById('wrappedSlideContainer');
  const btnNext = document.getElementById('btnNextWrapped');
  const btnDownload = document.getElementById('btnDownloadWrappedPoster');
  if (!trip || !container) return;

  for (let i = 0; i < TOTAL_WRAPPED_SLIDES; i++) {
    const fill = document.getElementById(`storyFill-${i}`);
    if (fill) {
      if (i < slideIdx) fill.className = 'story-progress-fill completed';
      else if (i === slideIdx) fill.className = 'story-progress-fill completed';
      else fill.className = 'story-progress-fill';
    }
  }

  if (slideIdx === TOTAL_WRAPPED_SLIDES - 1) {
    if (btnDownload) btnDownload.classList.remove('hidden');
    if (btnNext) btnNext.textContent = 'Finish ✨';
  } else {
    if (btnDownload) btnDownload.classList.add('hidden');
    if (btnNext) btnNext.textContent = 'Next ▶';
  }

  const totalPrimary = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (exp.amount * (trip.forexRate || 1))), 0);
  const distinctDays = Math.max(1, new Set((trip.expenses || []).map(e => e.date)).size);

  if (slideIdx === 0) {
    container.innerHTML = `
      <div class="space-y-4 animate-fade-in text-center">
        <div class="inline-flex p-4 rounded-3xl bg-purple-500/20 text-purple-300 text-4xl mb-1 shadow-lg">
          🌴
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-purple-400 block">${escapeHtml(trip.name)}</span>
        <h2 class="text-3xl font-black text-white">THE TRIP WRAPPED</h2>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 max-w-xs mx-auto">
          <div class="text-[11px] text-slate-400">Total Group Spending:</div>
          <div class="text-3xl font-black text-amber-400 font-mono-num">
            ₹${Math.round(totalHome).toLocaleString('en-IN')}
          </div>
          <div class="text-xs text-brand-300 font-mono font-bold">
            (${trip.currencySymbol}${Math.round(totalPrimary).toLocaleString()} ${trip.baseCurrency})
          </div>
          <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            ${trip.members.length} Friends • ${distinctDays} Days • ${trip.expenses.length} Spends
          </div>
        </div>
      </div>
    `;
  } else if (slideIdx === 1) {
    const daySpends = {};
    (trip.expenses || []).forEach(e => {
      const d = e.date || 'Day 1';
      daySpends[d] = (daySpends[d] || 0) + (Number(e.convertedAmount) || (Number(e.amount) * (trip.forexRate || 1)));
    });
    let peakDay = 'Day 1';
    let peakAmt = 0;
    Object.entries(daySpends).forEach(([d, amt]) => {
      if (amt > peakAmt) {
        peakAmt = amt;
        peakDay = d;
      }
    });

    container.innerHTML = `
      <div class="space-y-4 animate-fade-in text-center">
        <div class="inline-flex p-4 rounded-3xl bg-amber-500/20 text-amber-300 text-4xl mb-1 shadow-lg">
          ⚡
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-amber-400 block">The Wildest Day</span>
        <h2 class="text-2xl font-black text-white">${escapeHtml(peakDay)}</h2>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 max-w-xs mx-auto">
          <div class="text-2xl font-black text-amber-400 font-mono-num">
            ₹${Math.round(peakAmt).toLocaleString('en-IN')}
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Your single heaviest spending spree! The drinks flowed, cabs zipped, and wallet damage was legendary.
          </p>
        </div>
      </div>
    `;
  } else if (slideIdx === 2) {
    const catSpends = {};
    (trip.expenses || []).forEach(e => {
      catSpends[e.categoryId] = (catSpends[e.categoryId] || 0) + (Number(e.convertedAmount) || (Number(e.amount) * (trip.forexRate || 1)));
    });
    let topCatId = 'drinks';
    let topCatAmt = 0;
    Object.entries(catSpends).forEach(([c, amt]) => {
      if (amt > topCatAmt) {
        topCatAmt = amt;
        topCatId = c;
      }
    });
    const catInfo = getCategoryInfo(topCatId);
    const catPct = totalHome > 0 ? Math.round((topCatAmt / totalHome) * 100) : 0;

    container.innerHTML = `
      <div class="space-y-4 animate-fade-in text-center">
        <div class="inline-flex p-4 rounded-3xl bg-pink-500/20 text-pink-300 text-4xl mb-1 shadow-lg">
          ${catInfo.displayEmoji}
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-pink-400 block">Category Champion</span>
        <h2 class="text-2xl font-black text-white">${escapeHtml(catInfo.displayName)}</h2>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 max-w-xs mx-auto">
          <div class="text-2xl font-black text-pink-400 font-mono-num">
            ${catPct}% of Total Budget
          </div>
          <div class="text-sm font-bold text-white font-mono">
            ₹${Math.round(topCatAmt).toLocaleString('en-IN')}
          </div>
          <p class="text-xs text-slate-400">
            No regrets! This category took the lion's share of your trip hisaab.
          </p>
        </div>
      </div>
    `;
  } else if (slideIdx === 3) {
    const payerTotals = {};
    trip.members.forEach(m => { payerTotals[m.id] = 0; });
    (trip.expenses || []).forEach(exp => {
      if (Array.isArray(exp.paidBy)) {
        exp.paidBy.forEach(p => {
          if (payerTotals[p.memberId] !== undefined) {
            payerTotals[p.memberId] += (Number(p.amount) * (trip.forexRate || 1));
          }
        });
      }
    });

    let topPayer = trip.members[0];
    let topPayerAmt = 0;
    Object.entries(payerTotals).forEach(([mId, amt]) => {
      if (amt > topPayerAmt) {
        topPayerAmt = amt;
        topPayer = trip.members.find(m => m.id === mId) || topPayer;
      }
    });

    container.innerHTML = `
      <div class="space-y-3 animate-fade-in text-center">
        <div class="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-300 text-3xl mb-1">
          👑
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-amber-400 block">Trip VIP Honors</span>
        <h2 class="text-xl font-black text-white">THE BANKER OF THE TRIP</h2>
        <div class="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-1.5 max-w-xs mx-auto">
          <div class="text-lg font-black text-white">${escapeHtml(topPayer.name)}</div>
          <div class="text-base font-bold text-amber-400 font-mono-num">Paid ₹${Math.round(topPayerAmt).toLocaleString('en-IN')}</div>
          <p class="text-[11px] text-slate-400">
            The group owes you their financial gratitude (and prompt UPI transfers)!
          </p>
        </div>
      </div>
    `;
  } else if (slideIdx === 4) {
    generateWrappedPosterCanvas();
    container.innerHTML = `
      <div class="space-y-3 animate-fade-in text-center">
        <div class="text-xs font-bold text-purple-400 uppercase tracking-widest">Shareable Trip Story</div>
        <h2 class="text-xl font-black text-white">Trip Barabar Wrapped 2026</h2>
        <p class="text-[11px] text-slate-400">Ready to download and post on your WhatsApp or Instagram Story!</p>
        <div class="rounded-2xl overflow-hidden border border-purple-500/30 max-w-[240px] mx-auto shadow-2xl">
          <img id="wrappedPosterPreviewImg" src="" alt="Poster" class="w-full h-auto block">
        </div>
      </div>
    `;
    setTimeout(() => {
      const cvs = document.getElementById('tripWrappedPosterCanvas');
      const img = document.getElementById('wrappedPosterPreviewImg');
      if (cvs && img) img.src = cvs.toDataURL('image/png');
    }, 100);
  }
}

function generateWrappedPosterCanvas() {
  const canvas = document.getElementById('tripWrappedPosterCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const trip = state.activeTrip;
  if (!trip) return;

  const totalPrimary = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (exp.amount * (trip.forexRate || 1))), 0);

  const grad = ctx.createLinearGradient(0, 0, 0, 1000);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(0.5, '#1E1B4B');
  grad.addColorStop(1, '#070D18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1000);

  ctx.fillStyle = '#A855F7';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRIP BARABAR • TRIP WRAPPED', 400, 80);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px sans-serif';
  ctx.fillText(trip.name.toUpperCase(), 400, 135);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '20px sans-serif';
  ctx.fillText(trip.destination || 'Thailand Boys Trip', 400, 175);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.roundRect ? ctx.roundRect(100, 220, 600, 220, 24) : ctx.fillRect(100, 220, 600, 220);
  ctx.fill();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '20px sans-serif';
  ctx.fillText('TOTAL GROUP SPEND', 400, 265);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 56px monospace';
  ctx.fillText(`₹${Math.round(totalHome).toLocaleString('en-IN')}`, 400, 335);

  ctx.fillStyle = '#2DD4BF';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`(${trip.currencySymbol}${Math.round(totalPrimary).toLocaleString('en-IN')} ${trip.baseCurrency})`, 400, 385);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.roundRect ? ctx.roundRect(100, 480, 280, 180, 20) : ctx.fillRect(100, 480, 280, 180);
  ctx.fill();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px sans-serif';
  ctx.fillText('FRIENDS IN SQUAD', 240, 525);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(`${trip.members.length} 👥`, 240, 595);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.roundRect ? ctx.roundRect(420, 480, 280, 180, 20) : ctx.fillRect(420, 480, 280, 180);
  ctx.fill();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px sans-serif';
  ctx.fillText('BILLS LOGGED', 560, 525);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(`${trip.expenses.length} 🧾`, 560, 595);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Trip Sorted. Hisaab Barabar.', 400, 800);

  ctx.fillStyle = '#14B8A6';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('com.tripbarabar.app • 100% Free Forever', 400, 840);
}

function downloadWrappedPoster() {
  const canvas = document.getElementById('tripWrappedPosterCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `Trip-Barabar-Wrapped-${state.activeTrip?.code || 'TRIP'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('📥 Downloaded Trip Wrapped Poster!');
}

// ==================== 10. WHATSAPP VISUAL GRAPHIC CARD & TEXT GENERATOR ====================
function setWhatsAppMode(mode) {
  const btnText = document.getElementById('btnWhatsAppMode-text');
  const btnCard = document.getElementById('btnWhatsAppMode-card');
  const containerText = document.getElementById('whatsappContainerText');
  const containerCard = document.getElementById('whatsappContainerCard');

  if (mode === 'card') {
    if (btnCard) btnCard.className = 'py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold';
    if (btnText) btnText.className = 'py-1.5 rounded-lg text-slate-400 hover:text-white';
    if (containerCard) containerCard.classList.remove('hidden');
    if (containerText) containerText.classList.add('hidden');
    renderWhatsAppCanvasCard();
  } else {
    if (btnText) btnText.className = 'py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold';
    if (btnCard) btnCard.className = 'py-1.5 rounded-lg text-slate-400 hover:text-white';
    if (containerText) containerText.classList.remove('hidden');
    if (containerCard) containerCard.classList.add('hidden');
  }
}

function renderWhatsAppCanvasCard() {
  const canvas = document.getElementById('whatsappShareCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const trip = state.activeTrip;
  if (!trip) return;

  const totalPrimary = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (exp.amount * (trip.forexRate || 1))), 0);
  const transfers = calculateOptimalSettlements(trip);

  ctx.fillStyle = '#070D18';
  ctx.fillRect(0, 0, 800, 1000);

  const grad = ctx.createLinearGradient(0, 0, 800, 0);
  grad.addColorStop(0, '#0D9488');
  grad.addColorStop(0.5, '#F59E0B');
  grad.addColorStop(1, '#10B981');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 12);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(trip.name, 400, 80);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px sans-serif';
  ctx.fillText(`${trip.dates || 'Oct 2026'} • Hisaab Barabar Recap`, 400, 115);

  ctx.fillStyle = '#0F172A';
  ctx.roundRect ? ctx.roundRect(60, 150, 680, 180, 20) : ctx.fillRect(60, 150, 680, 180);
  ctx.fill();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '18px sans-serif';
  ctx.fillText('TOTAL TRIP SPENDING', 400, 195);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 50px monospace';
  ctx.fillText(`₹${Math.round(totalHome).toLocaleString('en-IN')}`, 400, 260);

  ctx.fillStyle = '#2DD4BF';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`(${trip.currencySymbol}${Math.round(totalPrimary).toLocaleString('en-IN')} ${trip.baseCurrency})`, 400, 305);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('🤝 WHO OWES WHAT (MINIMAL TRANSFERS)', 400, 375);

  let y = 420;
  if (transfers.length === 0) {
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText('Sabka Hisaab Barabar! No debts pending.', 400, y + 40);
  } else {
    transfers.slice(0, 7).forEach(t => {
      const fromMember = trip.members.find(m => m.id === t.fromId) || { name: 'Friend' };
      const toMember = trip.members.find(m => m.id === t.toId) || { name: 'Friend' };

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.roundRect ? ctx.roundRect(80, y, 640, 56, 12) : ctx.fillRect(80, y, 640, 56);
      ctx.fill();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(fromMember.name, 110, y + 36);

      ctx.fillStyle = '#64748B';
      ctx.font = '20px sans-serif';
      ctx.fillText('➔', 250, y + 36);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(toMember.name, 300, y + 36);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 690, y + 38);

      y += 68;
    });
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '16px sans-serif';
  ctx.fillText('Generated by Trip Barabar • Hisaab Barabar, No Drama', 400, 950);
}

function downloadWhatsAppCardImage() {
  const canvas = document.getElementById('whatsappShareCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `Trip-Barabar-Summary-${state.activeTrip?.code || 'TRIP'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('📥 Downloaded WhatsApp Graphic Card!');
}

function copyWhatsAppCardImage() {
  const canvas = document.getElementById('whatsappShareCanvas');
  if (!canvas) return;
  canvas.toBlob(blob => {
    try {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]).then(() => {
        showToast('📋 Image copied! Ready to paste into WhatsApp.');
      }).catch(err => {
        downloadWhatsAppCardImage();
      });
    } catch (e) {
      downloadWhatsAppCardImage();
    }
  });
}

function shareDirectWhatsAppText() {
  const text = document.getElementById('whatsappSummaryText')?.value || '';
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

// ==================== 11. PRINT / PDF STATEMENT EXPORT ====================
function exportTripPDF() {
  const trip = state.activeTrip;
  const printEl = document.getElementById('printTripStatement');
  if (!trip || !printEl) return;

  const totalPrimary = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (exp.amount * (trip.forexRate || 1))), 0);
  const transfers = calculateOptimalSettlements(trip);

  printEl.innerHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; padding: 20px;">
      <div style="border-bottom: 2px solid #0D9488; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 26px; color: #0D9488;">TRIP BARABAR — STATEMENT OF ACCOUNT</h1>
        <div style="font-size: 13px; color: #64748B; margin-top: 4px;">
          <strong>Trip:</strong> ${escapeHtml(trip.name)} | <strong>Dates:</strong> ${escapeHtml(trip.dates || '2026')} | <strong>Code:</strong> ${escapeHtml(trip.code)}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 24px; background: #F8FAFC; padding: 14px; border-radius: 8px;">
        <div>
          <div style="font-size: 11px; color: #64748B;">Total Primary Spend:</div>
          <div style="font-size: 20px; font-weight: bold; color: #0F172A;">${trip.currencySymbol}${totalPrimary.toLocaleString()} ${trip.baseCurrency}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748B;">Total Home Currency Spend:</div>
          <div style="font-size: 20px; font-weight: bold; color: #D97706;">₹${totalHome.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748B;">Exchange Rate Applied:</div>
          <div style="font-size: 14px; font-weight: bold; color: #0F172A;">1 ${trip.baseCurrency} = ₹${trip.forexRate} INR</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748B;">Total Friends:</div>
          <div style="font-size: 14px; font-weight: bold; color: #0F172A;">${trip.members.length} Members</div>
        </div>
      </div>

      <h2 style="font-size: 16px; border-bottom: 1px solid #CBD5E1; padding-bottom: 6px; margin-top: 24px;">Itemized Ledger Transactions</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
        <thead>
          <tr style="background: #F1F5F9; text-align: left;">
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Date</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Description</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Paid By</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Amount (${trip.baseCurrency})</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Amount (INR)</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Shared Friends</th>
          </tr>
        </thead>
        <tbody>
          ${(trip.expenses || []).map(e => {
            const payerNames = Array.isArray(e.paidBy) ? e.paidBy.map(p => {
              if (p.memberId === 'kitty') return 'Trip Kitty';
              return trip.members.find(m => m.id === p.memberId)?.name || 'Friend';
            }).join(', ') : 'Friend';
            return `
              <tr>
                <td style="padding: 8px; border: 1px solid #E2E8F0;">${e.date || '—'}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0;"><strong>${escapeHtml(e.title)}</strong></td>
                <td style="padding: 8px; border: 1px solid #E2E8F0;">${escapeHtml(payerNames)}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-family: monospace;">${trip.currencySymbol}${Number(e.amount).toLocaleString()}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-family: monospace; font-weight: bold;">₹${Number(e.convertedAmount || e.amount).toLocaleString()}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0;">${(e.sharedWith || []).length} friends</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <h2 style="font-size: 16px; border-bottom: 1px solid #CBD5E1; padding-bottom: 6px; margin-top: 30px;">Optimal Settlements (Who Pays Whom)</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
        <thead>
          <tr style="background: #F1F5F9; text-align: left;">
            <th style="padding: 8px; border: 1px solid #E2E8F0;">From (Debtor)</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">To (Creditor)</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Amount to Settle</th>
            <th style="padding: 8px; border: 1px solid #E2E8F0;">Creditor UPI ID</th>
          </tr>
        </thead>
        <tbody>
          ${transfers.map(t => {
            const fromM = trip.members.find(m => m.id === t.fromId) || { name: 'Friend' };
            const toM = trip.members.find(m => m.id === t.toId) || { name: 'Friend', upi: '—' };
            return `
              <tr>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-weight: bold; color: #DC2626;">${escapeHtml(fromM.name)}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-weight: bold; color: #16A34A;">${escapeHtml(toM.name)}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-family: monospace; font-weight: bold;">₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style="padding: 8px; border: 1px solid #E2E8F0; font-family: monospace;">${escapeHtml(toM.upi || '—')}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 10px; font-size: 11px; color: #94A3B8; text-align: center;">
        Trip Barabar • Hisaab Barabar • Free & Frictionless Group Expense Sharing
      </div>
    </div>
  `;

  window.print();
}

// ==================== SECURITY & CRYPTOGRAPHIC VAULT UI HANDLERS ====================
async function runLedgerAudit() {
  const resultEl = document.getElementById('ledgerAuditResult');
  if (!resultEl) return;

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Running cryptographic SHA-256 block hash audit...</span>';

  if (!window.SecurityVault) {
    resultEl.innerHTML = '<span class="text-rose-400 font-bold">⚠️ Security Vault engine not loaded.</span>';
    return;
  }

  const trip = state.activeTrip;
  if (!trip || !trip.expenses || trip.expenses.length === 0) {
    resultEl.innerHTML = '<span class="text-slate-400">No expenses logged in this trip yet to audit.</span>';
    return;
  }

  // Ensure all expenses have signatures
  await window.SecurityVault.signTripLedger(trip);
  const audit = await window.SecurityVault.verifyTripLedgerIntegrity(trip);

  if (audit.isValid) {
    resultEl.innerHTML = `
      <div class="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
        <i class="fa-solid fa-circle-check"></i>
        <span>Cryptographic Audit Passed!</span>
      </div>
      <div class="text-[10px] text-slate-300">
        All <strong>${audit.verifiedCount}</strong> expense records validated against chained SHA-256 block hashes. Zero tampering detected. Ledger is mathematically immutable.
      </div>
    `;
    showToast(`🛡️ All ${audit.verifiedCount} spends verified tamper-proof!`);
  } else {
    resultEl.innerHTML = `
      <div class="text-rose-400 font-bold flex items-center gap-1.5 mb-1">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>Integrity Breach Detected!</span>
      </div>
      <div class="text-[10px] text-rose-300">
        Expense "${escapeHtml(audit.tamperedTitle)}" (ID: ${audit.tamperedExpenseId}) does not match historical block hash!
      </div>
    `;
    showToast('⚠️ Security Warning: Ledger hash mismatch detected!');
  }
}

function openVaultExportModal() {
  const passInput = document.getElementById('inputVaultExportPass');
  if (passInput) passInput.value = '';
  openModal('modalVaultExport');
}

async function confirmVaultExport() {
  const passInput = document.getElementById('inputVaultExportPass');
  const pass = passInput ? passInput.value.trim() : '';

  if (!pass || pass.length < 4) {
    alert('Please enter a secure passphrase of at least 4 characters.');
    return;
  }

  if (window.SecurityVault) {
    await window.SecurityVault.exportEncryptedVault(pass);
    closeModal('modalVaultExport');
  }
}

function openVaultImportModal() {
  const fileInput = document.getElementById('inputVaultImportFile');
  const passInput = document.getElementById('inputVaultImportPass');
  if (fileInput) fileInput.value = '';
  if (passInput) passInput.value = '';
  openModal('modalVaultImport');
}

async function confirmVaultImport() {
  const fileInput = document.getElementById('inputVaultImportFile');
  const passInput = document.getElementById('inputVaultImportPass');

  const file = fileInput?.files?.[0];
  const pass = passInput?.value?.trim();

  if (!file) {
    alert('Please select a .barabar encrypted vault file to import.');
    return;
  }
  if (!pass) {
    alert('Please enter the vault decryption passphrase.');
    return;
  }

  try {
    showToast('⏳ Decrypting AES-256 vault...');
    await window.SecurityVault.importEncryptedVault(file, pass);
    closeModal('modalVaultImport');
    showToast('✅ Encrypted Vault restored successfully!');
  } catch (err) {
    alert('Failed to decrypt vault: ' + err.message + ' (Check your passphrase)');
  }
}

function openTripToolsSheet() {
  openModal('modalTripToolsSheet');
}

// ==================== 12. EXPENSE REACTIONS ENGINE ====================
function toggleExpenseReaction(expId, reactionKey) {
  const trip = state.activeTrip;
  if (!trip || !trip.expenses) return;
  const exp = trip.expenses.find(e => e.id === expId);
  if (!exp) return;

  if (!exp.reactions) {
    exp.reactions = { '🔥': 0, '🍻': 0, '💀': 0, '💸': 0 };
  }

  const storageKey = `tb_reaction_${expId}_${reactionKey}`;
  const alreadyReacted = localStorage.getItem(storageKey) === 'true';

  if (alreadyReacted) {
    exp.reactions[reactionKey] = Math.max(0, (exp.reactions[reactionKey] || 1) - 1);
    localStorage.removeItem(storageKey);
  } else {
    exp.reactions[reactionKey] = (exp.reactions[reactionKey] || 0) + 1;
    localStorage.setItem(storageKey, 'true');
    SoundEffects.playPop();
  }

  saveTripsToStorage();
  renderExpensesList();
}

// ==================== 13. DIGITAL TRIP PASSPORT & VISA STAMPS ====================
function openPassportBook() {
  const trip = state.activeTrip;
  if (!trip) return;

  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (Number(exp.amount) * (trip.forexRate || 1))), 0);
  const netBalances = calculateNetBalances(trip);
  const code = (trip.code || 'TB').toUpperCase();

  // Populate Header Particulars
  const tripNameEl = document.getElementById('passportTripName');
  if (tripNameEl) tripNameEl.textContent = trip.name;

  const travelerListEl = document.getElementById('passportTravelerList');
  if (travelerListEl) travelerListEl.textContent = `${trip.members.length} Friends • ${trip.destination || 'Global Adventure'}`;

  const visaCodeEl = document.getElementById('passportVisaCode');
  if (visaCodeEl) visaCodeEl.textContent = `${code}-${new Date().getFullYear()}-PASSPORT`;

  // Clearance badge
  const clearanceBadgeEl = document.getElementById('passportClearanceBadge');
  const allSettled = Object.values(netBalances).every(b => Math.abs(b) < 1.0);
  if (clearanceBadgeEl) {
    if (allSettled) {
      clearanceBadgeEl.className = 'text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold';
      clearanceBadgeEl.textContent = '● 100% Settle Clearance ✓';
    } else {
      clearanceBadgeEl.className = 'text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold';
      clearanceBadgeEl.textContent = `● Active Journey • ${trip.expenses.length} Records`;
    }
  }

  // Populate Stamps Grid with Vintage Rubber Stamps
  const stampsGrid = document.getElementById('passportStampsGrid');
  if (stampsGrid) {
    const cityName = (trip.destination || 'BANGKOK').split(',')[0].trim().toUpperCase();
    stampsGrid.innerHTML = `
      <!-- Entry Stamp -->
      <div class="passport-stamp stamp-emerald">
        <div class="stamp-border">
          <div class="text-[9px] font-mono tracking-widest font-black uppercase">${escapeHtml(cityName)} IMMIGRATION</div>
          <div class="text-[12px] font-black my-0.5">ENTRY PERMITTED</div>
          <div class="text-[8px] font-mono text-emerald-300">VALID: ${escapeHtml(trip.dates || '2026')}</div>
          <div class="text-[8px] font-mono mt-0.5">OFFICIAL SEAL ★★★</div>
        </div>
      </div>

      <!-- Expense Milestone Stamp -->
      <div class="passport-stamp stamp-gold">
        <div class="stamp-border">
          <div class="text-[9px] font-mono tracking-widest font-black uppercase">EXPENSE ACCREDITED</div>
          <div class="text-[12px] font-black my-0.5">₹${Math.round(totalHome).toLocaleString('en-IN')} INR</div>
          <div class="text-[8px] font-mono text-amber-300">${trip.expenses.length} SPENDS ITEMISED</div>
          <div class="text-[8px] font-mono mt-0.5">PRO TRAVELER STATUS</div>
        </div>
      </div>

      <!-- Security / Audit Seal -->
      <div class="passport-stamp stamp-cyan">
        <div class="stamp-border">
          <div class="text-[9px] font-mono tracking-widest font-black uppercase">TAMPER-PROOF AUDIT</div>
          <div class="text-[11px] font-black my-0.5">SHA-256 VERIFIED</div>
          <div class="text-[8px] font-mono text-cyan-300">BLOCK CHAIN INTEGRITY</div>
          <div class="text-[8px] font-mono mt-0.5">HISAAB BARABAR</div>
        </div>
      </div>

      <!-- Final Friendship Visa Seal -->
      <div class="passport-stamp stamp-crimson">
        <div class="stamp-border">
          <div class="text-[9px] font-mono tracking-widest font-black uppercase">REPUBLIC OF FRIENDS</div>
          <div class="text-[11px] font-black my-0.5">KARZ-MUKT VISA</div>
          <div class="text-[8px] font-mono text-rose-300">${allSettled ? 'ALL BALANCES CLEAR' : 'TRAVEL BONDED'}</div>
          <div class="text-[8px] font-mono mt-0.5">LIFETIME FRIENDSHIP</div>
        </div>
      </div>
    `;
  }

  // Populate Member Clearance List
  const memberListEl = document.getElementById('passportMemberList');
  if (memberListEl) {
    memberListEl.innerHTML = trip.members.map(m => {
      const net = netBalances[m.id] || 0;
      let badge = '';
      if (Math.abs(net) < 1.0) {
        badge = '<span class="text-emerald-400 font-bold font-mono">100% Settled ✓</span>';
      } else if (net > 0) {
        badge = `<span class="text-brand-300 font-mono">+₹${Math.round(net).toLocaleString('en-IN')} (Gets Back)</span>`;
      } else {
        badge = `<span class="text-rose-400 font-mono">-₹${Math.round(Math.abs(net)).toLocaleString('en-IN')} (Owes)</span>`;
      }

      return `
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white" style="background: ${m.color || '#0D9488'};">
              ${m.name.charAt(0)}
            </div>
            <span class="font-bold text-white">${escapeHtml(m.name)}</span>
          </div>
          <div>${badge}</div>
        </div>
      `;
    }).join('');
  }

  openModal('modalPassportBook');
}

function triggerNewPassportStamp() {
  SoundEffects.playStamp();
  fireConfetti();

  const grid = document.getElementById('passportStampsGrid');
  if (grid) {
    const stampEl = document.createElement('div');
    stampEl.className = 'passport-stamp stamp-gold stamp-thud-anim col-span-2';
    stampEl.innerHTML = `
      <div class="stamp-border">
        <div class="text-[9px] font-mono tracking-widest font-black uppercase">SPECIAL COMMEMORATIVE SEAL</div>
        <div class="text-[13px] font-black my-0.5">OFFICIAL HISAAB CLEARED 🔨</div>
        <div class="text-[8px] font-mono text-amber-300">STAMPED AT ${new Date().toLocaleTimeString()} • ${new Date().toLocaleDateString()}</div>
        <div class="text-[8px] font-mono mt-0.5">TRIP BARABAR SUPREME COUNCIL</div>
      </div>
    `;
    grid.prepend(stampEl);
  }

  showToast('🔨 Official Visa Stamp Pressed onto Passport!');
}

function sharePassportToWhatsApp() {
  const trip = state.activeTrip;
  if (!trip) return;

  const totalHome = (trip.expenses || []).reduce((sum, exp) => sum + (Number(exp.convertedAmount) || (Number(exp.amount) * (trip.forexRate || 1))), 0);
  const text = `📘 *OFFICIAL TRIP BARABAR PASSPORT* ✈️\n\n*Trip:* ${trip.name}\n*Destination:* ${trip.destination || 'Vacation'}\n*Visa No:* ${(trip.code || 'TB').toUpperCase()}-${new Date().getFullYear()}-PASSPORT\n*Travelers:* ${trip.members.map(m=>m.name).join(', ')}\n*Total Journey Spend:* ₹${Math.round(totalHome).toLocaleString('en-IN')} INR\n\nOfficial Visa Clearance Seals:\n✓ 🌴 Entry Immigration Permitted\n✓ 💰 Spend Milestone Certified\n✓ 🛡️ Tamper-Proof Cryptographic Block-Audit Passed\n✓ 🤝 100% Karz-Mukt Friendship Guarantee\n\n_Hisaab Barabar • Trip Sorted!_`;

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ==================== 14. BOLLYWOOD KARZ-MUKT SANAD ====================
function openKarzMuktModal(memberId = null) {
  const trip = state.activeTrip;
  if (!trip || !trip.members || trip.members.length === 0) return;

  const select = document.getElementById('selectKarzMuktMember');
  if (select) {
    select.innerHTML = trip.members.map(m => `
      <option value="${m.id}">${escapeHtml(m.name)}</option>
    `).join('');

    if (memberId) {
      select.value = memberId;
    }
  }

  updateKarzMuktDisplay();
  SoundEffects.playVictory();
  openModal('modalKarzMuktCertificate');
}

function updateKarzMuktDisplay() {
  const trip = state.activeTrip;
  if (!trip) return;

  const select = document.getElementById('selectKarzMuktMember');
  const memberId = select ? select.value : trip.members[0].id;
  const member = trip.members.find(m => m.id === memberId) || trip.members[0];

  const nameEl = document.getElementById('certMemberName');
  if (nameEl) nameEl.textContent = member.name;

  const tripEl = document.getElementById('certTripTitle');
  if (tripEl) tripEl.textContent = trip.name;
}

function shareKarzMuktWhatsApp() {
  const trip = state.activeTrip;
  if (!trip) return;

  const select = document.getElementById('selectKarzMuktMember');
  const memberId = select ? select.value : trip.members[0].id;
  const member = trip.members.find(m => m.id === memberId) || trip.members[0];

  const text = `🎬 *OFFICIAL KARZ-MUKT SANAD* 📜\n\nSuno suno suno! Hamare param mitra *${member.name}* ne *${trip.name}* ka saara hisaab 100% chukta kar diya hai! 💯\n\n⭐ Babu Bhaiya Approval: "Paisa poora barabar! Ab tension lene ka nahi, dene ka!" ⭐\n\nStatus: 100% KARZ-MUKT & AUDITED ✓\nCouncil of Friends • Trip Barabar 🌴`;

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ==================== 15. TRIP POLAROID MEMORIES GALLERY ====================
function openPolaroidsModal() {
  const trip = state.activeTrip;
  const container = document.getElementById('polaroidGalleryContainer');
  if (!trip || !container) return;

  const expenses = trip.expenses || [];
  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 text-center p-8 text-slate-500 text-xs">
        No expenses recorded yet to build polaroids from!
      </div>
    `;
    openModal('modalPolaroids');
    return;
  }

  // Find expenses with receipts, or pick top highlight spends
  const highlights = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 6);
  const rotations = ['rotate-[-2deg]', 'rotate-[2.5deg]', 'rotate-[-1.5deg]', 'rotate-[3deg]', 'rotate-[-3deg]', 'rotate-[1deg]'];

  container.innerHTML = highlights.map((exp, idx) => {
    const rot = rotations[idx % rotations.length];
    const cat = getCategoryInfo(exp.categoryId);
    const convertedHome = exp.convertedAmount || (exp.amount * (trip.forexRate || 1));
    const payerName = Array.isArray(exp.paidBy)
      ? trip.members.find(m => m.id === exp.paidBy[0]?.memberId)?.name || 'Friend'
      : trip.members.find(m => m.id === exp.paidBy)?.name || 'Friend';

    const photoContent = exp.receipt
      ? `<img src="${exp.receipt}" alt="Receipt" class="w-full h-36 object-cover rounded-md">`
      : `
        <div class="w-full h-36 rounded-md flex flex-col items-center justify-center text-center p-3 relative overflow-hidden" 
             style="background: linear-gradient(135deg, ${cat.color}30, #0F172A);">
          <div class="text-4xl mb-1">${cat.displayEmoji}</div>
          <div class="text-[11px] font-bold text-white px-2 truncate w-full">${escapeHtml(exp.title)}</div>
          <div class="text-[10px] text-amber-300 font-mono font-bold mt-1">₹${Math.round(convertedHome).toLocaleString('en-IN')}</div>
        </div>
      `;

    return `
      <div class="polaroid-card ${rot} transition-transform hover:scale-105 hover:z-10 cursor-pointer" onclick="editExpense('${exp.id}')">
        ${photoContent}
        <div class="mt-2.5 text-center">
          <div class="font-bold text-slate-900 text-xs truncate">"${escapeHtml(exp.title)}"</div>
          <div class="text-[10px] text-slate-600 font-mono mt-0.5">
            ${exp.date || '2026'} • Paid by ${escapeHtml(payerName)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  openModal('modalPolaroids');
}

// ==================== ✨ INTERACTIVE APP TOUR & FEATURE WALKTHROUGH ====================
let currentTourSlideIndex = 0;

const TOUR_SLIDES = [
  {
    step: 1,
    tag: 'WELCOME TO TRIP BARABAR',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: 'Trip Sorted. No Awkward Paisa Fights.',
    subtitle: 'Group expense tracking made effortless, fair, and fun.',
    emoji: '🌴',
    illustration: `
      <div class="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-center space-y-2">
        <div class="text-4xl animate-bounce">✈️ 🏝️ 🍻</div>
        <div class="text-xs font-black text-white">Built for Any Holiday Group</div>
        <div class="text-[11px] text-slate-300 leading-relaxed">
          From 2 best friends road-tripping to a mega group of <strong>25+ friends or family</strong>. No messy WhatsApp chats or confusing spreadsheets!
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-check-double', text: '<strong>Crystal Clear Hisaab:</strong> Everyone knows who spent what with instant conversion.' },
      { icon: 'fa-lock-open', text: '<strong>No Accounts or Passwords:</strong> Jump straight in — zero friction.' }
    ]
  },
  {
    step: 2,
    tag: 'REAL-TIME COLLABORATION',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    title: 'Live Multi-Device Cloud Sync',
    subtitle: 'Share once — all friends add & view expenses live.',
    emoji: '⚡',
    illustration: `
      <div class="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-950/60 to-slate-900 border border-amber-500/30 space-y-2">
        <div class="flex items-center justify-between text-xs px-1">
          <span class="text-slate-400 font-mono">Trip Room Code:</span>
          <span class="font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">GOA26</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center text-[10px]">
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-lg mb-1">💬</div>
            <div class="font-bold text-slate-200">1-Tap WhatsApp</div>
            <div class="text-slate-400">Share direct join link</div>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="text-lg mb-1">📷</div>
            <div class="font-bold text-slate-200">In-Person QR</div>
            <div class="text-slate-400">Instant camera scan</div>
          </div>
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-arrows-rotate', text: '<strong>Instant 5-Sec Sync:</strong> Any expense added by a friend reflects on your screen automatically.' },
      { icon: 'fa-mobile-screen', text: '<strong>Zero App Installs:</strong> Works right inside Safari & Chrome on iOS and Android.' }
    ]
  },
  {
    step: 3,
    tag: 'IMMERSIVE ATMOSPHERES',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    title: '25+ Global Destination Themes',
    subtitle: 'The entire app transforms into your vacation vibe.',
    emoji: '🎨',
    illustration: `
      <div class="p-3 rounded-2xl bg-gradient-to-tr from-teal-950/60 to-slate-900 border border-teal-500/30 space-y-2">
        <div class="text-[10px] text-slate-400 text-center">App dynamically detects destination keywords:</div>
        <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
          <div class="p-1.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-200">🌴 Goa Beach</div>
          <div class="p-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200">🏔️ Ladakh Snow</div>
          <div class="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200">🏜️ Dubai Dunes</div>
          <div class="p-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200">🥐 Paris Classic</div>
          <div class="p-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200">🔮 Tokyo Cyber</div>
          <div class="p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">🌺 Bali Sunset</div>
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-palette', text: '<strong>Ambient Colors & Gradients:</strong> Theme affects buttons, glow, and header.' },
      { icon: 'fa-image', text: '<strong>Scenic Horizon Art:</strong> Retina-crisp vector postcards rendered behind hero spends.' }
    ]
  },
  {
    step: 4,
    tag: 'EXPENSE CONTROL & KITTY',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: 'Smart Splits & Group Kitty Pool',
    subtitle: 'Split bills your way or pool cash upfront.',
    emoji: '💰',
    illustration: `
      <div class="p-3 rounded-2xl bg-gradient-to-tr from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-2">
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="font-bold text-emerald-300">⚖️ Flexible Splits</div>
            <div class="text-slate-400 mt-0.5">Equal split, custom %, or itemized bill scanner.</div>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="font-bold text-amber-300">🪙 Group Kitty Pool</div>
            <div class="text-slate-400 mt-0.5">Pool ₹5,000 each and spend common cash directly.</div>
          </div>
        </div>
        <div class="p-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-[10px]">
          <span class="text-slate-300">🎲 Can't decide who pays dinner?</span>
          <span class="text-amber-400 font-bold">Spin Bill Roulette!</span>
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-camera', text: '<strong>Bill Photo & OCR:</strong> Take a photo of restaurant receipt and split item-by-item.' },
      { icon: 'fa-money-bill-transfer', text: '<strong>Multi-Currency Forex:</strong> Live exchange rates for international getaways.' }
    ]
  },
  {
    step: 5,
    tag: 'DEBT MINIMIZATION',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    title: 'Minimum UPI Transfers + Sanad',
    subtitle: 'Settle in seconds without circular payments.',
    emoji: '📜',
    illustration: `
      <div class="p-3.5 rounded-2xl bg-gradient-to-tr from-rose-950/60 to-slate-900 border border-rose-500/30 space-y-2 text-center">
        <div class="text-xs font-bold text-white">Smart Debt Graph Algorithm</div>
        <div class="text-[11px] text-slate-300">
          Reduces <strong>35 messy transfers down to just 2 direct payments</strong>!
        </div>
        <div class="p-2 rounded-xl bg-slate-950/80 border border-rose-500/30 text-[10px] text-amber-300 font-bold flex items-center justify-center gap-1.5">
          <span>📜 Bollywood Karz-Mukt Sanad</span>
          <span class="text-slate-400 font-normal">• Babu Bhaiya approved</span>
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-qrcode', text: '<strong>Bilateral UPI Deep-Links:</strong> Direct 1-tap Google Pay / PhonePe / Paytm payments.' },
      { icon: 'fa-award', text: '<strong>WhatsApp Celebration Certificates:</strong> Announce who is 100% debt-free in the group!' }
    ]
  },
  {
    step: 6,
    tag: 'TRAVEL FREEDOM',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    title: 'Works Offline & Discreet Bro Mode',
    subtitle: 'Zero network needed in mountains + full privacy.',
    emoji: '📴',
    illustration: `
      <div class="p-3 rounded-2xl bg-gradient-to-tr from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-2">
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="font-bold text-sky-300">🏔️ Offline-First</div>
            <div class="text-slate-400 mt-0.5">Works in remote valleys & flights. Auto-syncs later.</div>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div class="font-bold text-emerald-300">👁️ Discreet Bro Mode</div>
            <div class="text-slate-400 mt-0.5">Masks adult & nightlife spends in front of family!</div>
          </div>
        </div>
        <div class="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-center text-[10px] text-slate-300">
          📲 <strong>Installable as App</strong> on iPhone & Android with custom app icon!
        </div>
      </div>
    `,
    highlights: [
      { icon: 'fa-shield-halved', text: '<strong>PIN Vault Security:</strong> Lock the app with your private 4-digit PIN.' },
      { icon: 'fa-passport', text: '<strong>Digital Passport:</strong> Collect souvenir digital stamps for every trip completed!' }
    ]
  }
];

function openAppTourModal(step = 0) {
  currentTourSlideIndex = Math.max(0, Math.min(step, TOUR_SLIDES.length - 1));
  renderTourSlide(currentTourSlideIndex);
  openModal('modalAppTour');
}

function renderTourSlide(index) {
  const slide = TOUR_SLIDES[index];
  if (!slide) return;

  const stepIndicator = document.getElementById('tourStepIndicator');
  if (stepIndicator) stepIndicator.textContent = `Step ${index + 1} of ${TOUR_SLIDES.length}`;

  const dotsContainer = document.getElementById('tourDotsContainer');
  if (dotsContainer) {
    dotsContainer.innerHTML = TOUR_SLIDES.map((_, i) => `
      <span class="transition-all duration-300 rounded-full ${
        i === index 
          ? 'w-4 h-2 bg-brand-400 shadow-md shadow-brand-500/50' 
          : 'w-1.5 h-1.5 bg-slate-700'
      }"></span>
    `).join('');
  }

  const content = document.getElementById('tourSlideContent');
  if (content) {
    content.innerHTML = `
      <div class="space-y-3 animate-fade-in">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${slide.badgeClass}">
            ${slide.tag}
          </span>
          <span class="text-2xl">${slide.emoji}</span>
        </div>

        <div>
          <h3 class="text-base font-black text-white tracking-tight leading-snug">
            ${slide.title}
          </h3>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-normal">
            ${slide.subtitle}
          </p>
        </div>

        <div>
          ${slide.illustration}
        </div>

        <div class="space-y-1.5 pt-1">
          ${slide.highlights.map(h => `
            <div class="flex items-start gap-2 text-[11px] text-slate-300">
              <i class="fa-solid ${h.icon} text-brand-400 mt-0.5 text-xs shrink-0"></i>
              <span class="leading-normal">${h.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const prevBtn = document.getElementById('btnTourPrev');
  if (prevBtn) {
    if (index === 0) {
      prevBtn.classList.add('opacity-30', 'pointer-events-none');
    } else {
      prevBtn.classList.remove('opacity-30', 'pointer-events-none');
    }
  }

  const nextBtn = document.getElementById('btnTourNext');
  const nextText = document.getElementById('btnTourNextText');
  const nextIcon = document.getElementById('btnTourNextIcon');

  if (index === TOUR_SLIDES.length - 1) {
    if (nextText) nextText.textContent = 'Get Started 🚀';
    if (nextIcon) nextIcon.className = 'fa-solid fa-sparkles text-[10px]';
    if (nextBtn) nextBtn.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs active-press shadow-xl transition-all flex items-center gap-1.5';
  } else {
    if (nextText) nextText.textContent = 'Next';
    if (nextIcon) nextIcon.className = 'fa-solid fa-arrow-right text-[10px]';
    if (nextBtn) nextBtn.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-400 hover:to-teal-400 text-slate-950 font-black text-xs active-press shadow-lg transition-all flex items-center gap-1.5';
  }
}

function nextTourSlide() {
  if (currentTourSlideIndex < TOUR_SLIDES.length - 1) {
    currentTourSlideIndex++;
    renderTourSlide(currentTourSlideIndex);
    SoundEffects.playClick();
  } else {
    finishAppTour();
  }
}

function prevTourSlide() {
  if (currentTourSlideIndex > 0) {
    currentTourSlideIndex--;
    renderTourSlide(currentTourSlideIndex);
    SoundEffects.playClick();
  }
}

function skipAppTour() {
  localStorage.setItem('tb_tour_seen_v2', 'true');
  closeModal('modalAppTour');
}

function finishAppTour() {
  localStorage.setItem('tb_tour_seen_v2', 'true');
  closeModal('modalAppTour');
  SoundEffects.playVictory();
  fireConfetti();
  if (!state.activeTrip) {
    openTripSwitcherModal('create');
  } else {
    showToast('✨ Welcome to Trip Barabar!');
  }
}

// ==================== 📲 PWA INSTALLATION HELPER ====================
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('PWA beforeinstallprompt captured!');
});

function openInstallGuideModal() {
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  switchInstallTab(isIos ? 'ios' : 'android');
  openModal('modalInstallGuide');
}

function switchInstallTab(os) {
  const btnAndroid = document.getElementById('btnInstallTabAndroid');
  const btnIos = document.getElementById('btnInstallTabIos');
  const guideAndroid = document.getElementById('installGuideAndroid');
  const guideIos = document.getElementById('installGuideIos');

  if (os === 'android') {
    if (btnAndroid) btnAndroid.className = 'py-2 rounded-lg font-extrabold text-xs bg-brand-500 text-slate-950 transition-all flex items-center justify-center gap-1.5';
    if (btnIos) btnIos.className = 'py-2 rounded-lg font-extrabold text-xs text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center gap-1.5';
    if (guideAndroid) guideAndroid.classList.remove('hidden');
    if (guideIos) guideIos.classList.add('hidden');
  } else {
    if (btnIos) btnIos.className = 'py-2 rounded-lg font-extrabold text-xs bg-sky-500 text-slate-950 transition-all flex items-center justify-center gap-1.5';
    if (btnAndroid) btnAndroid.className = 'py-2 rounded-lg font-extrabold text-xs text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center gap-1.5';
    if (guideIos) guideIos.classList.remove('hidden');
    if (guideAndroid) guideAndroid.classList.add('hidden');
  }
}

function triggerPwaInstallDirect() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 Installed Trip Barabar to your home screen!');
        closeModal('modalInstallGuide');
      }
      deferredInstallPrompt = null;
    });
  } else {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos) {
      showToast('📲 On iPhone: Tap Share (⎋) at bottom, then "Add to Home Screen"');
    } else {
      showToast('📲 On Chrome: Tap (⋮) menu, then "Install App" or "Add to Home screen"');
    }
  }
}

// ==================== 🎨 APP LOGO & INTERACTIVE ICON ENGINE ====================
// Self-contained embedded vector Data URIs — 100% offline, zero network dependency!
const EMBEDDED_LOGOS = {
  "kool-jet": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQ6IERlZXAgTWlkbmlnaHQgT2JzaWRpYW4gLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImpldEJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA4MEYxRSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzBFMUQzOCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNTBBMTQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBCb3JkZXIgR2xvdyBHcmFkaWVudCAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iamV0Qm9yZGVyR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMEYyRkUiIHN0b3Atb3BhY2l0eT0iMC44Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMzhCREY4IiBzdG9wLW9wYWNpdHk9IjAuMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNDNGNUUiIHN0b3Atb3BhY2l0eT0iMC43Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gTmVvbiBDeWFuIEVxdWFsIFRyYWlsIC0tPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0cmFpbEN5YW4iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAyODRDNyIgc3RvcC1vcGFjaXR5PSIwLjEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiMwRUE1RTkiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDBGMkZFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gTmVvbiBDb3JhbCBFcXVhbCBUcmFpbCAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idHJhaWxDb3JhbCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQkUxMjNDIiBzdG9wLW9wYWNpdHk9IjAuMSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iI0Y0M0Y1RSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGQjcxODUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBKZXQgQ2hyb21lIEJvZHkgU2hhZGluZyAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iamV0Qm9keUdyYWQiIHgxPSIxNSUiIHkxPSIwJSIgeDI9Ijg1JSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGRkZGIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNDAlIiBzdG9wLWNvbG9yPSIjRjFGNUY5Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjQ0JENUUxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzY0NzQ4QiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImpldFdpbmdMZWZ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRkZGRiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFMkU4RjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJqZXRXaW5nUmlnaHQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjOTRBM0I4Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzMzNDE1NSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8IS0tIE5lb24gR2xvdyBGaWx0ZXIgLS0+CiAgICA8ZmlsdGVyIGlkPSJnbG93SGlnaCIgeD0iLTMwJSIgeT0iLTMwJSIgd2lkdGg9IjE2MCUiIGhlaWdodD0iMTYwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEyIiByZXN1bHQ9ImJsdXIiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImJsdXIiIG9wZXJhdG9yPSJvdmVyIi8+CiAgICA8L2ZpbHRlcj4KCiAgICA8ZmlsdGVyIGlkPSJqZXREcm9wIiB4PSItMzAlIiB5PSItMzAlIiB3aWR0aD0iMTcwJSIgaGVpZ2h0PSIxNzAlIj4KICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMTIiIGR5PSIyMCIgc3RkRGV2aWF0aW9uPSIxOCIgZmxvb2QtY29sb3I9IiMwMDAwMDAiIGZsb29kLW9wYWNpdHk9IjAuODUiLz4KICAgIDwvZmlsdGVyPgoKICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iY2VudGVyR2xvdyIgY3g9IjQ1JSIgY3k9IjQ1JSIgcj0iNTUlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwRjJGRSIgc3RvcC1vcGFjaXR5PSIwLjIyIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMDI4NEM3IiBzdG9wLW9wYWNpdHk9IjAuMDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIEFwcCBTcXVpcmNsZSBCYXNlIC0tPgogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTE2IiBmaWxsPSJ1cmwoI2pldEJnKSIvPgogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTE2IiBmaWxsPSJ1cmwoI2NlbnRlckdsb3cpIi8+CgogIDwhLS0gU2xlZWsgR2xvd2luZyBTcXVpcmNsZSBSaW0gLS0+CiAgPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjUwNiIgaGVpZ2h0PSI1MDYiIHJ4PSIxMTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNqZXRCb3JkZXJHcmFkKSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CgogIDwhLS0gUmFkYXIgLyBGbGlnaHQgVmVjdG9yIExpbmVzIC0tPgogIDxnIG9wYWNpdHk9IjAuMTQiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjUiPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZS1kYXNoYXJyYXk9IjgsOCIvPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxMjAiIGZpbGw9Im5vbmUiLz4KICAgIDxsaW5lIHgxPSIyNTYiIHkxPSIzNiIgeDI9IjI1NiIgeTI9IjQ3NiIvPgogICAgPGxpbmUgeDE9IjM2IiB5MT0iMjU2IiB4Mj0iNDc2IiB5Mj0iMjU2Ii8+CiAgPC9nPgoKICA8IS0tIPCfjJ8gQk9MRCBORU9OIEVRVUFMIFNJR04gKD0pIENPTlRSQUlMUyAtLT4KICA8IS0tIFRvcCBFcXVhbCBCYXIgKEN5YW4gQmVhbSkgLS0+CiAgPGcgZmlsdGVyPSJ1cmwoI2dsb3dIaWdoKSI+CiAgICA8cmVjdCB4PSI2MCIgeT0iMTk2IiB3aWR0aD0iMjgwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9InVybCgjdHJhaWxDeWFuKSIvPgogICAgPHJlY3QgeD0iNzAiIHk9IjIwMiIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjgiLz4KICA8L2c+CgogIDwhLS0gQm90dG9tIEVxdWFsIEJhciAoTmVvbiBDb3JhbCBCZWFtKSAtLT4KICA8ZyBmaWx0ZXI9InVybCgjZ2xvd0hpZ2gpIj4KICAgIDxyZWN0IHg9IjYwIiB5PSIyODIiIHdpZHRoPSIyODAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0idXJsKCN0cmFpbENvcmFsKSIvPgogICAgPHJlY3QgeD0iNzAiIHk9IjI4OCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjgiLz4KICA8L2c+CgogIDwhLS0g4pyI77iPIEJPTEQgU1VQRVJTT05JQyBKRVQgQ1VUVElORyBUSFJPVUdIIFRIRSBFUVVBTCBCRUFNUyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMjUsIDI1Nikgcm90YXRlKC0zOCkiIGZpbHRlcj0idXJsKCNqZXREcm9wKSI+CiAgICAKICAgIDwhLS0gSW50ZW5zZSBBZnRlcmJ1cm5lciBFbmdpbmUgUGx1bWUgLS0+CiAgICA8ZWxsaXBzZSBjeD0iLTg1IiBjeT0iMCIgcng9IjQ1IiByeT0iMTYiIGZpbGw9IiMwMEYyRkUiIG9wYWNpdHk9IjAuOSIgZmlsdGVyPSJ1cmwoI2dsb3dIaWdoKSIvPgogICAgPGVsbGlwc2UgY3g9Ii05NSIgY3k9IjAiIHJ4PSIyNSIgcnk9IjgiIGZpbGw9IiNGRkZGRkYiIGZpbHRlcj0idXJsKCNnbG93SGlnaCkiLz4KCiAgICA8IS0tIExlZnQgV2luZyAoVG9wIGluIHBlcnNwZWN0aXZlKSAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iLTQ1LDAgLTk1LC0xMTAgMzUsLTE1IDE1LDAiIGZpbGw9InVybCgjamV0V2luZ0xlZnQpIi8+CiAgICAKICAgIDwhLS0gUmlnaHQgV2luZyAoQm90dG9tIGluIHBlcnNwZWN0aXZlKSAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iLTQ1LDAgLTg1LDExMCAzNSwxNSAxNSwwIiBmaWxsPSJ1cmwoI2pldFdpbmdSaWdodCkiLz4KCiAgICA8IS0tIEZ1c2VsYWdlIE1haW4gQm9keSAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iMTM1LDAgLTgwLC0yNCAtNzAsMCAtODAsMjQiIGZpbGw9InVybCgjamV0Qm9keUdyYWQpIi8+CgogICAgPCEtLSBDZW50ZXIgU3BpbmUgSGlnaGxpZ2h0IC0tPgogICAgPGxpbmUgeDE9IjEzMCIgeTE9IjAiIHgyPSItNjUiIHkyPSIwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMy41IiBvcGFjaXR5PSIwLjk1Ii8+CgogICAgPCEtLSBBZXJvZHluYW1pYyBHbGFzcyBDYW5vcHkgLS0+CiAgICA8cG9seWdvbiBwb2ludHM9IjU1LDAgMjAsLTYgLTE1LDAgMjAsNiIgZmlsbD0iIzAwRjJGRSIvPgogICAgPHBvbHlnb24gcG9pbnRzPSI1MCwwIDIyLC0zIC01LDAgMjIsMyIgZmlsbD0iI0ZGRkZGRiIvPgoKICAgIDwhLS0gVGFpbCBTdGFiaWxpemVyIEZpbnMgLS0+CiAgICA8cG9seWdvbiBwb2ludHM9Ii01MCwtMyAtODUsLTQ0IC02NSwtMyIgZmlsbD0iIzY0NzQ4QiIvPgogICAgPHBvbHlnb24gcG9pbnRzPSItNTAsMyAtODUsNDQgLTY1LDMiIGZpbGw9IiMxRTI5M0IiLz4KICA8L2c+CgogIDwhLS0gR2xvd2luZyBDb3JuZXIgRGVzdGluYXRpb24gUGluIFNwYXJrbGUgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDIwLCA5MikiIGZpbHRlcj0idXJsKCNnbG93SGlnaCkiPgogICAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjE0IiBmaWxsPSIjMDBGMkZFIi8+CiAgICA8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNyIgZmlsbD0iI0ZGRkZGRiIvPgogIDwvZz4KPC9zdmc+Cg==",
  "kool-wayfinder": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQ6IERlZXAgVGl0YW5pdW0gQmxhY2sgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IndheWZpbmRlckJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA1MDkxNCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzBCMTMyNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMzA2MEIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBHbG93aW5nIEN5YmVyIFJpbSAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0id2F5ZmluZGVyQm9yZGVyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwRjJGRSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzEwQjk4MSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNTlFMEIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBOb3J0aCBOZWVkbGUgKEVsZWN0cmljIEN5YW4gLyBJY2UgQmx1ZSkgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im5lZWRsZU5vcnRoTGVmdCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRTBGMkZFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM4QkRGOCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibmVlZGxlTm9ydGhSaWdodCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDI4NEM3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAzNjlBMSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8IS0tIFNvdXRoIE5lZWRsZSAoU3Vuc2V0IENvcmFsIC8gQW1iZXIpIC0tPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJuZWVkbGVTb3V0aExlZnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y5NzMxNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNDMjQxMEMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im5lZWRsZVNvdXRoUmlnaHQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0VBNTgwQyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5QTM0MTIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBHb2xkIEVxdWFsIENvcmUgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRCYXJhYmFyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkZCRUIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIyNSUiIHN0b3AtY29sb3I9IiNGRUYwOEEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI2MCUiIHN0b3AtY29sb3I9IiNGQUNDMTUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRUFCMzA4Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gRmlsdGVycyAtLT4KICAgIDxmaWx0ZXIgaWQ9Im5lb25Db21wYXNzR2xvdyIgeD0iLTMwJSIgeT0iLTMwJSIgd2lkdGg9IjE2MCUiIGhlaWdodD0iMTYwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIiByZXN1bHQ9ImJsdXIiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImJsdXIiIG9wZXJhdG9yPSJvdmVyIi8+CiAgICA8L2ZpbHRlcj4KCiAgICA8ZmlsdGVyIGlkPSJuZWVkbGVTaGFkb3ciIHg9Ii0yMCUiIHk9Ii0yMCUiIHdpZHRoPSIxNDAlIiBoZWlnaHQ9IjE0MCUiPgogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMTgiIHN0ZERldmlhdGlvbj0iMTYiIGZsb29kLWNvbG9yPSIjMDAwMDAwIiBmbG9vZC1vcGFjaXR5PSIwLjg1Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CgogIDwhLS0gQXBwIFNxdWlyY2xlIEJhc2UgLS0+CiAgPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMTYiIGZpbGw9InVybCgjd2F5ZmluZGVyQmcpIi8+CiAgPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjUwNiIgaGVpZ2h0PSI1MDYiIHJ4PSIxMTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCN3YXlmaW5kZXJCb3JkZXIpIiBzdHJva2Utd2lkdGg9IjMuNSIvPgoKICA8IS0tIFN1YnRsZSBQcmVjaXNpb24gRGlhbCBHZW9tZXRyeSAtLT4KICA8ZyBvcGFjaXR5PSIwLjMiIHN0cm9rZT0iIzM4QkRGOCIgc3Ryb2tlLXdpZHRoPSIxLjUiPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxODUiIGZpbGw9Im5vbmUiIHN0cm9rZS1kYXNoYXJyYXk9IjQsOCIvPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNDUiIGZpbGw9Im5vbmUiLz4KICAgIDxsaW5lIHgxPSIyNTYiIHkxPSI1MCIgeDI9IjI1NiIgeTI9IjQ2MiIgc3Ryb2tlPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxsaW5lIHgxPSI1MCIgeTE9IjI1NiIgeDI9IjQ2MiIgeTI9IjI1NiIgc3Ryb2tlPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjIiLz4KICA8L2c+CgogIDwhLS0gQ2FyZGluYWwgTWFya2VyczogTiBFIFMgVyBpbiBDbGVhbiBDeWJlciBUeXBvZ3JhcGh5IC0tPgogIDx0ZXh0IHg9IjI1NiIgeT0iODgiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMwMEYyRkUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbHRlcj0idXJsKCNuZW9uQ29tcGFzc0dsb3cpIj5OPC90ZXh0PgogIDx0ZXh0IHg9IjI1NiIgeT0iNDQwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjRjk3MzE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TPC90ZXh0PgogIDx0ZXh0IHg9IjQzMCIgeT0iMjYyIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjNjQ3NDhCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FPC90ZXh0PgogIDx0ZXh0IHg9IjgyIiB5PSIyNjIiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiM2NDc0OEIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlc8L3RleHQ+CgogIDwhLS0gT3V0ZXIgQ3lhbiBHbG93aW5nIFJpbmcgLS0+CiAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCN3YXlmaW5kZXJCb3JkZXIpIiBzdHJva2Utd2lkdGg9IjMiIG9wYWNpdHk9IjAuNiIvPgoKICA8IS0tIPCfp60gM0QgU0xFRUsgRkFDRVRFRCBESVJFQ1RJT05BTCBORUVETEUgLS0+CiAgPGcgZmlsdGVyPSJ1cmwoI25lZWRsZVNoYWRvdykiPgogICAgCiAgICA8IS0tIE5PUlRIIE5FRURMRSAoUG9pbnRpbmcgVXAgLSBIaWdoLVRlY2ggSWNlIEN5YW4pIC0tPgogICAgPGc+CiAgICAgIDwhLS0gTGVmdCBGYWNldCAtLT4KICAgICAgPHBvbHlnb24gcG9pbnRzPSIyNTYsMTA1IDIxMiwyNTYgMjU2LDI1NiIgZmlsbD0idXJsKCNuZWVkbGVOb3J0aExlZnQpIi8+CiAgICAgIDwhLS0gUmlnaHQgRmFjZXQgLS0+CiAgICAgIDxwb2x5Z29uIHBvaW50cz0iMjU2LDEwNSAyNTYsMjU2IDMwMCwyNTYiIGZpbGw9InVybCgjbmVlZGxlTm9ydGhSaWdodCkiLz4KICAgICAgPCEtLSBDZW50ZXIgUmlkZ2UgU2hpbW1lciBMaW5lIC0tPgogICAgICA8bGluZSB4MT0iMjU2IiB5MT0iMTA1IiB4Mj0iMjU2IiB5Mj0iMjU2IiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMi41IiBvcGFjaXR5PSIwLjkiLz4KICAgIDwvZz4KCiAgICA8IS0tIFNPVVRIIE5FRURMRSAoUG9pbnRpbmcgRG93biAtIFdhcm0gQW1iZXIpIC0tPgogICAgPGc+CiAgICAgIDwhLS0gTGVmdCBGYWNldCAtLT4KICAgICAgPHBvbHlnb24gcG9pbnRzPSIyNTYsNDA3IDIxMiwyNTYgMjU2LDI1NiIgZmlsbD0idXJsKCNuZWVkbGVTb3V0aExlZnQpIi8+CiAgICAgIDwhLS0gUmlnaHQgRmFjZXQgLS0+CiAgICAgIDxwb2x5Z29uIHBvaW50cz0iMjU2LDQwNyAyNTYsMjU2IDMwMCwyNTYiIGZpbGw9InVybCgjbmVlZGxlU291dGhSaWdodCkiLz4KICAgICAgPCEtLSBDZW50ZXIgUmlkZ2UgU2hpbW1lciBMaW5lIC0tPgogICAgICA8bGluZSB4MT0iMjU2IiB5MT0iNDA3IiB4Mj0iMjU2IiB5Mj0iMjU2IiBzdHJva2U9IiNGRUYwOEEiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8L2c+CgogICAgPCEtLSDwn4yfIFRIRSBDRU5UUkFMIEVRVUFMIFNJR04gQ09SRSAoIkJBUkFCQVIiID0pIC0tPgogICAgPCEtLSBIZWF2eSBEYXJrIFBpdm90IERpc2MgdG8gbGlmdCBFcXVhbCBiYXJzIC0tPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSI1NCIgZmlsbD0iIzBCMTMyNiIgc3Ryb2tlPSIjMzhCREY4IiBzdHJva2Utd2lkdGg9IjIuNSIvPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSI0OCIgZmlsbD0iIzA2MEIxNCIvPgoKICAgIDwhLS0gVG9wIEVxdWFsIEJhciAtLT4KICAgIDxnIGZpbHRlcj0idXJsKCNuZW9uQ29tcGFzc0dsb3cpIj4KICAgICAgPHJlY3QgeD0iMjIwIiB5PSIyMzQiIHdpZHRoPSI3MiIgaGVpZ2h0PSIxNSIgcng9IjcuNSIgZmlsbD0idXJsKCNnb2xkQmFyYWJhcikiLz4KICAgICAgPHJlY3QgeD0iMjI0IiB5PSIyMzYiIHdpZHRoPSI2NCIgaGVpZ2h0PSI3IiByeD0iMy41IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8L2c+CgogICAgPCEtLSBCb3R0b20gRXF1YWwgQmFyIC0tPgogICAgPGcgZmlsdGVyPSJ1cmwoI25lb25Db21wYXNzR2xvdykiPgogICAgICA8cmVjdCB4PSIyMjAiIHk9IjI2MyIgd2lkdGg9IjcyIiBoZWlnaHQ9IjE1IiByeD0iNy41IiBmaWxsPSJ1cmwoI2dvbGRCYXJhYmFyKSIvPgogICAgICA8cmVjdCB4PSIyMjQiIHk9IjI2NSIgd2lkdGg9IjY0IiBoZWlnaHQ9IjciIHJ4PSIzLjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuODUiLz4KICAgIDwvZz4KCiAgPC9nPgoKICA8IS0tIEdsb3dpbmcgTm9ydGggUG9sYXJpcyBTdGFyIFRpcCAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTYsIDEwNSkiIGZpbHRlcj0idXJsKCNuZW9uQ29tcGFzc0dsb3cpIj4KICAgIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIxMCIgZmlsbD0iIzAwRjJGRSIvPgogICAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiNGRkZGRkYiLz4KICA8L2c+Cjwvc3ZnPgo=",
  "kool-pin": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQ6IERlZXAgRWxlY3RyaWMgVmlvbGV0LU5hdnkgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbkJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA5MEExQSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzE0MTEzMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNjA3MTIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBHbG93aW5nIEJvcmRlciAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGluQm9yZGVyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwRjJGRSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzhCNUNGNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFQzQ4OTkiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSAzRCBQaW4gU2hhZGluZyAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGluR3JhZCIgeDE9IjIwJSIgeTE9IjAlIiB4Mj0iODAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzOEJERjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzNSUiIHN0b3AtY29sb3I9IiMwMjg0QzciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiMwMzY5QTEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEM0QTZFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gUGluIElubmVyIENvcmUgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbkNvcmVHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwODJGNDkiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDIxQjJFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gRXF1YWwgR29sZCAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGluRXF1YWxHb2xkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkZCRUIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiNGREUwNDciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiNGNTlFMEIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRDk3NzA2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gT3JiaXQgVHJhaWwgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im9yYml0R3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFQzQ4OTkiIHN0b3Atb3BhY2l0eT0iMC4xIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSIjRjQzRjVFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTA3QSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8IS0tIEZpbHRlcnMgLS0+CiAgICA8ZmlsdGVyIGlkPSJwaW5HbG93IiB4PSItMzAlIiB5PSItMzAlIiB3aWR0aD0iMTYwJSIgaGVpZ2h0PSIxNjAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIHJlc3VsdD0iYmx1ciIvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iYmx1ciIgb3BlcmF0b3I9Im92ZXIiLz4KICAgIDwvZmlsdGVyPgoKICAgIDxmaWx0ZXIgaWQ9InBpblNoYWRvdyIgeD0iLTI1JSIgeT0iLTI1JSIgd2lkdGg9IjE1MCUiIGhlaWdodD0iMTUwJSI+CiAgICAgIDxmZURyb3BTaGFkb3cgZHg9IjAiIGR5PSIyNCIgc3RkRGV2aWF0aW9uPSIyMCIgZmxvb2QtY29sb3I9IiMwMDAwMDAiIGZsb29kLW9wYWNpdHk9IjAuODUiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KCiAgPCEtLSBBcHAgU3F1aXJjbGUgQmFzZSAtLT4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjExNiIgZmlsbD0idXJsKCNwaW5CZykiLz4KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNTA2IiBoZWlnaHQ9IjUwNiIgcng9IjExMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI3BpbkJvcmRlcikiIHN0cm9rZS13aWR0aD0iMy41Ii8+CgogIDwhLS0gQW1iaWVudCBHcm91bmQgU2hhZG93IHVuZGVyIFBpbiBQb2ludCAtLT4KICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iNDI1IiByeD0iODAiIHJ5PSIyMiIgZmlsbD0iIzAwMDAwMCIgb3BhY2l0eT0iMC42IiBmaWx0ZXI9InVybCgjcGluR2xvdykiLz4KICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iNDI1IiByeD0iNDAiIHJ5PSIxMiIgZmlsbD0iIzAwRjJGRSIgb3BhY2l0eT0iMC40IiBmaWx0ZXI9InVybCgjcGluR2xvdykiLz4KCiAgPCEtLSBPcmJpdGluZyBGbGlnaHQgUmluZyB3cmFwcGluZyBhcm91bmQgUGluIC0tPgogIDxnIGZpbHRlcj0idXJsKCNwaW5HbG93KSI+CiAgICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMjcwIiByeD0iMTkwIiByeT0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNvcmJpdEdyYWQpIiBzdHJva2Utd2lkdGg9IjYiIAogICAgICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTIwIDI1NiAyNzApIi8+CiAgPC9nPgoKICA8IS0tIPCfk40gM0QgR0xPU1NZIExPQ0FUSU9OIFBJTiAtLT4KICA8ZyBmaWx0ZXI9InVybCgjcGluU2hhZG93KSI+CiAgICAKICAgIDwhLS0gUGluIFRlYXJkcm9wIEJvZHkgLS0+CiAgICA8cGF0aCBkPSJNIDI1Niw5MCBDIDE4NSw5MCAxMzAsMTQ1IDEzMCwyMTUgQyAxMzAsMjg1IDIyMCwzODAgMjU2LDQxNSBDIDI5MiwzODAgMzgyLDI4NSAzODIsMjE1IEMgMzgyLDE0NSAzMjcsOTAgMjU2LDkwIFoiIAogICAgICAgICAgZmlsbD0idXJsKCNwaW5HcmFkKSIvPgoKICAgIDwhLS0gTGVmdCBIaWdobGlnaHQgUmltIGZvciAzRCBWb2x1bWUgLS0+CiAgICA8cGF0aCBkPSJNIDI1Niw5NCBDIDE5MCw5NCAxMzYsMTQ4IDEzNiwyMTUgQyAxMzYsMjgwIDIyMiwzNzAgMjU2LDQwOCIgCiAgICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9IiNCQUU2RkQiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjciLz4KCiAgICA8IS0tIElubmVyIENvcmUgQ3V0b3V0IERpc2MgLS0+CiAgICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyMTUiIHI9Ijc2IiBmaWxsPSJ1cmwoI3BpbkNvcmVHcmFkKSIvPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjE1IiByPSI3NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI3BpbkVxdWFsR29sZCkiIHN0cm9rZS13aWR0aD0iMyIgb3BhY2l0eT0iMC42Ii8+CgogICAgPCEtLSDwn4yfIFRIRSBFUVVBTCAiQkFSQUJBUiIgU0lHTiAoPSkgRkxPQVRJTkcgSU5TSURFIFRIRSBQSU4gLS0+CiAgICA8IS0tIFRvcCBCYXIgLS0+CiAgICA8ZyBmaWx0ZXI9InVybCgjcGluR2xvdykiPgogICAgICA8cmVjdCB4PSIyMDYiIHk9IjE4NiIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSJ1cmwoI3BpbkVxdWFsR29sZCkiLz4KICAgICAgPHJlY3QgeD0iMjEyIiB5PSIxOTAiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuODUiLz4KICAgIDwvZz4KCiAgICA8IS0tIEJvdHRvbSBCYXIgLS0+CiAgICA8ZyBmaWx0ZXI9InVybCgjcGluR2xvdykiPgogICAgICA8cmVjdCB4PSIyMDYiIHk9IjIyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSJ1cmwoI3BpbkVxdWFsR29sZCkiLz4KICAgICAgPHJlY3QgeD0iMjEyIiB5PSIyMjgiIHdpZHRoPSI4OCIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuODUiLz4KICAgIDwvZz4KCiAgPC9nPgoKICA8IS0tIOKciO+4jyBKZXQgT3JiaXRpbmcgT3ZlciB0aGUgRnJvbnQgb2YgdGhlIFBpbiAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODUsIDIzMCkgcm90YXRlKC0xNSkgc2NhbGUoMC45KSIgZmlsdGVyPSJ1cmwoI3BpblNoYWRvdykiPgogICAgPCEtLSBKZXQgQWZ0ZXJidXJuZXIgUGx1bWUgLS0+CiAgICA8ZWxsaXBzZSBjeD0iLTQwIiBjeT0iMCIgcng9IjIwIiByeT0iNyIgZmlsbD0iI0Y0M0Y1RSIgZmlsdGVyPSJ1cmwoI3Bpbkdsb3cpIi8+CiAgICA8IS0tIFdpbmdzIC0tPgogICAgPHBvbHlnb24gcG9pbnRzPSItMjAsMCAtNDAsLTQ1IDEwLC01IDUsMCIgZmlsbD0iI0ZGRkZGRiIvPgogICAgPHBvbHlnb24gcG9pbnRzPSItMjAsMCAtMzUsNDUgMTAsNSA1LDAiIGZpbGw9IiM5NEEzQjgiLz4KICAgIDwhLS0gQm9keSAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iNDUsMCAtMzUsLTEwIC0zMCwwIC0zNSwxMCIgZmlsbD0iI0YxRjVGOSIvPgogICAgPCEtLSBDb2NrcGl0IC0tPgogICAgPHBvbHlnb24gcG9pbnRzPSIxNSwwIDAsLTMgLTgsMCAwLDMiIGZpbGw9IiMwMEYyRkUiLz4KICA8L2c+CgogIDwhLS0gU3BhcmtsZSBhdCBUb3AgQXBleCAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTYsIDkwKSI+CiAgICA8cG9seWdvbiBwb2ludHM9IjAsLTEyIDMsLTMgMTIsMCAzLDMgMCwxMiAtMywzIC0xMiwwIC0zLC0zIiBmaWxsPSIjQkFFNkZEIiBmaWx0ZXI9InVybCgjcGluR2xvdykiLz4KICA8L2c+Cjwvc3ZnPgo=",
  "kool-aviators": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQ6IFVsdHJhIE1vZGVybiBNaWFtaSAvIEdvYSBTdW5zZXQgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImF2aWF0b3JCZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxODBCMkUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI0MCUiIHN0b3AtY29sb3I9IiMyRDEyNEQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI3NSUiIHN0b3AtY29sb3I9IiM3MDFBNzUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOUEzNDEyIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gR2xvd2luZyBSaW0gLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImF2aWF0b3JCb3JkZXIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjQzRjVFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjQTg1NUY3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8IS0tIEdvbGQgTWV0YWxsaWMgRnJhbWUgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRGcmFtZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRUYwOEEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiNGQUNDMTUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiNDQThBMDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODU0RDBFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gUG9sYXJpemVkIE1pcnJvciBMZW5zIFJlZmxlY3Rpb24gLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxlbnNSZWZsZWN0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMjg0QzciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIzNSUiIHN0b3AtY29sb3I9IiM2MzY2RjEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI2NSUiIHN0b3AtY29sb3I9IiNFQzQ4OTkiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjU5RTBCIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gR2xvdyAmIFNoYWRvd3MgLS0+CiAgICA8ZmlsdGVyIGlkPSJhdmlhdG9yR2xvdyIgeD0iLTI1JSIgeT0iLTI1JSIgd2lkdGg9IjE1MCUiIGhlaWdodD0iMTUwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIiByZXN1bHQ9ImJsdXIiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImJsdXIiIG9wZXJhdG9yPSJvdmVyIi8+CiAgICA8L2ZpbHRlcj4KCiAgICA8ZmlsdGVyIGlkPSJhdmlhdG9yRHJvcCIgeD0iLTMwJSIgeT0iLTMwJSIgd2lkdGg9IjE2MCUiIGhlaWdodD0iMTYwJSI+CiAgICAgIDxmZURyb3BTaGFkb3cgZHg9IjAiIGR5PSIyNCIgc3RkRGV2aWF0aW9uPSIyMCIgZmxvb2QtY29sb3I9IiMwMDAwMDAiIGZsb29kLW9wYWNpdHk9IjAuOCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgoKICA8IS0tIEFwcCBTcXVpcmNsZSBCYXNlIC0tPgogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTE2IiBmaWxsPSJ1cmwoI2F2aWF0b3JCZykiLz4KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNTA2IiBoZWlnaHQ9IjUwNiIgcng9IjExMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2F2aWF0b3JCb3JkZXIpIiBzdHJva2Utd2lkdGg9IjMuNSIvPgoKICA8IS0tIEFtYmllbnQgR2xvd2luZyBTdW5zZXQgU3VuIGluIFNreSAtLT4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIxOTAiIHI9IjE0MCIgZmlsbD0iI0Y0M0Y1RSIgb3BhY2l0eT0iMC4zIiBmaWx0ZXI9InVybCgjYXZpYXRvckdsb3cpIi8+CiAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMTkwIiByPSI4NSIgZmlsbD0iI0ZCQkYyNCIgb3BhY2l0eT0iMC40IiBmaWx0ZXI9InVybCgjYXZpYXRvckdsb3cpIi8+CgogIDwhLS0g8J+Vtu+4jyBUSEUgS09PTCBBVklBVE9SIEdMQVNTRVMgV0lUSCBFUVVBTCBTSUdOICg9KSBOT1NFIEJSSURHRSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAxNSkiIGZpbHRlcj0idXJsKCNhdmlhdG9yRHJvcCkiPgoKICAgIDwhLS0gVG9wIEJyb3cgQmFyIEZyYW1lIChHb2xkIFdpcmUpIC0tPgogICAgPHBhdGggZD0iTSA5MCwyMTAgUSAyNTYsMTkwIDQyMiwyMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNnb2xkRnJhbWUpIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgoKICAgIDwhLS0gTEVGVCBMRU5TIC0tPgogICAgPGc+CiAgICAgIDwhLS0gVGVhcmRyb3AgTGVucyBTaGFwZSAtLT4KICAgICAgPHBhdGggaWQ9ImxlZnRMZW5zU2hhcGUiIGQ9Ik0gMTAwLDIyNSBDIDkwLDIyNSA4MCwyNDUgODAsMjg1IEMgODAsMzM1IDExMCwzNjUgMTU1LDM2NSBDIDIwNSwzNjUgMjI1LDMyNSAyMjUsMjc1IEMgMjI1LDI0MCAyMTUsMjI1IDIwMCwyMjUgWiIgCiAgICAgICAgICAgIGZpbGw9InVybCgjbGVuc1JlZmxlY3QpIi8+CiAgICAgIAogICAgICA8IS0tIEZyYW1lIFJpbSAtLT4KICAgICAgPHBhdGggZD0iTSAxMDAsMjI1IEMgOTAsMjI1IDgwLDI0NSA4MCwyODUgQyA4MCwzMzUgMTEwLDM2NSAxNTUsMzY1IEMgMjA1LDM2NSAyMjUsMzI1IDIyNSwyNzUgQyAyMjUsMjQwIDIxNSwyMjUgMjAwLDIyNSBaIiAKICAgICAgICAgICAgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2dvbGRGcmFtZSkiIHN0cm9rZS13aWR0aD0iNiIvPgoKICAgICAgPCEtLSBQYWxtIFRyZWUgUmVmbGVjdGlvbiBTaWxob3VldHRlIGluIExlZnQgTGVucyAtLT4KICAgICAgPGcgb3BhY2l0eT0iMC44NSI+CiAgICAgICAgPCEtLSBUcnVuayAtLT4KICAgICAgICA8cGF0aCBkPSJNIDE4MCwzNjUgUSAxNjUsMzEwIDE1MCwyNzAiIHN0cm9rZT0iIzBGMTcyQSIgc3Ryb2tlLXdpZHRoPSI2IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICAgICAgICA8IS0tIFBhbG0gRnJvbmRzIC0tPgogICAgICAgIDxwYXRoIGQ9Ik0gMTUwLDI3MCBRIDEzMCwyNTAgMTE1LDI2MCIgc3Ryb2tlPSIjMEYxNzJBIiBzdHJva2Utd2lkdGg9IjMuNSIgZmlsbD0ibm9uZSIvPgogICAgICAgIDxwYXRoIGQ9Ik0gMTUwLDI3MCBRIDEyNSwyNzAgMTIwLDI4NSIgc3Ryb2tlPSIjMEYxNzJBIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICAgICAgICA8cGF0aCBkPSJNIDE1MCwyNzAgUSAxNDUsMjQ1IDE2MCwyNDAiIHN0cm9rZT0iIzBGMTcyQSIgc3Ryb2tlLXdpZHRoPSIzLjUiIGZpbGw9Im5vbmUiLz4KICAgICAgICA8cGF0aCBkPSJNIDE1MCwyNzAgUSAxNzAsMjU1IDE4NSwyNjUiIHN0cm9rZT0iIzBGMTcyQSIgc3Ryb2tlLXdpZHRoPSIzLjUiIGZpbGw9Im5vbmUiLz4KICAgICAgPC9nPgogICAgICAKICAgICAgPCEtLSBMZW5zIEdsYXJlIEhpZ2hsaWdodCAtLT4KICAgICAgPHBhdGggZD0iTSAxMDUsMjQwIFEgMTIwLDI5MCAxMzUsMzQwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjQiLz4KICAgIDwvZz4KCiAgICA8IS0tIFJJR0hUIExFTlMgLS0+CiAgICA8Zz4KICAgICAgPCEtLSBUZWFyZHJvcCBMZW5zIFNoYXBlIC0tPgogICAgICA8cGF0aCBpZD0icmlnaHRMZW5zU2hhcGUiIGQ9Ik0gNDEyLDIyNSBDIDQyMiwyMjUgNDMyLDI0NSA0MzIsMjg1IEMgNDMyLDMzNSA0MDIsMzY1IDM1NywzNjUgQyAzMDcsMzY1IDI4NywzMjUgMjg3LDI3NSBDIDI4NywyNDAgMjk3LDIyNSAzMTIsMjI1IFoiIAogICAgICAgICAgICBmaWxsPSJ1cmwoI2xlbnNSZWZsZWN0KSIvPgogICAgICAKICAgICAgPCEtLSBGcmFtZSBSaW0gLS0+CiAgICAgIDxwYXRoIGQ9Ik0gNDEyLDIyNSBDIDQyMiwyMjUgNDMyLDI0NSA0MzIsMjg1IEMgNDMyLDMzNSA0MDIsMzY1IDM1NywzNjUgQyAzMDcsMzY1IDI4NywzMjUgMjg3LDI3NSBDIDI4NywyNDAgMjk3LDIyNSAzMTIsMjI1IFoiIAogICAgICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZ29sZEZyYW1lKSIgc3Ryb2tlLXdpZHRoPSI2Ii8+CgogICAgICA8IS0tIFN1cGVyc29uaWMgSmV0IFNpbGhvdWV0dGUgUmVmbGVjdGlvbiBpbiBSaWdodCBMZW5zIC0tPgogICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjUsIDI5MCkgcm90YXRlKC0zMCkgc2NhbGUoMC43KSIgb3BhY2l0eT0iMC45Ij4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjAsLTMwIC0yNSwyMCAtNSwxMiAwLDIyIDUsMTIgMjUsMjAiIGZpbGw9IiMwRjE3MkEiLz4KICAgICAgPC9nPgogICAgICAKICAgICAgPCEtLSBMZW5zIEdsYXJlIEhpZ2hsaWdodCAtLT4KICAgICAgPHBhdGggZD0iTSAzMTcsMjQwIFEgMzMyLDI5MCAzNDcsMzQwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjQiLz4KICAgIDwvZz4KCiAgICA8IS0tIPCfjJ8gVEhFIEVRVUFMICJCQVJBQkFSIiBCUklER0UgQ09OTkVDVElORyBUSEUgVFdPIExFTlNFUyAoPSkgLS0+CiAgICA8IS0tIFRvcCBCcmlkZ2UgQmFyIC0tPgogICAgPGcgZmlsdGVyPSJ1cmwoI2F2aWF0b3JHbG93KSI+CiAgICAgIDxyZWN0IHg9IjIyMCIgeT0iMjQ0IiB3aWR0aD0iNzIiIGhlaWdodD0iMTQiIHJ4PSI3IiBmaWxsPSJ1cmwoI2dvbGRGcmFtZSkiLz4KICAgICAgPHJlY3QgeD0iMjI0IiB5PSIyNDYiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2IiByeD0iMyIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8L2c+CiAgICA8IS0tIEJvdHRvbSBCcmlkZ2UgQmFyIC0tPgogICAgPGcgZmlsdGVyPSJ1cmwoI2F2aWF0b3JHbG93KSI+CiAgICAgIDxyZWN0IHg9IjIyMCIgeT0iMjcyIiB3aWR0aD0iNzIiIGhlaWdodD0iMTQiIHJ4PSI3IiBmaWxsPSJ1cmwoI2dvbGRGcmFtZSkiLz4KICAgICAgPHJlY3QgeD0iMjI0IiB5PSIyNzQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2IiByeD0iMyIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8L2c+CgogICAgPCEtLSBUZW1wbGUgSGluZ2VzIC0tPgogICAgPGNpcmNsZSBjeD0iODIiIGN5PSIyMzUiIHI9IjciIGZpbGw9InVybCgjZ29sZEZyYW1lKSIvPgogICAgPGNpcmNsZSBjeD0iNDMwIiBjeT0iMjM1IiByPSI3IiBmaWxsPSJ1cmwoI2dvbGRGcmFtZSkiLz4KICA8L2c+CgogIDwhLS0gQ29vbCBTcGFya2xlIEZsYXJlcyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTYsIDEyMCkiPgogICAgPHBvbHlnb24gcG9pbnRzPSIwLC0xNiA0LC00IDE2LDAgNCw0IDAsMTYgLTQsNCAtMTYsMCAtNCwtNCIgZmlsbD0iI0ZFRjA4QSIgZmlsdGVyPSJ1cmwoI2F2aWF0b3JHbG93KSIvPgogIDwvZz4KPC9zdmc+Cg==",
  "kool-globe": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQ6IERlZXAgU3BhY2UgT2JzaWRpYW4gLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imdsb2JlU3BhY2VCZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwNDA4MTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMwQTEyMjYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDIwNDA4Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gR2xvd2luZyBSaW0gLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imdsb2JlU3BhY2VCb3JkZXIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMzhCREY4Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjODE4Q0Y4Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM0RDM5OSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICA8IS0tIDNEIE9jZWFuIFNoYWRpbmcgLS0+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9Im9jZWFuU3BoZXJlIiBjeD0iNDAlIiBjeT0iMzUlIiByPSI2NSUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDI4NEM3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMDM2OUExIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iODUlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAyMDYxNyIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KCiAgICA8IS0tIEdsb3dpbmcgTGFuZCBDb250aW5lbnRzIC0tPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsYW5kR2xvdyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2RUU3QjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMxMEI5ODEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDQ3ODU3Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gRXF1YWwgT3JiaXQgUmluZ3MgKFB1cmUgTmVvbiBHb2xkKSAtLT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZXF1YWxPcmJpdEdvbGQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZFRjA4QSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjM1JSIgc3RvcC1jb2xvcj0iI0ZBQ0MxNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjcwJSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFQTU4MEMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBGaWx0ZXJzIC0tPgogICAgPGZpbHRlciBpZD0iZ2xvYmVHbG93IiB4PSItMzAlIiB5PSItMzAlIiB3aWR0aD0iMTYwJSIgaGVpZ2h0PSIxNjAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIHJlc3VsdD0iYmx1ciIvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iYmx1ciIgb3BlcmF0b3I9Im92ZXIiLz4KICAgIDwvZmlsdGVyPgoKICAgIDxmaWx0ZXIgaWQ9Imdsb2JlU2hhZG93IiB4PSItMjUlIiB5PSItMjUlIiB3aWR0aD0iMTUwJSIgaGVpZ2h0PSIxNTAlIj4KICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9IjI0IiBzdGREZXZpYXRpb249IjIwIiBmbG9vZC1jb2xvcj0iIzAwMDAwMCIgZmxvb2Qtb3BhY2l0eT0iMC44NSIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgoKICA8IS0tIEFwcCBTcXVpcmNsZSBCYXNlIC0tPgogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTE2IiBmaWxsPSJ1cmwoI2dsb2JlU3BhY2VCZykiLz4KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNTA2IiBoZWlnaHQ9IjUwNiIgcng9IjExMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2dsb2JlU3BhY2VCb3JkZXIpIiBzdHJva2Utd2lkdGg9IjMuNSIvPgoKICA8IS0tIFN0YXJyeSBTcGFjZSBGaWVsZCAtLT4KICA8ZyBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjYiPgogICAgPGNpcmNsZSBjeD0iOTAiIGN5PSI4MCIgcj0iMS41Ii8+CiAgICA8Y2lyY2xlIGN4PSI0MzAiIGN5PSIxMTAiIHI9IjIiLz4KICAgIDxjaXJjbGUgY3g9IjgwIiBjeT0iNDIwIiByPSIxLjUiLz4KICAgIDxjaXJjbGUgY3g9IjQyMCIgY3k9IjQwMCIgcj0iMS41Ii8+CiAgICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSI0NjAiIHI9IjIiLz4KICAgIDxjaXJjbGUgY3g9IjE2MCIgY3k9IjYwIiByPSIxIi8+CiAgPC9nPgoKICA8IS0tIEFtYmllbnQgT3V0ZXIgQXRtb3NwaGVyZSBSaW0gLS0+CiAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4QkRGOCIgc3Ryb2tlLXdpZHRoPSIxMiIgb3BhY2l0eT0iMC4xNSIgZmlsdGVyPSJ1cmwoI2dsb2JlR2xvdykiLz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjE1NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBGMkZFIiBzdHJva2Utd2lkdGg9IjIuNSIgb3BhY2l0eT0iMC43Ii8+CgogIDwhLS0g8J+MjSAzRCBQTEFORVQgRUFSVEggU1BIRVJFIC0tPgogIDxnIGZpbHRlcj0idXJsKCNnbG9iZVNoYWRvdykiPgogICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNTAiIGZpbGw9InVybCgjb2NlYW5TcGhlcmUpIi8+CgogICAgPCEtLSBHZW9tZXRyaWMgVmVjdG9yIENvbnRpbmVudHMgKENsaXBwZWQgdG8gR2xvYmUpIC0tPgogICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2dsb2JlQ2xpcCkiPgogICAgICA8Y2xpcFBhdGggaWQ9Imdsb2JlQ2xpcCI+CiAgICAgICAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxNTAiLz4KICAgICAgPC9jbGlwUGF0aD4KCiAgICAgIDwhLS0gRXVyYXNpYSAmIEluZGlhIExhbmRtYXNzIFNpbGhvdWV0dGUgLS0+CiAgICAgIDxwYXRoIGQ9Ik0gMjEwLDE0MCBRIDI1MCwxMzAgMjkwLDE1MCBRIDMyMCwxODAgMzAwLDIxMCBRIDI4MCwyNDAgMjYwLDIzMCBRIDI0MCwyNTAgMjUwLDI4MCBMIDIzNSwzMDAgUSAyMjAsMjgwIDIzMCwyNTAgUSAyMDAsMjQwIDE4MCwyMDAgWiIgCiAgICAgICAgICAgIGZpbGw9InVybCgjbGFuZEdsb3cpIiBvcGFjaXR5PSIwLjg1Ii8+CgogICAgICA8IS0tIEFtZXJpY2FzIFNpbGhvdWV0dGUgRWRnZSAtLT4KICAgICAgPHBhdGggZD0iTSAxMjAsMTYwIFEgMTQwLDE5MCAxMzUsMjQwIFEgMTIwLDI4MCAxNDAsMzIwIEwgMTI1LDM1MCBRIDEwMCwzMTAgMTEwLDI1MCBaIiAKICAgICAgICAgICAgZmlsbD0idXJsKCNsYW5kR2xvdykiIG9wYWNpdHk9IjAuNyIvPgoKICAgICAgPCEtLSBMYXRpdHVkZSAmIExvbmdpdHVkZSBTdWJ0bGUgTmVvbiBHcmlkIC0tPgogICAgICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMjU2IiByeD0iMTUwIiByeT0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4QkRGOCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxlbGxpcHNlIGN4PSIyNTYiIGN5PSIyNTYiIHJ4PSI2MCIgcnk9IjE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzhCREY4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMjUiLz4KICAgIDwvZz4KICA8L2c+CgogIDwhLS0g8J+MnyBUSEUgRVFVQUwgT1JCSVQgUklOR1MgKD0pIEVOQ0lSQ0xJTkcgVEhFIEdMT0JFIC0tPgogIDxnIGZpbHRlcj0idXJsKCNnbG9iZUdsb3cpIj4KICAgIDwhLS0gVG9wIEVxdWFsIFJpbmcgLS0+CiAgICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMjM1IiByeD0iMTk1IiByeT0iNDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNlcXVhbE9yYml0R29sZCkiIHN0cm9rZS13aWR0aD0iOCIgCiAgICAgICAgICAgICB0cmFuc2Zvcm09InJvdGF0ZSgtMTUgMjU2IDIzNSkiLz4KICAgIDwhLS0gQm90dG9tIEVxdWFsIFJpbmcgLS0+CiAgICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMjc1IiByeD0iMTk1IiByeT0iNDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNlcXVhbE9yYml0R29sZCkiIHN0cm9rZS13aWR0aD0iOCIgCiAgICAgICAgICAgICB0cmFuc2Zvcm09InJvdGF0ZSgtMTUgMjU2IDI3NSkiLz4KICA8L2c+CgogIDwhLS0g4pyI77iPIFNVUEVSU09OSUMgSkVUIFJJRElORyBUSEUgVE9QIEVRVUFMIE9SQklUIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM5NSwgMTc1KSByb3RhdGUoLTIyKSBzY2FsZSgwLjk1KSIgZmlsdGVyPSJ1cmwoI2dsb2JlU2hhZG93KSI+CiAgICA8IS0tIEpldCBBZnRlcmJ1cm5lciBQbHVtZSAtLT4KICAgIDxlbGxpcHNlIGN4PSItNDUiIGN5PSIwIiByeD0iMjYiIHJ5PSI4IiBmaWxsPSIjRkFDQzE1IiBmaWx0ZXI9InVybCgjZ2xvYmVHbG93KSIvPgogICAgPCEtLSBXaW5ncyAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iLTI1LDAgLTUwLC01MCAxNSwtNiAxMCwwIiBmaWxsPSIjRkZGRkZGIi8+CiAgICA8cG9seWdvbiBwb2ludHM9Ii0yNSwwIC00Miw1MCAxNSw2IDEwLDAiIGZpbGw9IiM5NEEzQjgiLz4KICAgIDwhLS0gRnVzZWxhZ2UgQm9keSAtLT4KICAgIDxwb2x5Z29uIHBvaW50cz0iNTAsMCAtNDAsLTEyIC0zNSwwIC00MCwxMiIgZmlsbD0iI0Y4RkFGQyIvPgogICAgPCEtLSBDb2NrcGl0IC0tPgogICAgPHBvbHlnb24gcG9pbnRzPSIxOCwwIDIsLTQgLTcsMCAyLDQiIGZpbGw9IiMwMEYyRkUiLz4KICA8L2c+CgogIDwhLS0gRGVzdGluYXRpb24gUGluIGF0IHRoZSBUb3AgTm9ydGggb2YgdGhlIEdsb2JlIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1NiwgMTA4KSIgZmlsdGVyPSJ1cmwoI2dsb2JlR2xvdykiPgogICAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjEwIiBmaWxsPSIjRjQzRjVFIi8+CiAgICA8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPgogIDwvZz4KPC9zdmc+Cg==",
  "suitcase": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+CiAgPGRlZnM+CiAgICA8IS0tIEJhY2tncm91bmQgR3JhZGllbnQgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMDkxRTMyIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA0MkYyRSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIAogICAgPCEtLSBPdXRlciBHbG93IC0tPgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJhbWJHbG93MSIgY3g9IjUwJSIgY3k9IjQwJSIgcj0iNjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE0QjhBNiIgc3RvcC1vcGFjaXR5PSIwLjM1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSIjMEQ5NDg4IiBzdG9wLW9wYWNpdHk9IjAuMSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwRjE3MkEiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KCiAgICA8IS0tIFN1aXRjYXNlIEJvZHkgR3JhZGllbnQgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImNhc2VCb2R5IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxNEI4QTYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI0MCUiIHN0b3AtY29sb3I9IiMwRDk0ODgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEY3NjZFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gTGVhdGhlciAvIEdvbGQgU3RyYXBzIC0tPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJnb2xkU3RyYXAiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZERTA0NyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjM1JSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjcwJSIgc3RvcC1jb2xvcj0iI0Q5NzcwNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNCNDUzMDkiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CgogICAgPCEtLSBCcmFzcyBDb3JuZXJzIC0tPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJicmFzc0Nvcm5lciIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRUYwOEEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNFQUIzMDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODU0RDBFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgIDwhLS0gRHJvcCBTaGFkb3cgRmlsdGVyIC0tPgogICAgPGZpbHRlciBpZD0ic2hhZG93M0QiIHg9Ii0xMCUiIHk9Ii0xMCUiIHdpZHRoPSIxMzAlIiBoZWlnaHQ9IjEzMCUiPgogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMTYiIHN0ZERldmlhdGlvbj0iMTYiIGZsb29kLWNvbG9yPSIjMDAwMDAwIiBmbG9vZC1vcGFjaXR5PSIwLjYiLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciBpZD0ibmVvbkdsb3ciIHg9Ii0yMCUiIHk9Ii0yMCUiIHdpZHRoPSIxNDAlIiBoZWlnaHQ9IjE0MCUiPgogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iNCIgc3RkRGV2aWF0aW9uPSI4IiBmbG9vZC1jb2xvcj0iI0ZCQkYyNCIgZmxvb2Qtb3BhY2l0eT0iMC42Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CgogIDwhLS0gQXBwIEljb24gU3F1aXJjbGUgQmFzZSAtLT4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjExMiIgZmlsbD0idXJsKCNiZ0dyYWQxKSIvPgogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTEyIiBmaWxsPSJ1cmwoI2FtYkdsb3cxKSIvPgogIDxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSI1MDgiIGhlaWdodD0iNTA4IiByeD0iMTEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xMikiIHN0cm9rZS13aWR0aD0iMyIvPgoKICA8IS0tIE1haW4gU3VpdGNhc2UgR3JvdXAgLS0+CiAgPGcgZmlsdGVyPSJ1cmwoI3NoYWRvdzNEKSI+CiAgICA8IS0tIFN1aXRjYXNlIEhhbmRsZSBUb3AgLS0+CiAgICA8cGF0aCBkPSJNIDIwNiwxMjAgTCAyMDYsOTIgQyAyMDYsNzggMjE4LDY2IDIzMiw2NiBMIDI4MCw2NiBDIDI5NCw2NiAzMDYsNzggMzA2LDkyIEwgMzA2LDEyMCIgCiAgICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZ29sZFN0cmFwKSIgc3Ryb2tlLXdpZHRoPSIxOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICA8IS0tIEhhbmRsZSBCcmFzcyBNb3VudHMgLS0+CiAgICA8cmVjdCB4PSIxOTQiIHk9IjExMiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiByeD0iNCIgZmlsbD0idXJsKCNicmFzc0Nvcm5lcikiLz4KICAgIDxyZWN0IHg9IjI5NCIgeT0iMTEyIiB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHJ4PSI0IiBmaWxsPSJ1cmwoI2JyYXNzQ29ybmVyKSIvPgoKICAgIDwhLS0gU3VpdGNhc2UgTWFpbiBTaGVsbCAtLT4KICAgIDxyZWN0IHg9Ijc2IiB5PSIxMjAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjcwIiByeD0iMzYiIGZpbGw9InVybCgjY2FzZUJvZHkpIi8+CiAgICA8IS0tIFN1aXRjYXNlIElubmVyIFNoYWRvdy9CZXZlbCAtLT4KICAgIDxyZWN0IHg9Ijg0IiB5PSIxMjgiIHdpZHRoPSIzNDQiIGhlaWdodD0iMjU0IiByeD0iMjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIyKSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgICAKICAgIDwhLS0gQ2VudHJhbCBTZWFtIFNwbGl0IChaaXAgLyBIaW5nZSkgLS0+CiAgICA8bGluZSB4MT0iNzYiIHkxPSIyNTUiIHgyPSI0MzYiIHkyPSIyNTUiIHN0cm9rZT0iIzA0MkYyRSIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2Utb3BhY2l0eT0iMC42Ii8+CgogICAgPCEtLSDwn4yfIFRIRSAnQkFSQUJBUicgRVFVQUwgU0lHTiBTVFJBUFMgKDIgUGFyYWxsZWwgSG9yaXpvbnRhbCBMZWF0aGVyIFN0cmFwcykgLS0+CiAgICA8IS0tIFRvcCBFcXVhbCBCYXIgU3RyYXAgLS0+CiAgICA8ZyBmaWx0ZXI9InVybCgjbmVvbkdsb3cpIj4KICAgICAgPHJlY3QgeD0iNjYiIHk9IjE4MCIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIzNCIgcng9IjEwIiBmaWxsPSJ1cmwoI2dvbGRTdHJhcCkiLz4KICAgICAgPHJlY3QgeD0iNjYiIHk9IjE4MCIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIzNCIgcng9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zNSkiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICA8IS0tIEJyYXNzIEJ1Y2tsZXMgLS0+CiAgICAgIDxyZWN0IHg9IjE0NiIgeT0iMTc0IiB3aWR0aD0iMzAiIGhlaWdodD0iNDYiIHJ4PSI2IiBmaWxsPSJ1cmwoI2JyYXNzQ29ybmVyKSIvPgogICAgICA8cmVjdCB4PSIxNTMiIHk9IjE4NCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjI2IiByeD0iMyIgZmlsbD0iIzA0MkYyRSIvPgogICAgICA8cmVjdCB4PSIzMzYiIHk9IjE3NCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjQ2IiByeD0iNiIgZmlsbD0idXJsKCNicmFzc0Nvcm5lcikiLz4KICAgICAgPHJlY3QgeD0iMzQzIiB5PSIxODQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNiIgcng9IjMiIGZpbGw9IiMwNDJGMkUiLz4KICAgIDwvZz4KCiAgICA8IS0tIEJvdHRvbSBFcXVhbCBCYXIgU3RyYXAgLS0+CiAgICA8ZyBmaWx0ZXI9InVybCgjbmVvbkdsb3cpIj4KICAgICAgPHJlY3QgeD0iNjYiIHk9IjI5NiIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIzNCIgcng9IjEwIiBmaWxsPSJ1cmwoI2dvbGRTdHJhcCkiLz4KICAgICAgPHJlY3QgeD0iNjYiIHk9IjI5NiIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIzNCIgcng9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zNSkiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICA8IS0tIEJyYXNzIEJ1Y2tsZXMgLS0+CiAgICAgIDxyZWN0IHg9IjE0NiIgeT0iMjkwIiB3aWR0aD0iMzAiIGhlaWdodD0iNDYiIHJ4PSI2IiBmaWxsPSJ1cmwoI2JyYXNzQ29ybmVyKSIvPgogICAgICA8cmVjdCB4PSIxNTMiIHk9IjMwMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjI2IiByeD0iMyIgZmlsbD0iIzA0MkYyRSIvPgogICAgICA8cmVjdCB4PSIzMzYiIHk9IjI5MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjQ2IiByeD0iNiIgZmlsbD0idXJsKCNicmFzc0Nvcm5lcikiLz4KICAgICAgPHJlY3QgeD0iMzQzIiB5PSIzMDAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNiIgcng9IjMiIGZpbGw9IiMwNDJGMkUiLz4KICAgIDwvZz4KCiAgICA8IS0tIDQgUmVpbmZvcmNlZCBCcmFzcyBDb3JuZXJzIC0tPgogICAgPHBhdGggZD0iTSA3NiwxNTYgTCA3NiwxMzYgQyA3NiwxMjcgODMsMTIwIDkyLDEyMCBMIDExMiwxMjAgQyAxMTIsMTQwIDk2LDE1NiA3NiwxNTYgWiIgZmlsbD0idXJsKCNicmFzc0Nvcm5lcikiLz4KICAgIDxwYXRoIGQ9Ik0gNDM2LDE1NiBMIDQzNiwxMzYgQyA0MzYsMTI3IDQyOSwxMjAgNDIwLDEyMCBMIDQwMCwxMjAgQyA0MDAsMTQwIDQxNiwxNTYgNDM2LDE1NiBaIiBmaWxsPSJ1cmwoI2JyYXNzQ29ybmVyKSIvPgogICAgPHBhdGggZD0iTSA3NiwzNTQgTCA3NiwzNzQgQyA3NiwzODMgODMsMzkwIDkyLDM5MCBMIDExMiwzOTAgQyAxMTIsMzcwIDk2LDM1NCA3NiwzNTQgWiIgZmlsbD0idXJsKCNicmFzc0Nvcm5lcikiLz4KICAgIDxwYXRoIGQ9Ik0gNDM2LDM1NCBMIDQzNiwzNzQgQyA0MzYsMzgzIDQyOSwzOTAgNDIwLDM5MCBMIDQwMCwzOTAgQyA0MDAsMzcwIDQxNiwzNTQgNDM2LDM1NCBaIiBmaWxsPSJ1cmwoI2JyYXNzQ29ybmVyKSIvPgoKICAgIDwhLS0g8J+MtCBUcmF2ZWwgRGVzdGluYXRpb24gU3RpY2tlcnMgb24gTHVnZ2FnZSAtLT4KICAgIDwhLS0gMS4gQmVhY2ggUGFsbSBTdGlja2VyIC0tPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAwLCAyMjYpIHJvdGF0ZSgtOCkiPgogICAgICA8Y2lyY2xlIGN4PSIyOCIgY3k9IjI4IiByPSIyNiIgZmlsbD0iI0Y0M0Y1RSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHRleHQgeD0iMjgiIHk9IjM0IiBmb250LXNpemU9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4y0PC90ZXh0PgogICAgPC9nPgogICAgPCEtLSAyLiBGbGlnaHQgSmV0IFN0aWNrZXIgLS0+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjIsIDIyMikgcm90YXRlKDEyKSI+CiAgICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI1NiIgaGVpZ2h0PSIzNCIgcng9IjgiIGZpbGw9IiMwMjg0QzciIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICAgIDx0ZXh0IHg9IjI4IiB5PSIyNCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pyI77iPPC90ZXh0PgogICAgPC9nPgoKICAgIDwhLS0gTHVnZ2FnZSBUYWcgSGFuZ2luZyBPZmYgSGFuZGxlIC0tPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLCAxMTgpIHJvdGF0ZSgyMikiPgogICAgICA8bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMjgiIHN0cm9rZT0iI0ZERTA0NyIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgICAgIDxwb2x5Z29uIHBvaW50cz0iLTE2LDI4IDE2LDI4IDIyLDY0IC0yMiw2NCIgZmlsbD0iI0ZFRjNDNyIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPGNpcmNsZSBjeD0iMCIgY3k9IjM0IiByPSIzIiBmaWxsPSIjRDk3NzA2Ii8+CiAgICAgIDx0ZXh0IHg9IjAiIHk9IjUyIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjkiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiM3ODM1MEYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJBUkFCQVI8L3RleHQ+CiAgICA8L2c+CiAgPC9nPgoKICA8IS0tIEJvdHRvbSBCcmFuZCBSaWJib24gLS0+CiAgPHRleHQgeD0iMjU2IiB5PSI0NDYiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI5MDAiIGxldHRlci1zcGFjaW5nPSIzIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIFRSSVAgQkFSQUJBUgogIDwvdGV4dD4KICA8dGV4dCB4PSIyNTYiIHk9IjQ3MiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgbGV0dGVyLXNwYWNpbmc9IjQiIGZpbGw9IiMyREQ0QkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgSElTQUFCIFNPUlRFRCDigKIgPQogIDwvdGV4dD4KPC9zdmc+"
};
window.EMBEDDED_LOGOS = EMBEDDED_LOGOS;

const APP_LOGOS = {
  'kool-jet': {
    name: 'The Neon Equal Jet',
    file: EMBEDDED_LOGOS['kool-jet'],
    fallbackFile: 'logos/kool-jet.png',
    sound: 'victory'
  },
  'kool-wayfinder': {
    name: 'The Cyber Wayfinder',
    file: EMBEDDED_LOGOS['kool-wayfinder'],
    fallbackFile: 'logos/kool-wayfinder.png',
    sound: 'victory'
  },
  'kool-pin': {
    name: 'Destination Equal Pin',
    file: EMBEDDED_LOGOS['kool-pin'],
    fallbackFile: 'logos/kool-pin.png',
    sound: 'victory'
  },
  'kool-aviators': {
    name: 'Chill Aviators & Sunset Split',
    file: EMBEDDED_LOGOS['kool-aviators'],
    fallbackFile: 'logos/kool-aviators.png',
    sound: 'victory'
  },
  'kool-globe': {
    name: 'Global Equal Orbit',
    file: EMBEDDED_LOGOS['kool-globe'],
    fallbackFile: 'logos/kool-globe.png',
    sound: 'victory'
  },
  'suitcase': {
    name: 'The Wanderlust Suitcase',
    file: EMBEDDED_LOGOS['suitcase'],
    fallbackFile: 'logos/icon-suitcase.svg',
    sound: 'victory'
  }
};

function getActiveAppLogoKey() {
  const saved = localStorage.getItem('tb_active_logo');
  if (saved && APP_LOGOS[saved]) {
    return saved;
  }
  return 'kool-jet';
}

function handleLogoLoadError(imgEl) {
  if (!imgEl) return;
  imgEl.onerror = null;
  imgEl.src = EMBEDDED_LOGOS['kool-jet'];
}
window.handleLogoLoadError = handleLogoLoadError;

function applyAppLogo(logoKey) {
  const validKey = APP_LOGOS[logoKey] ? logoKey : 'kool-jet';
  const logo = APP_LOGOS[validKey];
  const headerImg = document.getElementById('appHeaderLogoImg');
  if (headerImg) {
    headerImg.onerror = function() {
      this.onerror = null;
      this.src = EMBEDDED_LOGOS['kool-jet'];
    };
    headerImg.src = logo.file;
  }
  const welcomeImg = document.getElementById('welcomeLogoImg');
  if (welcomeImg) {
    welcomeImg.onerror = function() {
      this.onerror = null;
      this.src = EMBEDDED_LOGOS['kool-jet'];
    };
    welcomeImg.src = logo.file;
  }
  // Update browser tab favicon if element exists
  const linkFavicon = document.querySelector("link[rel*='icon']");
  if (linkFavicon) {
    linkFavicon.href = logo.file;
  }
  updateLogoPickerUI(validKey);
}

function selectAppLogo(logoKey) {
  const validKey = APP_LOGOS[logoKey] ? logoKey : 'kool-jet';
  localStorage.setItem('tb_active_logo', validKey);
  applyAppLogo(validKey);
  SoundEffects.playVictory();
  fireConfetti();
  showToast(`🎉 Active App Logo set to: ${APP_LOGOS[validKey]?.name || 'New Icon'}!`);
}

function previewLogoEffect(logoKey) {
  SoundEffects.playClick();
  const headerImg = document.getElementById('appHeaderLogoImg');
  if (headerImg) {
    headerImg.classList.add('animate-bounce');
    setTimeout(() => headerImg.classList.remove('animate-bounce'), 600);
  }
  showToast(`👀 Previewing: ${APP_LOGOS[logoKey]?.name}`);
}

function handleHeaderLogoTap() {
  SoundEffects.playClick();
  const headerImg = document.getElementById('appHeaderLogoImg');
  if (headerImg) {
    headerImg.style.transform = 'scale(1.25) rotate(15deg)';
    setTimeout(() => {
      headerImg.style.transform = '';
    }, 400);
  }
  openLogoPickerModal();
}

function openLogoPickerModal() {
  updateLogoPickerUI(getActiveAppLogoKey());
  openModal('modalLogoPicker');
}

function updateLogoPickerUI(activeKey) {
  const keys = Object.keys(APP_LOGOS);
  keys.forEach(k => {
    const btn = document.getElementById(`btnSelectLogo-${k}`);
    if (btn) {
      if (k === activeKey) {
        btn.className = 'px-3 py-2 rounded-xl bg-brand-500 text-slate-950 font-black text-xs shrink-0 shadow-lg flex items-center gap-1';
        btn.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i> Active';
      } else {
        btn.className = 'px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs shrink-0 transition-all active-press border border-slate-700';
        btn.textContent = 'Set Icon';
      }
    }
  });
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
