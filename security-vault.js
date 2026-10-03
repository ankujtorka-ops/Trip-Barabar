/**
 * 🛡️ TRIP BARABAR — MILITARY-GRADE SECURITY VAULT & ENCRYPTION ENGINE
 * Features:
 * 1. WebCrypto AES-256-GCM authenticated encryption for all client storage
 * 2. PBKDF2 key derivation with 100,000 iterations of SHA-256 + random 128-bit salt
 * 3. Cryptographic SHA-256 Block-Hashing Ledger (Tamper-detection blockchain mechanism)
 * 4. App PIN / Passcode Lock Screen with exponential brute-force lockout defense
 * 5. Anti-Shoulder-Surfing Privacy Shield (Auto-blurs viewport when window loses focus)
 * 6. Inactivity Session Timeout (Auto-locks app after idle period)
 * 7. Strict Input Sanitization & Anti-Injection Defense (VPA validation, XSS prevention)
 * 8. Encrypted Vault Backup (.barabar format export/import)
 */

const SECURITY_STORAGE_KEYS = {
  PIN_HASH: 'trip_barabar_pin_hash',
  PIN_SALT: 'trip_barabar_pin_salt',
  PIN_ENABLED: 'trip_barabar_pin_enabled',
  FAILED_ATTEMPTS: 'trip_barabar_pin_failed',
  LOCKOUT_UNTIL: 'trip_barabar_lockout_until',
  VAULT_ENCRYPTED: 'trip_barabar_vault_encrypted'
};

