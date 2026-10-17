const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');

const PORT = process.env.PORT || 8090;
const PUBLIC_DIR = path.resolve(__dirname);
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const CLOUD_TRIPS_FILE = path.join(DATA_DIR, 'cloud_trips.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

// Ensure data storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory:', err);
  }
}

// In-Memory Cloud Trips Store (Persistent across server restarts via JSON)
let cloudTrips = {};
try {
  if (fs.existsSync(CLOUD_TRIPS_FILE)) {
    const raw = fs.readFileSync(CLOUD_TRIPS_FILE, 'utf8');
    cloudTrips = JSON.parse(raw);
    console.log(`Loaded ${Object.keys(cloudTrips).length} synced trips from disk.`);
  }
} catch (e) {
  console.warn('Error loading cloud_trips.json, starting fresh:', e);
  cloudTrips = {};
}

// In-Memory Users Directory & Founder Analytics
let usersStore = {};
try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    usersStore = JSON.parse(raw);
    console.log(`Loaded ${Object.keys(usersStore).length} registered users from disk.`);
  }
} catch (e) {
  console.warn('Error loading users.json, starting fresh:', e);
  usersStore = {};
}

// In-Memory Customer Feedback & Reviews
let feedbackStore = [];
try {
  if (fs.existsSync(FEEDBACK_FILE)) {
    const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    feedbackStore = JSON.parse(raw);
    console.log(`Loaded ${feedbackStore.length} customer feedback items from disk.`);
  }
} catch (e) {
  console.warn('Error loading feedback.json, starting fresh:', e);
  feedbackStore = [];
}

// Debounced flush to disk for trips
let saveTimeout = null;
function persistTripsToDisk() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(CLOUD_TRIPS_FILE, JSON.stringify(cloudTrips, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write cloud_trips.json:', e);
    }
  }, 1000);
}

// Debounced flush for users directory
let saveUsersTimeout = null;
function persistUsersToDisk() {
  if (saveUsersTimeout) clearTimeout(saveUsersTimeout);
  saveUsersTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersStore, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write users.json:', e);
    }
  }, 1000);
}

// Debounced flush for feedback
let saveFeedbackTimeout = null;
function persistFeedbackToDisk() {
  if (saveFeedbackTimeout) clearTimeout(saveFeedbackTimeout);
  saveFeedbackTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbackStore, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write feedback.json:', e);
    }
  }, 1000);
}

// MIME type map with explicit charsets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.barabar': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// In-Memory IP Rate Limiter (Defends against DoS and automated crawler scraping)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests per min to allow smooth real-time sync
const ipRequestCounts = new Map();

// Periodic cleanup of rate limiter map every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequestCounts.entries()) {
    if (now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
      ipRequestCounts.delete(ip);
    }
  }
}, 2 * 60 * 1000);

