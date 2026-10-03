# 🌴 TRIP BARABAR — MASTER ARCHITECTURE & PROJECT LOG
> **Tagline**: *"Trip Sorted. Hisaab Barabar."*  
> **Package / App ID**: `com.tripbarabar.app`  
> **Platform Strategy**: 3-in-1 Unified Codebase (Instant Web PWA + Google Play Store + Apple App Store via Capacitor)

---

## 1. Project Overview & Founder Directive
* **Brand Name**: **Trip Barabar** (बराबर — Fair, Equal, Completely Settled)
* **Tagline**: *"Trip Sorted. Hisaab Barabar."*
* **Core Value Proposition**: Universal group trip expense sharing and debt simplification app designed to be **10x faster, cleaner, and better than Splitwise** with zero ads, zero paywalls, instant real-time sync, and selective splitting.
* **Scope**: Universal for all trips — Thailand, Goa, Dubai, Europe, domestic weekend getaways, and road trips.
* **Founder**: Ankuj

---

## 2. Core Functional Specifications

### A. Selective Splitting ("3 out of 9" Rule)
* **Problem Solved**: In a group of 9 friends, often only 3 people take a cab, or 6 people drink, or 2 people share a dessert.
* **Solution**:
  * Tap avatars to select/deselect exactly who shared each expense.
  * Presets: `[All 9]`, `[Cab (3)]`, `[Drinks (6)]`, `[None]`.
  * Multiple split modes:
    1. **Equally**: Split evenly among selected members with remainder handling down to the exact paisa/cent.
    2. **Exact Amounts**: Specify exact amounts per friend.
    3. **By Shares / Ratios**: 1x, 2x for couples or unequal consumption.

### B. Multi-Currency Engine & Custom Forex Rate Override
* **Base Trip Currency** (e.g. ฿ THB, € EUR, $ USD, د.إ AED) vs **Home Settlement Currency** (₹ INR).
* **Dual Currency Display**: Every card displays both `฿900 (~₹2,232 INR)`.
* **Manual Forex Rate Lock**:
  * Unlike Splitwise's rigid automated rates, Trip Barabar lets you lock the exact conversion rate received at the cash counter (e.g. SuperRich Thailand) or ATM withdrawal fee markup:  
    `1 THB = 2.48 INR`.

### C. Adult & Nightlife Entertainment Suite with 1-Tap Discreet Mode
* **The Thailand & Nightlife Icon Set**:
  * 💆 **Thai / Body Massage**: Stylized massage hands, aromatic oils, herbal compress
  * 💃 **Lapdance / GoGo Club**: Sleek neon silhouette of dancer on pole / VIP stage
  * 🔞 **Adult / Intercourse**: Minimalist couple silhouette / silk bed / playful key
  * 💋 **Oral / Special Services**: Stylized neon red lips & lollipop / cherry badge
  * 🍸 **Lady Drinks / Bar Fine**: Glowing tropical cocktail glass
  * 🌿 **Dispensary / Green**: Stylized cannabis leaf badge
* **1-Tap Stealth / Discreet Mode Toggle**:
  * **Bro Mode (Uncensored)**: Full spicy icons and transparent labels for candid tracking among friends.
  * **Discreet Mode**: 1 tap disguises all adult/spicy items into clean corporate/wellness labels:
    * *Adult / Intercourse* $\rightarrow$ 🌿 **Personal Wellness & Care**
    * *Lapdance / GoGo* $\rightarrow$ 🎭 **Cultural Evening Show**
    * *Oral / Special* $\rightarrow$ ✨ **Reflexology & Recovery**
    * *Lady Drinks / Bar Fine* $\rightarrow$ 🍹 **Hospitality & Lounge**
  * Prevents awkward moments at airport customs, hotel desks, or around family.
* **App Store & Google Play Store Policy Compliance**:
  * Stylized vector art, silhouettes, and emojis are 100% compliant under standard 17+ or Teen app store guidelines (no explicit anatomical nudity).
  * Includes an **"Add Custom Category"** button for user-generated custom categories (UGC), completely exempt from store restrictions.

### D. Debt Simplification Engine (Min-Cash-Flow Algorithm)
* Calculates net balance for every member: $\text{Net} = \text{Total Paid} - \text{Total Consumed}$.
* Greedy min-cash-flow algorithm reduces 25+ messy cross-payments down to **3 or 4 clean transfers**.
* **1-Tap UPI Settle**: Generates mobile UPI intent links for Google Pay, PhonePe, and Paytm with pre-filled amount and recipient UPI ID.

### E. 1-Tap WhatsApp Daily Trip Summary Generator
* Automatically formats a clean, emoji-rich trip recap with:
  * Today's total spends
  * Top transactions
  * Member standings (+₹ gets back, -₹ owes)
  * Who pays whom
  * Direct link to open the live trip ledger
* Copies to clipboard with 1 tap.

### F. Offline-First Resilience
* Instant `<50ms` local storage via `localStorage` and `IndexedDB`.
* Expenses logged on speedboats, flights, or clubs with zero network queue safely in `trip_barabar_sync_queue` and sync automatically upon reconnection.

---

