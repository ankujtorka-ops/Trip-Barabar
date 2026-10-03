const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, 'logos');
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// 1. THE WANDERLUST SUITCASE (Luggage with Equal Straps & Destination Stamps)
const svgSuitcase = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#091E32"/>
      <stop offset="100%" stop-color="#042F2E"/>
    </linearGradient>
    
    <!-- Outer Glow -->
    <radialGradient id="ambGlow1" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#0D9488" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0"/>
    </radialGradient>

    <!-- Suitcase Body Gradient -->
    <linearGradient id="caseBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="40%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>

    <!-- Leather / Gold Straps -->
    <linearGradient id="goldStrap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="35%" stop-color="#F59E0B"/>
      <stop offset="70%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <!-- Brass Corners -->
    <linearGradient id="brassCorner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#854D0E"/>
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FBBF24" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad1)"/>
  <rect width="512" height="512" rx="112" fill="url(#ambGlow1)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3"/>

  <!-- Main Suitcase Group -->
  <g filter="url(#shadow3D)">
    <!-- Suitcase Handle Top -->
    <path d="M 206,120 L 206,92 C 206,78 218,66 232,66 L 280,66 C 294,66 306,78 306,92 L 306,120" 
          fill="none" stroke="url(#goldStrap)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Handle Brass Mounts -->
    <rect x="194" y="112" width="24" height="18" rx="4" fill="url(#brassCorner)"/>
    <rect x="294" y="112" width="24" height="18" rx="4" fill="url(#brassCorner)"/>

    <!-- Suitcase Main Shell -->
    <rect x="76" y="120" width="360" height="270" rx="36" fill="url(#caseBody)"/>
    <!-- Suitcase Inner Shadow/Bevel -->
    <rect x="84" y="128" width="344" height="254" rx="28" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
    
    <!-- Central Seam Split (Zip / Hinge) -->
    <line x1="76" y1="255" x2="436" y2="255" stroke="#042F2E" stroke-width="5" stroke-opacity="0.6"/>

    <!-- 🌟 THE 'BARABAR' EQUAL SIGN STRAPS (2 Parallel Horizontal Leather Straps) -->
    <!-- Top Equal Bar Strap -->
    <g filter="url(#neonGlow)">
      <rect x="66" y="180" width="380" height="34" rx="10" fill="url(#goldStrap)"/>
      <rect x="66" y="180" width="380" height="34" rx="10" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <!-- Brass Buckles -->
      <rect x="146" y="174" width="30" height="46" rx="6" fill="url(#brassCorner)"/>
      <rect x="153" y="184" width="16" height="26" rx="3" fill="#042F2E"/>
      <rect x="336" y="174" width="30" height="46" rx="6" fill="url(#brassCorner)"/>
      <rect x="343" y="184" width="16" height="26" rx="3" fill="#042F2E"/>
    </g>

    <!-- Bottom Equal Bar Strap -->
    <g filter="url(#neonGlow)">
      <rect x="66" y="296" width="380" height="34" rx="10" fill="url(#goldStrap)"/>
      <rect x="66" y="296" width="380" height="34" rx="10" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <!-- Brass Buckles -->
      <rect x="146" y="290" width="30" height="46" rx="6" fill="url(#brassCorner)"/>
      <rect x="153" y="300" width="16" height="26" rx="3" fill="#042F2E"/>
      <rect x="336" y="290" width="30" height="46" rx="6" fill="url(#brassCorner)"/>
      <rect x="343" y="300" width="16" height="26" rx="3" fill="#042F2E"/>
    </g>

    <!-- 4 Reinforced Brass Corners -->
    <path d="M 76,156 L 76,136 C 76,127 83,120 92,120 L 112,120 C 112,140 96,156 76,156 Z" fill="url(#brassCorner)"/>
    <path d="M 436,156 L 436,136 C 436,127 429,120 420,120 L 400,120 C 400,140 416,156 436,156 Z" fill="url(#brassCorner)"/>
    <path d="M 76,354 L 76,374 C 76,383 83,390 92,390 L 112,390 C 112,370 96,354 76,354 Z" fill="url(#brassCorner)"/>
    <path d="M 436,354 L 436,374 C 436,383 429,390 420,390 L 400,390 C 400,370 416,354 436,354 Z" fill="url(#brassCorner)"/>

    <!-- 🌴 Travel Destination Stickers on Luggage -->
    <!-- 1. Beach Palm Sticker -->
    <g transform="translate(200, 226) rotate(-8)">
      <circle cx="28" cy="28" r="26" fill="#F43F5E" stroke="#FFFFFF" stroke-width="2"/>
      <text x="28" y="34" font-size="22" text-anchor="middle">🌴</text>
    </g>
    <!-- 2. Flight Jet Sticker -->
    <g transform="translate(262, 222) rotate(12)">
      <rect x="0" y="0" width="56" height="34" rx="8" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="28" y="24" font-size="18" text-anchor="middle">✈️</text>
    </g>

    <!-- Luggage Tag Hanging Off Handle -->
    <g transform="translate(300, 118) rotate(22)">
      <line x1="0" y1="0" x2="0" y2="28" stroke="#FDE047" stroke-width="3"/>
      <polygon points="-16,28 16,28 22,64 -22,64" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <circle cx="0" cy="34" r="3" fill="#D97706"/>
      <text x="0" y="52" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#78350F" text-anchor="middle">BARABAR</text>
    </g>
  </g>

  <!-- Bottom Brand Ribbon -->
  <text x="256" y="446" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
    TRIP BARABAR
  </text>
  <text x="256" y="472" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#2DD4BF" text-anchor="middle">
    HISAAB SORTED • =
  </text>
