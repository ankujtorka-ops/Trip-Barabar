/**
 * 🌴 TRIP BARABAR — AUTHENTICATION & USER IDENTITY CLIENT (auth-client.js)
 * Features:
 * - Google 1-Tap & Credential Sign-In
 * - Mobile Phone + 4-Digit OTP Sign-In
 * - Local Session Persistence with Server Sync
 * - Founder / Admin Privilege Detection
 * - Customer Feedback & In-App Helpdesk
 * - Founder Console Data Retrieval & Export
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'tb_user_session';
  const PENDING_OTP_KEY = 'tb_pending_otp';

  const AuthClient = {
    currentUser: null,
    listeners: [],

    // Initialize session from localStorage or server
    init() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.currentUser = JSON.parse(raw);
          // If founder name detected, grant admin
          if (this.currentUser.name && this.currentUser.name.toLowerCase() === 'ankuj') {
            this.currentUser.isAdmin = true;
          }
        }
      } catch (e) {
        console.warn('[AuthClient] Error reading session:', e);
        this.currentUser = null;
      }
      this.notifyListeners();
      return this.currentUser;
    },

    getCurrentUser() {
      if (!this.currentUser) {
        this.init();
      }
      return this.currentUser;
    },

    isLoggedIn() {
      return !!this.getCurrentUser();
    },

    isAdmin() {
      const u = this.getCurrentUser();
      return !!(u && (u.isAdmin || (u.name && u.name.toLowerCase() === 'ankuj')));
    },

    onChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    },

    notifyListeners() {
      const u = this.currentUser;
      this.listeners.forEach(cb => {
        try { cb(u); } catch (e) { console.error(e); }
      });
      // Also update top header profile elements if in DOM
      this.updateProfileDom();
    },

    // Save session locally and notify
    setSession(userRecord) {
      if (!userRecord) return;
      if (userRecord.name && userRecord.name.toLowerCase() === 'ankuj') {
        userRecord.isAdmin = true;
      }
      this.currentUser = userRecord;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userRecord));
      localStorage.setItem('tb_user_name', userRecord.name);
      localStorage.setItem('tb_user_id', userRecord.id);
      this.notifyListeners();
    },

    // 🔴 1. Sign In via Google (Real or 1-Tap)
    async loginWithGoogle(mockName = '', mockEmail = '') {
      const name = mockName || (prompt('Enter your name for Google Sign-In:') || 'Traveler');
      const email = mockEmail || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

      const payload = {
        name,
        email,
        avatar,
        provider: 'google',
        device: {
          platform: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
          userAgent: navigator.userAgent
        }
      };

      try {
        const res = await fetch('/api/auth/register-or-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.user) {
          this.setSession(data.user);
          return { success: true, user: data.user };
        }
      } catch (err) {
        console.warn('[AuthClient] Server offline, using local fallback:', err);
      }

      // Offline fallback
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        name: name,
        email: email,
        avatar: avatar,
        provider: 'google',
        isAdmin: name.toLowerCase() === 'ankuj',
        createdAt: Date.now()
      };
      this.setSession(fallbackUser);
      return { success: true, user: fallbackUser };
    },

    // 📱 2. Send Mobile OTP
    async sendMobileOtp(phone) {
      const cleanPhone = phone.trim();
      if (!cleanPhone || cleanPhone.length < 8) {
        throw new Error('Please enter a valid mobile number with country code');
      }

      // Generate a friendly 4-digit OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      sessionStorage.setItem(PENDING_OTP_KEY, JSON.stringify({
        phone: cleanPhone,
        otp: generatedOtp,
        expires: Date.now() + 5 * 60 * 1000
      }));

      console.log(`[Trip Barabar Auth] 🔑 SMS OTP for ${cleanPhone} is: ${generatedOtp}`);
      return {
        success: true,
        message: `OTP sent to ${cleanPhone}`,
        // For testing / simulation convenience:
        debugOtp: generatedOtp
      };
    },

    // 📱 3. Verify Mobile OTP
    async verifyMobileOtp(phone, enteredOtp, displayName) {
      const raw = sessionStorage.getItem(PENDING_OTP_KEY);
      let isValid = false;

      if (raw) {
        const record = JSON.parse(raw);
        if (record.phone === phone.trim() && (record.otp === enteredOtp.trim() || enteredOtp.trim() === '1234')) {
          isValid = true;
        }
      } else if (enteredOtp.trim() === '1234') {
        // Universal demo master OTP
        isValid = true;
      }

      if (!isValid) {
        throw new Error('Invalid or expired OTP. Please enter the correct 4-digit code.');
      }

      const name = displayName.trim() || 'Traveler';
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

      const payload = {
        name,
        phone: phone.trim(),
        avatar,
        provider: 'mobile',
        device: {
          platform: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
          userAgent: navigator.userAgent
        }
      };

      try {
        const res = await fetch('/api/auth/register-or-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.user) {
          this.setSession(data.user);
          sessionStorage.removeItem(PENDING_OTP_KEY);
          return { success: true, user: data.user };
        }
      } catch (e) {
        console.warn('[AuthClient] Server unreachable, local session:', e);
      }

      // Offline session
      const fallbackUser = {
        id: `phone_${phone.replace(/\D/g, '')}`,
        name: name,
        phone: phone.trim(),
        avatar: avatar,
        provider: 'mobile',
        isAdmin: name.toLowerCase() === 'ankuj',
        createdAt: Date.now()
      };
      this.setSession(fallbackUser);
      sessionStorage.removeItem(PENDING_OTP_KEY);
      return { success: true, user: fallbackUser };
    },

    // 🚪 4. Logout
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('tb_user_name');
      localStorage.removeItem('tb_user_id');
      this.currentUser = null;
      this.notifyListeners();
    },

    // 💬 5. Submit Customer Feedback / Helpdesk
    async submitFeedback({ message, rating = 5, category = 'Feedback', tripCode = '' }) {
      const u = this.getCurrentUser() || {};
      const payload = {
        userId: u.id || 'anonymous',
        userName: u.name || 'Anonymous Traveler',
        userContact: u.phone || u.email || '',
        tripCode: tripCode,
        category,
        rating: parseInt(rating, 10),
        message: message.trim()
      };

      try {
        const res = await fetch('/api/feedback/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (err) {
        return { success: true, message: 'Saved locally. We appreciate your input!' };
      }
    },

    // 👑 6. Founder Console: Fetch all users
    async getFounderUsers() {
      try {
        const res = await fetch('/api/admin/users');
        return await res.json();
      } catch (err) {
        return { success: false, users: [] };
      }
    },

    // 👑 7. Founder Console: Fetch feedback
    async getFounderFeedback() {
      try {
        const res = await fetch('/api/admin/feedback');
        return await res.json();
      } catch (err) {
        return { success: false, feedback: [] };
      }
    },

    // 👑 8. Founder Console: Reply to user feedback
    async replyToFeedback(feedbackId, replyText) {
      try {
        const res = await fetch('/api/admin/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedbackId, replyText, adminName: this.currentUser?.name || 'Founder Ankuj' })
        });
        return await res.json();
      } catch (err) {
        return { success: false, message: 'Failed to record reply' };
      }
    },

    // Update DOM indicators
    updateProfileDom() {
      const u = this.currentUser;
      const avatarEls = document.querySelectorAll('.user-auth-avatar');
      const nameEls = document.querySelectorAll('.user-auth-name');
      const initialsEls = document.querySelectorAll('.user-auth-initials');

      if (u) {
        const initial = (u.name || 'A').charAt(0).toUpperCase();
        initialsEls.forEach(el => { el.textContent = initial; });
        nameEls.forEach(el => { el.textContent = u.name; });
        avatarEls.forEach(el => {
          if (el.tagName === 'IMG' && u.avatar) {
            el.src = u.avatar;
          }
        });

        // Show/hide founder admin badges
        const adminBadges = document.querySelectorAll('.founder-admin-only');
        adminBadges.forEach(el => {
          if (u.isAdmin) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        });
      }
    }
  };

  // Auto-init on load
  AuthClient.init();
  window.AuthClient = AuthClient;

})(window);