## 3. App Store & Google Play Store Packaging (Capacitor)

### Project Configuration
* **App Name**: Trip Barabar
* **App ID**: `com.tripbarabar.app`
* **Config File**: `capacitor.config.json`

### Commands to Build for Android & iOS:
```bash
# 1. Install dependencies
npm.cmd install

# 2. Add Android platform (generates native Android Studio project)
npx.cmd cap add android

# 3. Add iOS platform (generates Xcode project for Mac)
npx.cmd cap add ios

# 4. Sync web assets into native shells
npx.cmd cap sync

# 5. Open in Android Studio / Xcode
npx.cmd cap open android
npx.cmd cap open ios
```

---

## 4. Local Testing & Web Launch
* **1-Click Windows Launcher**: Double-click `Start-Trip-Barabar.bat` inside the `trip-barabar` folder.
* **Local Web Server**: Serves on `http://localhost:8090` and outputs your local Wi-Fi IP so you can test on your mobile phone browser immediately!

---

## 5. Advanced Feature Suite & Cultural Integrations (Completed)

### 1. Common Fund (Kitty) & Treasurer Mode
* **Pooled Cash Pool**: Collect ₹5,000 (or custom) upfront from each friend into the shared pool.
* **Low Fund Alert**: Visual warning badge & pulsing border when balance drops below 20%.
* **Paid from Kitty**: Single dropdown option `💰 Trip Kitty / Common Pool (Treasurer Mode)` automatically deducts from the shared pool and assigns consumed shares.
* **Advance Payments & Fair Leftover Refund**: 1-click refund calculator that divides leftover balance evenly and formats a WhatsApp message.

### 2. Hinglish Natural-Language Magic Bar (Voice & Text)
* Natural speech/text parser: `"Rohan ne 1200 ka dinner diya, sabme barabar"`.
* Auto-extracts amount, payer, category, and shared friends.
* Integrated Web Speech API microphone for 1-tap voice input.

### 3. Trip Wrapped (Spotify Wrapped Style)
* 5-slide animated story modal with progress bars:
  * Slide 1: Group Total Damage in dual currency.
  * Slide 2: Costliest single day & peak moment.
  * Slide 3: Category Crown (% of budget).
  * Slide 4: Hall of Fame & Badges (The Banker, Feast Master, Night Owl, Free Rider).
  * Slide 5: Official Trip Wrapped Share Poster generated on `<canvas>` with PNG download.

### 4. Fairness Built for Real Groups (4 Split Types + Modifiers)
* 4 Split types: Equal, Exact, Percentage (%), and Shares (Weighted).
* Quick fairness presets:
  * `👶 Kids (0.5x)`: sets half-share.
  * `👫 Couples (2x)`: sets double-share.
  * `🚫 Exclude Non-Drinkers`: separates drinkers from food-only friends.
  * `🚕 Cab 3 of 9`: 1-tap 3-passenger selection.

### 5. WhatsApp-First Sharing & Graphic Card Generator
* Dual-mode sharing modal:
  * Mode 1: Clean, emoji-rich formatted text summary with direct app links.
  * Mode 2: High-resolution visual graphic card rendered to `<canvas>` for 1-tap download or direct copy to clipboard.

### 6. Friendly & Funny Hinglish Reminders (Nudges)
* 4 distinct cultural tone options:
  1. *Filmy / Babu Bhaiya*: "Babu bhaiya hisaab barabar chahiye!"
  2. *Cheeky / Savage*: "Cocktails peene me tiger, hisaab dene me sanyasi?"
  3. *Polite & Soft*: Professional & friendly polite reminder.
  4. *Urgent / Final Alert*: Urgent warning with WhatsApp deep-link.

### 7. Road-Trip Mode (Fuel, Tolls & FASTag)
* Road-trip calculator for domestic drives: Distance, Mileage, Fuel Price, Tolls, FASTag, Parking.
* Driver seat exemption toggle: Exempts the designated driver from fuel costs.
* 1-tap saves as a Road Trip expense in the ledger.

### 8. Daily Budget Pace
* Target trip budget and duration tracking.
* Calculates daily burn rate and projected finish ("At this rate you will finish ₹Y over/under budget").
* Progress bar with dynamic coloring.

### 9. Indian Bill / Receipt Itemizer with Proportional Taxes
* Itemizes dishes and drinks line by line.
* Assigns items to specific eaters/drinkers.
* Proportionally distributes GST/VAT (e.g. 5%, 18%) and Service Charge (10%) based on exact item subtotals.

### 10. Bilateral UPI Settlement Handshake
* Overcomes the UPI link verification blindspot on iOS/Android.
* Double-confirmation flow: Payer taps "I Paid via UPI" $\rightarrow$ enters pending verification $\rightarrow$ Receiver verifies bank/GPay and taps "Confirm Received" to clear debt.

### 11. Dispute-Proof Activity Log & Audit Trail
* Transparent chronological audit stream tracking all expense additions, edits, deletions, and settlements with relative timestamps.

### 12. Print / PDF Statement Export
* Formatted printable travel invoice statement view with `@media print` CSS styling for crisp PDF export and physical printouts.