</svg>`;

// 2. THE EXPLORER'S GLOBE & JET FLIGHT (Orbiting Equal Rings)
const svgGlobe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D1A"/>
      <stop offset="50%" stop-color="#0E1A34"/>
      <stop offset="100%" stop-color="#0A2540"/>
    </linearGradient>

    <!-- Globe Sphere Gradient -->
    <radialGradient id="globeOcean" cx="40%" cy="36%" r="65%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="55%" stop-color="#0284C7"/>
      <stop offset="90%" stop-color="#0369A1"/>
      <stop offset="100%" stop-color="#082F49"/>
    </radialGradient>

    <!-- Landmass Gradient -->
    <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="70%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#065F46"/>
    </linearGradient>

    <!-- Golden Orbit Trail -->
    <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.1"/>
      <stop offset="40%" stop-color="#FBBF24" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FDE047"/>
    </linearGradient>

    <!-- Map Pin Gradient -->
    <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="50%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#9F1239"/>
    </linearGradient>

    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#FDE047" flood-opacity="0.7"/>
    </filter>
    <filter id="shadowGlobe" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
  </defs>

  <!-- App Icon Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad2)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="rgba(56,189,248,0.2)" stroke-width="3"/>

  <!-- Distant Twinkling Stars -->
  <circle cx="90" cy="110" r="2.5" fill="#BAE6FD" opacity="0.8"/>
  <circle cx="410" cy="120" r="3" fill="#FDE047" opacity="0.9"/>
  <circle cx="430" cy="380" r="2" fill="#BAE6FD" opacity="0.6"/>
  <circle cx="80" cy="390" r="2.5" fill="#FDE047" opacity="0.7"/>

  <!-- Main 3D Globe -->
  <g filter="url(#shadowGlobe)" transform="translate(256, 230)">
    <!-- Atmosphere Halo -->
    <circle cx="0" cy="0" r="144" fill="#38BDF8" opacity="0.18"/>
    
    <!-- Ocean Base -->
    <circle cx="0" cy="0" r="136" fill="url(#globeOcean)"/>

    <!-- Graticule (Lat/Long Lines) -->
    <ellipse cx="0" cy="0" rx="136" ry="60" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="60" ry="136" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <line x1="-136" y1="0" x2="136" y2="0" stroke="rgba(255,255,255,0.22)" stroke-width="2.5"/>
    <line x1="0" y1="-136" x2="0" y2="136" stroke="rgba(255,255,255,0.22)" stroke-width="2.5"/>

    <!-- Stylized Continents -->
    <path d="M -80,-50 C -60,-80 -20,-90 -10,-60 C 0,-30 -30,-10 -60,0 C -90,10 -100,-20 -80,-50 Z" fill="url(#landGrad)"/>
    <path d="M 30,-70 C 60,-80 80,-40 70,-10 C 60,20 20,30 10,0 C 0,-30 10,-60 30,-70 Z" fill="url(#landGrad)"/>
    <path d="M -40,40 C -10,20 30,50 20,80 C 10,110 -30,100 -50,70 Z" fill="url(#landGrad)"/>

    <!-- Glass Specular Highlight -->
    <path d="M -90,-90 C -40,-130 40,-130 90,-90 C 40,-110 -40,-110 -90,-90 Z" fill="#FFFFFF" opacity="0.35"/>

    <!-- 🌟 THE EQUAL ORBIT TRAILS (= SIGN IN FLIGHT ORBIT) -->
    <!-- Top Parallel Ring -->
    <ellipse cx="0" cy="-22" rx="168" ry="46" fill="none" stroke="url(#orbitGold)" stroke-width="12" stroke-linecap="round"
             transform="rotate(-18)" filter="url(#glowGold)"/>
    <!-- Bottom Parallel Ring -->
    <ellipse cx="0" cy="22" rx="168" ry="46" fill="none" stroke="url(#orbitGold)" stroke-width="12" stroke-linecap="round"
             transform="rotate(-18)" filter="url(#glowGold)"/>

    <!-- ✈️ Modern Jet flying along the top orbit -->
    <g transform="translate(130, -78) rotate(32)">
      <polygon points="0,-18 10,14 0,8 -10,14" fill="#FFFFFF" filter="url(#glowGold)"/>
      <polygon points="0,-18 24,6 4,4" fill="#F8FAFC"/>
      <polygon points="0,-18 -24,6 -4,4" fill="#E2E8F0"/>
    </g>

    <!-- 📍 Destination Map Pin on North Pole with = sign in center -->
    <g transform="translate(-16, -148)">
      <path d="M 16,0 C 7,0 0,7 0,16 C 0,28 16,46 16,46 C 16,46 32,28 32,16 C 32,7 25,0 16,0 Z" fill="url(#pinGrad)"/>
      <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
      <!-- Equal Sign in Pin Center -->
      <line x1="11" y1="13" x2="21" y2="13" stroke="#E11D48" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="11" y1="18" x2="21" y2="18" stroke="#E11D48" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Typography -->
  <text x="256" y="446" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
    TRIP BARABAR
  </text>
  <text x="256" y="472" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#38BDF8" text-anchor="middle">
    GLOBAL ADVENTURES • =
  </text>
</svg>`;

