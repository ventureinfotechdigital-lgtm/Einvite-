# WED-TALE • 3D Wedding Invitation & Gatefold Card Studio

> **WED-TALE** is an interactive, animated 3D wedding invitation suite and website builder featuring realistic 3D unrolling parchment scrolls, 3D gatefold invitation cards with gyroscopic tilt physics, scratch-to-reveal keepsakes, cultural ceremony timelines, dynamic parallax backdrops, falling petal blessings, midnight fireworks, guest RSVP management, and integrated Razorpay live checkout.

---

## ✨ Features

- **📜 Interactive 3D Unrolling Scroll:**
  Realistic cloth and paper physics with golden rods and calligraphy.
- **💌 3D Gatefold Card & Gold Foil Box:**
  Interactive 3D envelope and gatefold card with responsive cursor and device gyroscope tilt.
- **✨ Scratch-to-Reveal Keepsake:**
  Interactive canvas scratcher to reveal secret pre-wedding portraits with authentic coin sound effects.
- **🌺 Cultural Wedding Themes & Ceremony Suites:**
  - *Temple Tamil Wedding & Sacred Muhurtham* (Thali Dharanam, Metti in Granite Mandapam, Malli Poo, Maalai Maatral)
  - *3D Royal Rajasthan & Rajputana Palace* (Golden Jharokha Dance, Baraat Ghodi, Folk Nagada Musicians)
  - *Christian Wedding Suites* (Nuptial Mass, French Lace Gown, Limousine Toast, Crystal Waltz)
  - *3D Muslim Nikah Mubarak & Walima* (Bismillah Scalloped Arch, Mehndi Palace, Crescent Moon)
  - *North Indian / Punjabi Royal Wedding* (Kaleerein Chime, Chooda Ceremony, Sangeet Dhol)
  - *Kerala Kasavu & Temple Gopuram* (Kasavu Gold, Nilavilakku Diya, Banana Leaves)
  - *Pastel Romance & Lilac Garden Dreams* (Twilight Mehendi & Midnight Ballroom Waltz)
- **🌸 Live Interactive Blessings:**
  "Bless Now" real-time falling flower petal showers with ambient royal shehnai, sitar, flute, and orchestral audio.
- **🎆 3D Midnight Fireworks:**
  Celebratory fireworks celebration with sound effects and sparkling particle trails.
- **💳 Integrated Razorpay Live & Demo Payment Gateway:**
  - Secure server-side proxy (`/api/razorpay/create-order` and `/api/razorpay/verify-payment`)
  - Transparent pricing tiers: **₹1,499**, **₹1,999**, **₹2,499**, and **₹2,999** mapped across designs
  - Dual modes: **Live Razorpay Checkout** (UPI, Cards, NetBanking, Wallets) & **Demo Sandbox Simulation** (1-click test checkout)
  - Instant VIP license key generation, official printable tax invoice, and unlocked guest sharing links.
- **📱 Responsive Mobile & Standalone Guest Experience:**
  Smartphone device frame preview for creators and clean standalone guest view with instant 1-click WhatsApp sharing and live RSVP submission.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons, Canvas-Confetti
- **Backend Proxy:** Express, Node.js (Crypto HMAC-SHA256 Razorpay verification)
- **Dev Server & Bundler:** Vite 6, TSX
- **Payment Gateway:** Razorpay SDK (Checkout.js)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or v22 recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ventureinfotechdigital-lgtm/WED-TALE.git
   cd WED-TALE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   Add your Razorpay credentials if customizing:
   ```env
   RAZORPAY_KEY_ID="rzp_live_..."
   RAZORPAY_KEY_SECRET="your_secret_key"
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

Private & Proprietary — Developed for WED-TALE Royal Wedding Suite.