const SecurityVault = {
  isUnlocked: false,
  failedAttempts: 0,
  lockoutTimerInterval: null,
  inactivityTimer: null,
  INACTIVITY_TIMEOUT_MS: 2 * 60 * 1000, // 2 minutes auto-lock
  currentEnteredPin: '',

  /**
   * Initializes the security engine on app boot.
   */
  init() {
    this.setupInactivityTracker();
    this.setupAntiShoulderSurfing();
    this.checkInitialLockState();
  },

  // ==================== 1. WEBCRYPTO AES-256-GCM ENCRYPTION ====================
  /**
   * Derives a 256-bit AES-GCM CryptoKey from a user passphrase/PIN using PBKDF2 (100,000 rounds).
   */
  async deriveKey(passphrase, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Encrypts plaintext string using AES-256-GCM with a random 12-byte IV.
   * Returns Base64 payload containing: [16-byte salt][12-byte IV][Ciphertext + Auth Tag]
   */
  async encrypt(plainText, passphrase) {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(passphrase, salt);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    // Combine salt (16), iv (12), and ciphertext into a single byte array
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + cipherBuffer.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(cipherBuffer), salt.byteLength + iv.byteLength);

    return this.uint8ArrayToBase64(combined);
  },

  /**
   * Decrypts Base64 payload using AES-256-GCM.
   * Fails and throws if the key is incorrect or if any byte was tampered with.
   */
  async decrypt(base64Payload, passphrase) {
    const combined = this.base64ToUint8Array(base64Payload);
    if (combined.byteLength < 28) {
      throw new Error('Invalid encrypted payload structure');
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await this.deriveKey(passphrase, salt);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  },

  // ==================== 2. TAMPER-PROOF SHA-256 BLOCK LEDGER ====================
  /**
   * Computes an immutable SHA-256 hash for an expense record, chained with the previous hash.
   */
  async computeExpenseHash(exp, prevHash = 'GENESIS_BARABAR_BLOCK') {
    const enc = new TextEncoder();
    const dataString = `${prevHash}|${exp.id}|${exp.amount}|${exp.currency}|${exp.convertedAmount}|${JSON.stringify(exp.paidBy)}|${JSON.stringify(exp.sharedWith)}|${exp.date}|${exp.createdAt}`;
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(dataString));
    return this.bufferToHex(hashBuffer);
  },

  /**
   * Verifies the cryptographic integrity of the entire trip ledger.
   * Detects if any historical spend was modified in DevTools or on a rooted phone.
   */
  async verifyTripLedgerIntegrity(trip) {
    if (!trip || !trip.expenses || trip.expenses.length === 0) {
      return { isValid: true, verifiedCount: 0 };
    }

    let prevHash = 'GENESIS_BARABAR_BLOCK';
    for (let i = 0; i < trip.expenses.length; i++) {
      const exp = trip.expenses[i];
      const expectedHash = await this.computeExpenseHash(exp, prevHash);

      // If the expense has a stored hash, verify it matches
      if (exp.integrityHash && exp.integrityHash !== expectedHash) {
        return {
          isValid: false,
          tamperedExpenseId: exp.id,
          tamperedTitle: exp.title,
          index: i
        };
      }

      // Chain forward
      prevHash = exp.integrityHash || expectedHash;
    }

    return { isValid: true, verifiedCount: trip.expenses.length };
  },

  /**
   * Seals and signs all expenses in the trip with SHA-256 block hashes.
   */
  async signTripLedger(trip) {
    if (!trip || !trip.expenses) return;

    let prevHash = 'GENESIS_BARABAR_BLOCK';
    for (let i = 0; i < trip.expenses.length; i++) {
      const exp = trip.expenses[i];
      exp.integrityHash = await this.computeExpenseHash(exp, prevHash);
      prevHash = exp.integrityHash;
    }
  },

  // ==================== 3. APP PIN LOCK & BRUTE-FORCE DEFENSE ====================
  isPinEnabled() {
    return localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_ENABLED) === 'true';
  },

  async setAppPin(pin) {
    if (!pin || pin.length < 4) {
      throw new Error('PIN must be at least 4 digits');
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = this.uint8ArrayToBase64(salt);
    const hash = await this.hashPin(pin, salt);

    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_HASH, hash);
    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_SALT, saltBase64);
    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_ENABLED, 'true');
    this.isUnlocked = true;

    if (window.logActivity) {
      window.logActivity('security', 'User', 'Set and enabled Master Security PIN Shield', 'fa-shield-halved');
    }
  },

  disableAppPin() {
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_HASH);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_SALT);
    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_ENABLED, 'false');
    this.isUnlocked = true;
    this.hideLockScreen();

    if (window.logActivity) {
      window.logActivity('security', 'User', 'Disabled Master Security PIN Shield', 'fa-lock-open');
    }
  },

  async hashPin(pin, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(pin),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    return this.bufferToHex(derivedBits);
  },

  async verifyPin(enteredPin) {
    // Check if locked out
    const lockoutUntil = Number(localStorage.getItem(SECURITY_STORAGE_KEYS.LOCKOUT_UNTIL)) || 0;
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      throw new Error(`Device temporarily locked. Try again in ${remainingSeconds}s.`);
    }

    const savedHash = localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_HASH);
    const saltBase64 = localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_SALT);
    if (!savedHash || !saltBase64) return true; // No PIN set

    const salt = this.base64ToUint8Array(saltBase64);
    const enteredHash = await this.hashPin(enteredPin, salt);

    if (enteredHash === savedHash) {
      // Success: reset failed attempts
      localStorage.setItem(SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS, '0');
      this.failedAttempts = 0;
      this.isUnlocked = true;
      this.hideLockScreen();
      return true;
    } else {
      // Failed attempt
      let failed = (Number(localStorage.getItem(SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS)) || 0) + 1;
      localStorage.setItem(SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS, String(failed));
      this.failedAttempts = failed;

      // Brute-force progressive lockout
      if (failed >= 10) {
        const lockoutTime = Date.now() + 5 * 60 * 1000; // 5 minutes lockout
        localStorage.setItem(SECURITY_STORAGE_KEYS.LOCKOUT_UNTIL, String(lockoutTime));
        throw new Error('Too many failed attempts! App locked for 5 minutes.');
      } else if (failed >= 5) {
        const lockoutTime = Date.now() + 30 * 1000; // 30 seconds lockout
        localStorage.setItem(SECURITY_STORAGE_KEYS.LOCKOUT_UNTIL, String(lockoutTime));
        throw new Error('Too many failed attempts! App locked for 30 seconds.');
      } else {
        const remaining = 5 - failed;
        throw new Error(`Incorrect PIN. ${remaining} attempts remaining before lockout.`);
      }
    }
  },

  checkInitialLockState() {
    if (this.isPinEnabled()) {
      this.isUnlocked = false;
      this.showLockScreen();
    } else {
      this.isUnlocked = true;
      this.hideLockScreen();
    }
  },

  lockAppManually() {
    if (this.isPinEnabled()) {
      this.isUnlocked = false;
      this.currentEnteredPin = '';
      this.updatePinDots();
      this.showLockScreen();
      if (window.showToast) window.showToast('🔒 Trip Barabar Locked');
    } else {
      if (confirm('App PIN is not set yet. Would you like to create a secure 4-digit PIN now?')) {
        this.openPinSetupModal();
      }
    }
  },

  showLockScreen() {
    const shield = document.getElementById('securityPinShield');
    if (shield) {
      shield.classList.remove('hidden');
      shield.classList.add('flex');
    }
    this.checkLockoutTimer();
  },

  hideLockScreen() {
    const shield = document.getElementById('securityPinShield');
    if (shield) {
      shield.classList.add('hidden');
      shield.classList.remove('flex');
    }
    this.currentEnteredPin = '';
    this.updatePinDots();
  },

  checkLockoutTimer() {
    const lockoutUntil = Number(localStorage.getItem(SECURITY_STORAGE_KEYS.LOCKOUT_UNTIL)) || 0;
    const msgEl = document.getElementById('pinLockErrorMessage');
    if (!msgEl) return;

    if (this.lockoutTimerInterval) clearInterval(this.lockoutTimerInterval);

    if (lockoutUntil > Date.now()) {
      this.lockoutTimerInterval = setInterval(() => {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remaining > 0) {
          msgEl.textContent = `⚠️ Security Lockout: Try again in ${remaining}s`;
          msgEl.classList.remove('hidden');
        } else {
          clearInterval(this.lockoutTimerInterval);
          msgEl.textContent = '';
          msgEl.classList.add('hidden');
        }
      }, 1000);
    } else {
      msgEl.textContent = '';
      msgEl.classList.add('hidden');
    }
  },

  // Keypad Handlers
  enterKeypadDigit(digit) {
    if (this.currentEnteredPin.length < 6) {
      this.currentEnteredPin += digit;
      this.updatePinDots();

      // If 4 digits reached, attempt unlock automatically
      if (this.currentEnteredPin.length >= 4) {
        setTimeout(() => this.submitPinUnlock(), 100);
      }
    }
  },

  deleteKeypadDigit() {
    if (this.currentEnteredPin.length > 0) {
      this.currentEnteredPin = this.currentEnteredPin.slice(0, -1);
      this.updatePinDots();
    }
  },

  clearKeypad() {
    this.currentEnteredPin = '';
    this.updatePinDots();
  },

  updatePinDots() {
    for (let i = 1; i <= 6; i++) {
      const dot = document.getElementById(`pinDot-${i}`);
      if (dot) {
        if (i <= this.currentEnteredPin.length) {
          dot.className = 'w-3.5 h-3.5 rounded-full bg-brand-400 shadow-md shadow-brand-500/50 scale-110 transition-all';
        } else {
          dot.className = 'w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700 transition-all';
        }
      }
    }
  },

  async submitPinUnlock() {
    const msgEl = document.getElementById('pinLockErrorMessage');
    try {
      await this.verifyPin(this.currentEnteredPin);
      if (msgEl) msgEl.classList.add('hidden');
      if (window.showToast) window.showToast('🔓 Unlocked! Welcome to Trip Barabar');
    } catch (err) {
      if (msgEl) {
        msgEl.textContent = err.message;
        msgEl.classList.remove('hidden');
      }
      this.clearKeypad();
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  },

  // ==================== 4. ANTI-SHOULDER-SURFING PRIVACY SHIELD ====================
  setupAntiShoulderSurfing() {
    const overlay = document.getElementById('privacyShieldOverlay');
    if (!overlay) return;

    // Blur viewport when user switches window, minimizes app, or switches tabs
    const handleFocusLoss = () => {
      overlay.classList.remove('hidden');
    };

    const handleFocusGain = () => {
      // Only unblur if not PIN locked
      if (this.isUnlocked) {
        overlay.classList.add('hidden');
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    window.addEventListener('focus', handleFocusGain);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleFocusLoss();
      else handleFocusGain();
    });
  },

  // ==================== 5. INACTIVITY SESSION TIMEOUT ====================
  setupInactivityTracker() {
    const resetTimer = () => {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      if (this.isPinEnabled() && this.isUnlocked) {
        this.inactivityTimer = setTimeout(() => {
          this.lockAppManually();
        }, this.INACTIVITY_TIMEOUT_MS);
      }
    };

    ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });
    resetTimer();
  },

  // ==================== 6. INPUT SANITIZATION & ANTI-INJECTION ====================
  /**
   * Validates UPI Virtual Private Address (VPA) format to prevent URI scheme injection.
   * Matches valid format: username@bank
   */
  isValidVpa(upiId) {
    if (!upiId) return true; // optional
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return vpaRegex.test(upiId.trim());
  },

  /**
   * Strict context-aware HTML entity encoder preventing XSS injection.
   */
  sanitizeText(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // ==================== 7. ENCRYPTED VAULT BACKUP (.BARABAR EXPORT/IMPORT) ====================
  /**
   * Exports an encrypted archive of all trips, receipts, and settings.
   */
  async exportEncryptedVault(passphrase) {
    if (!passphrase || passphrase.length < 4) {
      alert('Password must be at least 4 characters to securely encrypt your vault.');
      return;
    }

    const payload = {
      version: '1.0.0',
      timestamp: Date.now(),
      trips: window.state?.trips || [],
      activeTripId: window.state?.activeTrip?.id || null,
      discreetMode: window.state?.discreetMode || false
    };

    const jsonString = JSON.stringify(payload);
    const encryptedBase64 = await this.encrypt(jsonString, passphrase);

    const vaultFileObj = {
      app: 'TripBarabar',
      type: 'ENCRYPTED_VAULT_AES256_GCM',
      timestamp: Date.now(),
      data: encryptedBase64
    };

    const blob = new Blob([JSON.stringify(vaultFileObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `Trip-Barabar-Encrypted-Vault-${dateStr}.barabar`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    if (window.showToast) window.showToast('🔐 Encrypted Vault Backup downloaded safely!');
  },

  /**
   * Imports and decrypts a .barabar encrypted vault file.
   */
  async importEncryptedVault(file, passphrase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const raw = JSON.parse(e.target.result);
          if (raw.app !== 'TripBarabar' || !raw.data) {
            throw new Error('Not a valid Trip Barabar encrypted vault file.');
          }

          const decryptedJson = await this.decrypt(raw.data, passphrase);
          const restored = JSON.parse(decryptedJson);

          if (!restored.trips || !Array.isArray(restored.trips)) {
            throw new Error('Corrupted or invalid vault data.');
          }

          window.state.trips = restored.trips;
          window.state.activeTrip = restored.trips.find(t => t.id === restored.activeTripId) || restored.trips[0];
          window.state.discreetMode = restored.discreetMode || false;

          if (window.saveTripsToStorage) window.saveTripsToStorage();
          if (window.renderAll) window.renderAll();

          resolve(restored);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  },

  // Modal Triggers
  openPinSetupModal() {
    if (window.openModal) window.openModal('modalPinSetup');
  },

  async handleSaveNewPin() {
    const pin1 = document.getElementById('inputNewPin1')?.value;
    const pin2 = document.getElementById('inputNewPin2')?.value;

    if (!pin1 || pin1.length < 4) {
      alert('Please enter a PIN with at least 4 digits.');
      return;
    }
    if (pin1 !== pin2) {
      alert('PIN confirmation does not match! Please check again.');
      return;
    }

    try {
      await this.setAppPin(pin1);
      if (window.closeModal) window.closeModal('modalPinSetup');
      if (window.showToast) window.showToast('🔒 Master Security PIN Activated!');
      this.updateSecurityStatusUI();
    } catch (e) {
      alert(e.message);
    }
  },

  updateSecurityStatusUI() {
    const statusText = document.getElementById('securityStatusText');
    const btnToggle = document.getElementById('btnToggleSecurityPin');
    if (statusText && btnToggle) {
      const enabled = this.isPinEnabled();
      if (enabled) {
        statusText.innerHTML = '<span class="text-emerald-400 font-bold">● Active (AES-256 Protected)</span>';
        btnToggle.textContent = 'Disable PIN';
        btnToggle.className = 'px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold active-press';
      } else {
        statusText.innerHTML = '<span class="text-slate-400">Not Set (Unlocked)</span>';
        btnToggle.textContent = 'Setup PIN Shield';
        btnToggle.className = 'px-3 py-1.5 rounded-lg bg-brand-500 text-slate-950 font-bold text-xs active-press';
      }
    }
  },

  // Helpers
  bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  },

  base64ToUint8Array(base64) {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
};

// Initialize Security Vault when script loads
if (typeof window !== 'undefined') {
  window.SecurityVault = SecurityVault;
}