// 3. THE ADVENTURE BACKPACK (Trekker Rucksack with Equal Straps)
const svgBackpack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Sunset Desert / Mountain Glow) -->
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="50%" stop-color="#311042"/>
      <stop offset="100%" stop-color="#4C1D24"/>
    </linearGradient>

    <!-- Backpack Canvas Material -->
    <linearGradient id="packOrange" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="40%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>

    <linearGradient id="packTeal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>

    <!-- Equal Webbing Straps -->
    <linearGradient id="equalStrapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="50%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <filter id="packShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
  </defs>

  <!-- App Icon Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad3)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="rgba(251,146,60,0.25)" stroke-width="3"/>

  <!-- Sleeping Mat Rolled at Top -->
  <g transform="translate(126, 74)">
    <rect x="0" y="0" width="260" height="42" rx="21" fill="#0D9488" stroke="#042F2E" stroke-width="3"/>
    <ellipse cx="21" cy="21" rx="14" ry="18" fill="#14B8A6" stroke="#042F2E" stroke-width="2"/>
    <ellipse cx="239" cy="21" rx="14" ry="18" fill="#0F766E"/>
    <!-- Mat Straps -->
    <rect x="65" y="-2" width="16" height="46" rx="4" fill="#F59E0B"/>
    <rect x="175" y="-2" width="16" height="46" rx="4" fill="#F59E0B"/>
  </g>

  <!-- Main Rucksack Group -->
  <g filter="url(#packShadow)">
    <!-- Backpack Main Teardrop Body -->
    <path d="M 166,110 L 346,110 C 390,110 410,160 406,280 C 402,360 376,385 346,385 L 166,385 C 136,385 110,360 106,280 C 102,160 122,110 166,110 Z" 
          fill="url(#packOrange)"/>
    
    <!-- Top Flap Lid -->
    <path d="M 156,110 L 356,110 C 376,110 380,140 370,180 L 142,180 C 132,140 136,110 156,110 Z" 
          fill="url(#packTeal)"/>

    <!-- Front Cargo Pouch -->
    <rect x="156" y="210" width="200" height="150" rx="24" fill="#C2410C"/>

    <!-- 🌟 THE EQUAL SIGN CHEST STRAPS (=) -->
    <!-- Top Strap -->
    <g>
      <rect x="110" y="235" width="292" height="28" rx="8" fill="url(#equalStrapGrad)"/>
      <!-- Quick-Release Plastic Buckle -->
      <rect x="236" y="227" width="40" height="44" rx="8" fill="#1E293B"/>
      <rect x="246" y="235" width="20" height="28" rx="4" fill="#475569"/>
    </g>
    <!-- Bottom Strap -->
    <g>
      <rect x="110" y="300" width="292" height="28" rx="8" fill="url(#equalStrapGrad)"/>
      <!-- Quick-Release Plastic Buckle -->
      <rect x="236" y="292" width="40" height="44" rx="8" fill="#1E293B"/>
      <rect x="246" y="300" width="20" height="28" rx="4" fill="#475569"/>
    </g>

    <!-- 🕶️ Cool Dark Aviator Sunglasses Hooked on Top Flap -->
    <g transform="translate(206, 160)">
      <!-- Left Lens -->
      <path d="M 12,0 C 2,0 -4,12 -2,24 C 0,36 12,42 26,40 C 38,38 42,26 40,12 C 38,0 26,0 12,0 Z" fill="#0F172A" stroke="#FDE047" stroke-width="4"/>
      <!-- Right Lens -->
      <path d="M 68,0 C 58,0 52,12 54,24 C 56,36 68,42 82,40 C 94,38 98,26 96,12 C 94,0 82,0 68,0 Z" fill="#0F172A" stroke="#FDE047" stroke-width="4"/>
      <!-- Bridge -->
      <path d="M 38,10 Q 47,4 56,10" fill="none" stroke="#FDE047" stroke-width="4"/>
      <!-- Palm Reflection in Glasses -->
      <text x="20" y="28" font-size="14" opacity="0.6">🌴</text>
      <text x="76" y="28" font-size="14" opacity="0.6">🌴</text>
    </g>
  </g>

  <!-- Typography -->
  <text x="256" y="446" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
    TRIP BARABAR
  </text>
  <text x="256" y="472" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#FB923C" text-anchor="middle">
    TREKS & GETAWAYS • =
  </text>