function isRateLimited(clientIp) {
  const now = Date.now();
  const entry = ipRequestCounts.get(clientIp);

  if (!entry) {
    ipRequestCounts.set(clientIp, { count: 1, startTime: now });
    return false;
  }

  if (now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
    entry.count = 1;
    entry.startTime = now;
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (!iface.address.startsWith('169.254.')) {
          if (/wi-?fi|wlan|ethernet/i.test(name)) {
            return iface.address;
          }
          candidates.push(iface.address);
        }
      }
    }
  }
  return candidates[0] || 'localhost';
}

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    res.writeHead(429, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Retry-After': '60',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end('429 Too Many Requests — Security Rate Limit Triggered');
    return;
  }

  // CORS Headers for multi-device sync (Cloudflare tunnel + Local Wi-Fi)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };

  // 2. Handle HTTP OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let rawUrlPath = parsedUrl.pathname;
  try {
    rawUrlPath = decodeURIComponent(rawUrlPath);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    res.end('400 Bad Request — Malformed URL');
    return;
  }

  // Disallow null bytes
  if (rawUrlPath.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    res.end('400 Bad Request');
    return;
  }

  // ==================== ⚡ REAL-TIME CLOUD SYNC API ROUTES ====================
  if (rawUrlPath.startsWith('/api/sync/')) {
    const apiRoute = rawUrlPath.replace('/api/sync/', '').toLowerCase();
    const apiHeaders = {
      ...corsHeaders,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Route: GET /api/sync/status
    if (apiRoute === 'status' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
      res.end(JSON.stringify({
        success: true,
        activeRooms: Object.keys(cloudTrips).length,
        rooms: Object.keys(cloudTrips).map(code => ({
          code,
          name: cloudTrips[code]?.trip?.name,
          expensesCount: (cloudTrips[code]?.trip?.expenses || []).length,
          lastModified: cloudTrips[code]?.lastModified
        })),
        serverTime: Date.now()
      }));
      return;
    }

    // Route: GET /api/sync/trip?code=XYZ
    if (apiRoute === 'trip' && req.method === 'GET') {
      const code = (parsedUrl.query.code || '').toString().trim().toUpperCase();
      if (!code) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
        res.end(JSON.stringify({ success: false, message: 'Missing room code parameter' }));
        return;
      }

      const room = cloudTrips[code];
      if (!room || !room.trip) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
        res.end(JSON.stringify({ success: false, message: `Room ${code} not found on server` }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
      res.end(JSON.stringify({
        success: true,
        code,
        trip: room.trip,
        lastModified: room.lastModified || Date.now(),
        serverTime: Date.now()
      }));
      return;
    }

    // Helper: Server-side CRDT Conflict-Free Trip Merger
    function mergeServerTrips(existingTrip, incomingTrip) {
      if (!existingTrip) return incomingTrip;
      if (!incomingTrip) return existingTrip;

      const existingExpenses = Array.isArray(existingTrip.expenses) ? existingTrip.expenses : [];
      const incomingExpenses = Array.isArray(incomingTrip.expenses) ? incomingTrip.expenses : [];
      const deletedIds = new Set([
        ...(existingTrip.deletedExpenseIds || []),
        ...(incomingTrip.deletedExpenseIds || [])
      ]);

      const expenseMap = new Map();
      existingExpenses.forEach(e => {
        if (e && e.id && !deletedIds.has(e.id)) {
          expenseMap.set(e.id, e);
        }
      });

      incomingExpenses.forEach(e => {
        if (!e || !e.id || deletedIds.has(e.id)) return;
        if (!expenseMap.has(e.id)) {
          expenseMap.set(e.id, e);
        } else {
          const existing = expenseMap.get(e.id);
          const incomingTime = e.updatedAt || e.createdAt || 0;
          const existingTime = existing.updatedAt || existing.createdAt || 0;
          if (incomingTime >= existingTime) {
            expenseMap.set(e.id, e);
          }
        }
      });

      const memberMap = new Map();
      (existingTrip.members || []).forEach(m => { if (m && m.id) memberMap.set(m.id, m); });
      (incomingTrip.members || []).forEach(m => {
        if (!m || !m.id) return;
        if (!memberMap.has(m.id)) {
          memberMap.set(m.id, m);
        } else {
          const existing = memberMap.get(m.id);
          memberMap.set(m.id, { ...existing, ...m, upi: m.upi || existing.upi, phone: m.phone || existing.phone });
        }
      });

      const settlementMap = new Map();
      (existingTrip.settlements || []).forEach(s => { if (s && s.id) settlementMap.set(s.id, s); });
      (incomingTrip.settlements || []).forEach(s => { if (s && s.id) settlementMap.set(s.id, s); });

      return {
        ...existingTrip,
        ...incomingTrip,
        name: incomingTrip.name || existingTrip.name,
        members: Array.from(memberMap.values()),
        expenses: Array.from(expenseMap.values()),
        settlements: Array.from(settlementMap.values()),
        deletedExpenseIds: Array.from(deletedIds),
        kitty: (incomingTrip.kitty?.transactions?.length || 0) >= (existingTrip.kitty?.transactions?.length || 0)
          ? (incomingTrip.kitty || existingTrip.kitty)
          : existingTrip.kitty
      };
    }

    // Route: POST /api/sync/trip
    if (apiRoute === 'trip' && req.method === 'POST') {
      let bodyData = '';
      const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5MB limit

      req.on('data', chunk => {
        bodyData += chunk;
        if (bodyData.length > MAX_BODY_BYTES) {
          res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
          res.end(JSON.stringify({ success: false, message: 'Payload Too Large (Max 5MB)' }));
          req.destroy();
        }
      });

      req.on('end', () => {
        try {
          const payload = JSON.parse(bodyData);
          const rawCode = (payload.code || (payload.trip && payload.trip.code) || '').toString().trim().toUpperCase();

          if (!rawCode || rawCode.length < 2 || rawCode.length > 32) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
            res.end(JSON.stringify({ success: false, message: 'Invalid room code (2-32 chars required)' }));
            return;
          }

          if (!payload.trip || typeof payload.trip !== 'object') {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
            res.end(JSON.stringify({ success: false, message: 'Invalid trip object provided' }));
            return;
          }

          const now = Date.now();
          const existingRoom = cloudTrips[rawCode];
          const mergedTrip = existingRoom ? mergeServerTrips(existingRoom.trip, payload.trip) : payload.trip;

          cloudTrips[rawCode] = {
            trip: mergedTrip,
            lastModified: now,
            updatedBy: payload.sender || 'Friend',
            ip: clientIp
          };

          persistTripsToDisk();

          console.log(`[CloudSync] Trip room ${rawCode} updated (${(mergedTrip.expenses || []).length} expenses)`);

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
          res.end(JSON.stringify({
            success: true,
            code: rawCode,
            lastModified: now,
            serverTime: now
          }));
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', ...apiHeaders });
          res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders });
    res.end(JSON.stringify({ success: false, message: 'Unknown API endpoint' }));
    return;
  }

  // ==================== 👤 AUTHENTICATION & USER PROFILE API ====================
  if (rawUrlPath.startsWith('/api/auth/')) {
    const authRoute = rawUrlPath.replace('/api/auth/', '').toLowerCase();
    const apiHeaders = {
      ...corsHeaders,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'application/json; charset=utf-8'
    };

    // Route: POST /api/auth/register-or-login
    if (authRoute === 'register-or-login' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(bodyData || '{}');
          const name = (payload.name || '').trim();
          const phone = (payload.phone || '').trim();
          const email = (payload.email || '').trim().toLowerCase();
          const provider = payload.provider || (email ? 'google' : 'mobile');

          if (!name) {
            res.writeHead(400, apiHeaders);
            res.end(JSON.stringify({ success: false, message: 'Name is required' }));
            return;
          }

          // Stable unique identifier based on contact, or random ID
          const rawIdKey = phone ? `phone_${phone.replace(/\D/g, '')}` : (email ? `email_${email}` : `usr_${Date.now()}`);
          const userId = payload.userId || rawIdKey;
          const now = Date.now();

          // Detect Founder Admin Privileges (Ankuj or admin email/phone)
          const isFounder = name.toLowerCase() === 'ankuj' || 
                            email.includes('ankuj') || 
                            phone.includes('9999999999') ||
                            payload.isAdmin === true;

          const existingUser = usersStore[userId] || {};
          const userRecord = {
            id: userId,
            name: name,
            phone: phone || existingUser.phone || '',
            email: email || existingUser.email || '',
            avatar: payload.avatar || existingUser.avatar || '',
            provider: provider,
            location: {
              city: payload.city || existingUser.location?.city || 'Local',
              country: payload.country || existingUser.location?.country || 'India',
              ip: clientIp
            },
            device: {
              userAgent: req.headers['user-agent'] || 'Unknown',
              platform: payload.platform || (req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop'),
              appVersion: '2.0.0-PRO'
            },
            isAdmin: isFounder || existingUser.isAdmin === true,
            createdAt: existingUser.createdAt || now,
            lastActive: now,
            tripsCount: (existingUser.tripsCount || 0) + (payload.newTrip ? 1 : 0)
          };

          usersStore[userId] = userRecord;
          persistUsersToDisk();

          console.log(`[Auth] User active: ${userRecord.name} (${userRecord.phone || userRecord.email || userRecord.id}) - Admin: ${userRecord.isAdmin}`);

          res.writeHead(200, apiHeaders);
          res.end(JSON.stringify({
            success: true,
            user: userRecord,
            token: `tb_token_${Buffer.from(userId + ':' + now).toString('base64')}`
          }));
        } catch (err) {
          res.writeHead(400, apiHeaders);
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON request' }));
        }
      });
      return;
    }

    // Route: GET /api/auth/session?userId=XYZ
    if (authRoute === 'session' && req.method === 'GET') {
      const qUserId = (parsedUrl.query.userId || '').toString().trim();
      if (!qUserId || !usersStore[qUserId]) {
        res.writeHead(404, apiHeaders);
        res.end(JSON.stringify({ success: false, message: 'User session not found' }));
        return;
      }

      // Update last active
      usersStore[qUserId].lastActive = Date.now();
      persistUsersToDisk();

      res.writeHead(200, apiHeaders);
      res.end(JSON.stringify({ success: true, user: usersStore[qUserId] }));
      return;
    }
  }

  // ==================== 💬 CUSTOMER FEEDBACK & REVIEWS API ====================
  if (rawUrlPath.startsWith('/api/feedback/')) {
    const fbRoute = rawUrlPath.replace('/api/feedback/', '').toLowerCase();
    const apiHeaders = {
      ...corsHeaders,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'application/json; charset=utf-8'
    };

    // Route: POST /api/feedback/submit
    if (fbRoute === 'submit' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(bodyData || '{}');
          if (!payload.message) {
            res.writeHead(400, apiHeaders);
            res.end(JSON.stringify({ success: false, message: 'Message content is required' }));
            return;
          }

          const fbItem = {
            id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            userId: payload.userId || 'guest',
            userName: payload.userName || 'Anonymous Traveler',
            userContact: payload.userContact || '',
            tripCode: payload.tripCode || '',
            category: payload.category || 'Feedback', // Feedback, Bug, Suggestion, Praise
            rating: parseInt(payload.rating || 5, 10),
            message: payload.message,
            timestamp: Date.now(),
            reply: null,
            replyAt: null,
            status: 'pending'
          };

          feedbackStore.unshift(fbItem);
          persistFeedbackToDisk();

          console.log(`[Feedback] New ${fbItem.category} from ${fbItem.userName}: "${fbItem.message.substring(0, 40)}..."`);

          res.writeHead(200, apiHeaders);
          res.end(JSON.stringify({
            success: true,
            message: 'Feedback received! Founder Ankuj and the team will review this.',
            feedbackId: fbItem.id
          }));
        } catch (err) {
          res.writeHead(400, apiHeaders);
          res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload' }));
        }
      });
      return;
    }
  }

  // ==================== 👑 FOUNDER & ADMIN CONSOLE API ====================
  if (rawUrlPath.startsWith('/api/admin/')) {
    const adminRoute = rawUrlPath.replace('/api/admin/', '').toLowerCase();
    const apiHeaders = {
      ...corsHeaders,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'application/json; charset=utf-8'
    };

    // Route: GET /api/admin/users
    if (adminRoute === 'users' && req.method === 'GET') {
      const userList = Object.values(usersStore).sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
      res.writeHead(200, apiHeaders);
      res.end(JSON.stringify({
        success: true,
        totalUsers: userList.length,
        users: userList,
        serverTime: Date.now()
      }));
      return;
    }

    // Route: GET /api/admin/feedback
    if (adminRoute === 'feedback' && req.method === 'GET') {
      res.writeHead(200, apiHeaders);
      res.end(JSON.stringify({
        success: true,
        totalFeedback: feedbackStore.length,
        feedback: feedbackStore
      }));
      return;
    }

    // Route: POST /api/admin/reply
    if (adminRoute === 'reply' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(bodyData || '{}');
          const fbId = payload.feedbackId;
          const replyText = (payload.replyText || '').trim();

          const target = feedbackStore.find(f => f.id === fbId);
          if (!target) {
            res.writeHead(404, apiHeaders);
            res.end(JSON.stringify({ success: false, message: 'Feedback not found' }));
            return;
          }

          target.reply = replyText;
          target.replyAt = Date.now();
          target.status = 'resolved';
          persistFeedbackToDisk();

          res.writeHead(200, apiHeaders);
          res.end(JSON.stringify({ success: true, message: 'Reply sent and recorded', feedback: target }));
        } catch (err) {
          res.writeHead(400, apiHeaders);
          res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload' }));
        }
      });
      return;
    }
  }

  // ==================== 📁 STATIC FILE SERVING ====================
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET, POST, HEAD, OPTIONS',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end('405 Method Not Allowed');
    return;
  }

  if (rawUrlPath === '/' || !rawUrlPath) rawUrlPath = '/index.html';

  // Canonicalize path and ensure it stays inside PUBLIC_DIR
  const resolvedPath = path.resolve(PUBLIC_DIR, '.' + rawUrlPath);

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end('403 Forbidden — Path Traversal Detected');
    return;
  }

  // Military-Grade HTTP Security Headers
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://open.er-api.com; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; worker-src 'self' blob:; img-src 'self' data: https: blob:; connect-src 'self' https: ws: wss: blob:; font-src 'self' https://cdnjs.cloudflare.com; frame-ancestors 'none';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(), payment=()',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...corsHeaders
  };

  fs.stat(resolvedPath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
        ...securityHeaders
      });
      res.end('404 File Not Found');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      ...securityHeaders
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const readStream = fs.createReadStream(resolvedPath);
    readStream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', ...securityHeaders });
      }
      res.end('500 Server Stream Error');
    });
    readStream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('========================================================');
  console.log('   🛡️ TRIP BARABAR — MILITARY HARDENED SERVER (v2.0)   ');
  console.log('   Tagline: Trip Sorted. Hisaab Barabar.               ');
  console.log('   Active Features:                                     ');
  console.log('   ✓ Real-Time Multi-Friend Live Cloud Sync (/api/sync) ');
  console.log('   ✓ Persistent Disk Storage for Trip Rooms            ');
  console.log('   ✓ CSP + Anti-Clickjacking (X-Frame-Options: DENY)   ');
  console.log('   ✓ In-Memory IP Rate Limiter (300 req/min)           ');
  console.log('   ✓ 24/7 Cloud Keep-Alive Heartbeat (Zero Cold Starts)');
  console.log('========================================================');
  console.log(`Server running securely at:`);
  console.log(`- PC / Laptop URL : http://localhost:${PORT}`);
  console.log(`- Mobile Phone URL: http://${localIp}:${PORT}`);
  console.log('========================================================');
});

// ==================== ⚡ 24/7 CLOUD KEEP-ALIVE PINGER ====================
// Render's free tier sleeps after 15 minutes of inactivity.
// Pinging its own public URL every 10 minutes keeps the service awake 24/7 permanently.
const RENDER_PUBLIC_URL = process.env.RENDER_EXTERNAL_URL || 'https://trip-barabar.onrender.com';
const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

setInterval(() => {
  const pingUrl = `${RENDER_PUBLIC_URL}/api/sync/status?_heartbeat=${Date.now()}`;
  const https = require('https');
  const http = require('http');
  const client = pingUrl.startsWith('https') ? https : http;

  client.get(pingUrl, (res) => {
    // Self-ping success - keeps container warm
  }).on('error', (err) => {
    // Ignore transient network hiccups
  });
}, KEEP_ALIVE_INTERVAL_MS);