</svg>`;

// 4. THE FIRST CLASS PASSPORT & BOARDING PASS (Travel VIP)
const svgPassport = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021B35"/>
      <stop offset="50%" stop-color="#052E54"/>
      <stop offset="100%" stop-color="#0B1528"/>
    </linearGradient>

    <!-- Navy Leather Passport -->
    <linearGradient id="navyLeather" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="40%" stop-color="#172554"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <!-- Foil Gold -->
    <linearGradient id="foilGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="30%" stop-color="#FACC15"/>
      <stop offset="70%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>

    <!-- Boarding Pass Gradient -->
    <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>

    <filter id="passShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- App Icon Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad4)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="rgba(250,204,21,0.25)" stroke-width="3"/>

  <!-- Tilted Boarding Pass sticking out behind Passport -->
  <g transform="translate(180, 100) rotate(16)" filter="url(#passShadow)">
    <rect x="0" y="0" width="220" height="130" rx="16" fill="url(#ticketGrad)" stroke="#F59E0B" stroke-width="2"/>
    <!-- Flight Cutout Notches -->
    <circle cx="0" cy="65" r="10" fill="#052E54"/>
    <circle cx="220" cy="65" r="10" fill="#052E54"/>
    <!-- Flight Route -->
    <text x="24" y="40" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#1E293B">DEL ➔ GOA / BKK</text>
    <text x="24" y="60" font-family="monospace" font-size="10" font-weight="700" fill="#64748B">CLASS: FIRST • SEAT 01A</text>
    <text x="24" y="85" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#D97706">₹ BARABAR</text>
    <!-- Barcode -->
    <line x1="160" y1="20" x2="160" y2="70" stroke="#1E293B" stroke-width="3"/>
    <line x1="166" y1="20" x2="166" y2="70" stroke="#1E293B" stroke-width="2"/>
    <line x1="172" y1="20" x2="172" y2="70" stroke="#1E293B" stroke-width="4"/>
    <line x1="180" y1="20" x2="180" y2="70" stroke="#1E293B" stroke-width="1.5"/>
    <line x1="186" y1="20" x2="186" y2="70" stroke="#1E293B" stroke-width="3"/>
    <line x1="194" y1="20" x2="194" y2="70" stroke="#1E293B" stroke-width="2"/>
  </g>

  <!-- Main Passport Booklet (Tilted -6deg) -->
  <g transform="translate(100, 110) rotate(-6)" filter="url(#passShadow)">
    <rect x="0" y="0" width="230" height="300" rx="20" fill="url(#navyLeather)"/>
    <!-- Gold Embossed Border -->
    <rect x="12" y="12" width="206" height="276" rx="14" fill="none" stroke="url(#foilGold)" stroke-width="2.5" opacity="0.85"/>
    
    <!-- Golden Globe Emblem -->
    <circle cx="115" cy="115" r="44" fill="none" stroke="url(#foilGold)" stroke-width="3"/>
    <ellipse cx="115" cy="115" rx="44" ry="18" fill="none" stroke="url(#foilGold)" stroke-width="2"/>
    <ellipse cx="115" cy="115" rx="18" ry="44" fill="none" stroke="url(#foilGold)" stroke-width="2"/>
    <line x1="71" y1="115" x2="159" y2="115" stroke="url(#foilGold)" stroke-width="2"/>

    <!-- Foil Text -->
    <text x="115" y="48" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="4" fill="url(#foilGold)" text-anchor="middle">
      PASSPORT
    </text>
    <text x="115" y="195" font-family="system-ui, sans-serif" font-size="15" font-weight="900" letter-spacing="2" fill="url(#foilGold)" text-anchor="middle">
      TRIP BARABAR
    </text>

    <!-- 🌟 THE EQUAL EMBOSS BAR (=) -->
    <rect x="80" y="215" width="70" height="7" rx="3.5" fill="url(#foilGold)"/>
    <rect x="80" y="228" width="70" height="7" rx="3.5" fill="url(#foilGold)"/>

    <!-- Biometric Chip Symbol -->
    <rect x="100" y="255" width="30" height="18" rx="4" fill="none" stroke="url(#foilGold)" stroke-width="2"/>
    <line x1="94" y1="264" x2="136" y2="264" stroke="url(#foilGold)" stroke-width="2"/>
    <circle cx="115" cy="264" r="4" fill="url(#navyLeather)" stroke="url(#foilGold)" stroke-width="2"/>
  </g>

  <!-- 🔴 Red Official "VISA APPROVED / HISAAB 100%" Stamp Stamped On Top -->
  <g transform="translate(320, 260) rotate(14)">
    <circle cx="0" cy="0" r="54" fill="none" stroke="#F43F5E" stroke-width="4.5" stroke-dasharray="6,3"/>
    <circle cx="0" cy="0" r="45" fill="none" stroke="#F43F5E" stroke-width="2"/>
    <text x="0" y="-12" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" letter-spacing="2" fill="#F43F5E" text-anchor="middle">OFFICIAL VISA</text>
    <text x="0" y="8" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#F43F5E" text-anchor="middle">✓ BARABAR</text>
    <text x="0" y="24" font-family="monospace" font-size="8.5" font-weight="700" fill="#F43F5E" text-anchor="middle">100% AUDITED</text>
  </g>

  <!-- Typography -->
  <text x="256" y="446" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
    TRIP BARABAR
  </text>
  <text x="256" y="472" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#FACC15" text-anchor="middle">
    PASSPORT & FLIGHTS • =
  </text>
</svg>`;

fs.writeFileSync(path.join(LOGOS_DIR, 'icon-suitcase.svg'), svgSuitcase, 'utf8');
fs.writeFileSync(path.join(LOGOS_DIR, 'icon-globe.svg'), svgGlobe, 'utf8');
fs.writeFileSync(path.join(LOGOS_DIR, 'icon-backpack.svg'), svgBackpack, 'utf8');
fs.writeFileSync(path.join(LOGOS_DIR, 'icon-passport.svg'), svgPassport, 'utf8');

console.log('Successfully generated 4 travel-friendly vector icons in logos/ directory!');
