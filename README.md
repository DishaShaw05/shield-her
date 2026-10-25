# SHIELD HER 🛡️
### Personal Safety & Digital Protection Platform
**Tagline:** *Your Safety. Your Privacy. Your Power.*  

---

## 🌟 Overview

**SHIELD HER** is an integrated personal safety and digital threat mitigation web application designed to empower women, students, and working professionals. In today's digital world, physical vulnerability and cyber harassment are closely interconnected: an online stalker can turn into a physical danger, and a real-world emergency often requires immediate digital evidence preservation.

SHIELD HER bridges this gap with an intuitive, empowering, dark navy interface featuring:
* **Authenticated Access & Privacy Isolation:** Salted SHA-256 cryptographic account authentication, persistent sessions, password reset, and user-scoped contact and evidence privacy.
* **Proactive Emergency SOS:** Direct Indian Emergency `112` and Women Helpline `1091` speed dial with zero false promises.
* **Safe Journey Transit Monitoring:** Expected arrival and check-in deadline configuration, live countdown, overdue check-in alarm banner, and "I Am Safe" confirmation.
* **Digital Shield Cyber Threat Analyzer:** A rule-based suspicious message analyzer detecting sextortion, blackmail, UPI fraud, fake CBI "digital arrest" scams, and OTP theft without third-party API costs or remote message uploads.
* **Evidence Vault:** Client-side, date-stamped incident logging with police complaint export formatting and search/filter.
* **Interactive Privacy Checkup:** A 9-point security audit covering 2FA, screen lock hygiene, location-sharing audits, and stalkerware mitigation.
* **On-Demand GPS Pinpoint:** Zero-server-tracking geolocation coordinates ready for emergency dispatch.
* **Verified Safety Resources:** Official Indian government portals (`112.gov.in`, `cybercrime.gov.in`) and helplines (`112`, `1091`, `1930`, `181`).

---

## 🚀 Windows Installation & Launch Guide

### Prerequisites
* Windows 10 or Windows 11
* [Node.js](https://nodejs.org/) (Version 18, 20, or newer recommended)
* Any modern web browser (Google Chrome, Microsoft Edge, Brave, or Firefox)

---

### Step-by-Step Local Setup

#### Step 1: Open PowerShell or Command Prompt
Open Windows PowerShell (or Command Prompt) and change into the project directory:
```powershell
cd "C:\Users\Disha Shaw\.gemini\antigravity\scratch\shield-her"
```

#### Step 2: Install Dependencies
Install all required project packages:
```powershell
npm install
```

#### Step 3: Run the Verification Test Suite
Execute the automated test suite to verify authentication, cryptographic hashing, journey timers, and pattern detection:
```powershell
npm test
```
*Expected Result: `TOTAL TEST EXECUTION SUMMARY: 54 PASSED | 0 FAILED`*

#### Step 4: Launch the Local Development Server
Start the local Vite development server:
```powershell
npm run dev
```
PowerShell will display a local address. Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🔐 Login & Registration Setup

SHIELD HER features a built-in cryptographic authentication system using the Web Crypto API (`crypto.subtle` with SHA-256 and unique per-user salts):

### 1. Default Demo Account (Instant Access)
For instant evaluation, you can use the pre-configured demo account or click **"Fill Quick Demo Account"** on the sign-in screen:
* **Email:** `user@shieldher.safe`
* **Password:** `ShieldHer2026!`

### 2. Creating a New Account
* Click **"Sign Up for Free"** on the login screen.
* Enter your full name, email address, password (minimum 6 characters), and confirm password.
* Click **"Create Account"**. Your credentials are cryptographically hashed and saved, and you are immediately redirected to your private dashboard.

### 3. Password Reset Flow
* Click **"Forgot Password?"** on the login page.
* Enter your registered email address and set your new password.
* Submit the form to immediately update your credentials and log in.

### 4. Privacy & Multi-User Data Isolation
* Plaintext passwords are **never** stored in localStorage.
* Each user's contacts, journey states, and evidence vault records are scoped strictly to their unique User ID (`shield_her_user_<id>_...`).
* Logging out revokes the session and protects records from other users on the device.

---

## 📋 Comprehensive Feature Breakdown

| Feature Module | Capabilities & Purpose |
| :--- | :--- |
| **Emergency SOS System** | Prominent circular SOS button, direct `tel:112` and `tel:1091` native dialer launchers, Speed-Dial for primary trusted contacts, one-click WhatsApp broadcast generator, and tactical escape advice. Explicitly informs the user that native dialer confirmation is required. |
| **Safe Journey Tracker** | Destination scheduler, expected arrival and check-in deadline configuration, live countdown, active overdue check-in alarm banner, and "I Am Safe" confirmation. Persists journey across refreshes. |
| **Digital Shield (Threat Analyzer)** | Paste any suspicious message, SMS, DM, or email. Detects sextortion, webcam blackmail, intimate imagery coercion, authority impersonation (fake CBI/Customs digital arrest), UPI fraud, and OTP harvesting. Returns warning level, detected signs, reasons, and recommendations. |
| **Evidence Vault** | Private incident record management for harassment, stalking, and privacy breaches. Logs category, date, time, description, tags, and evidence references. Search, filter, and export report formatted for police FIR submission. |
| **Trusted Circle** | Add, edit, and delete emergency contacts with phone numbers and relationships (Sister, Mother, Roommate, etc.). Set primary speed-dial contact. Click to dial or message via WhatsApp. |
| **Privacy Checkup** | 9-point interactive checklist covering unique passwords, 2FA/MFA, social media stalker restrictions, app camera/mic permissions, live-location sharing audit, session audits, and lock screen security. Animated progress bar. |
| **On-Demand GPS Tool** | Queries HTML5 Geolocation API on explicit user click only. Displays Latitude, Longitude, and accuracy radius. Includes copyable emergency SMS template. Zero background tracking. Zero server upload. |
| **Safety Resources & Law** | Official Indian government emergency numbers (112, 1091, 1930, 181), portals (`112.gov.in`, `cybercrime.gov.in`), practical step-by-step crisis guides, and legal frameworks. |

---

## 🔒 Architectural Privacy & Ethical Transparency

SHIELD HER maintains strict adherence to privacy-by-design principles:
1. **Direct Dispatch Transparency (`tel:112`):**  
   Clicking emergency call buttons opens the device's native telephone dialer. The application never falsely claims that police have been dispatched or SMS alerts sent without the user's manual action.
2. **Background Journey Limits:**  
   Browsers throttle background execution when tabs are inactive or the device is asleep. Safe Journey provides active countdowns and overdue warnings while the application is running in the browser.
3. **Client-Side Data Privacy:**  
   User credentials and records remain stored locally on the client device. No suspicious messages or incident records are uploaded to remote third-party servers or paid AI APIs.

---

## 🧪 Automated Testing Verification

Run the test suite at any time using:
```powershell
npm test
```

### Verified Test Categories:
1. **Cryptographic Authentication:** Registration, password validation, salted SHA-256 hash security, invalid credentials rejection, password reset, session persistence, and multi-user data isolation.
2. **Digital Shield Message Engine:** Webcam sextortion, fake police digital arrest, physical intimidation threats, electricity bill cutoff scams, OTP harvesting, phishing links, and benign message validation.
3. **Safe Journey Validation:** Past deadline rejection, arrival vs deadline order, active countdown, overdue transition, and safe check-in completion.
4. **Trusted Circle CRUD:** Contact addition, editing, deletion, primary toggle, and phone number validation.
5. **Privacy Checkup:** 9 mandatory checklist items, progress percentage calculation, item toggling, and reset functionality.
6. **Evidence Vault:** Record creation, category validation, export formatting, search/filter, and individual/mass deletion.
7. **Emergency SOS & GPS:** Native 112 dialer link verification, no-fake-dispatch compliance, and geolocation permission error handling.

---

## 📦 Production Build & Deployment

### Generating the Production Build
To create an optimized production build for public deployment:
```powershell
npm run build
```
This command compiles TypeScript and generates production-ready static assets in the **`dist`** folder.

To preview the production build locally:
```powershell
npm run preview
```

---

### Free Public Deployment Options

#### Option A: Deploy to Netlify (Drag & Drop — Simplest Free Method)
1. Run `npm run build` in PowerShell.
2. Open [https://app.netlify.com/drop](https://app.netlify.com/drop) in your web browser.
3. Drag and drop the **`dist`** folder onto the page.
4. Netlify will deploy your site in seconds and provide a public URL (e.g., `https://shield-her-safety.netlify.app`).

#### Option B: Deploy to Vercel
1. Install the Vercel CLI (or connect via GitHub):
   ```powershell
   npm install -g vercel
   vercel
   ```
2. Accept the default settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`
3. Vercel provides an instant live HTTPS link (e.g., `https://shield-her.vercel.app`).

#### Option C: Deploy to GitHub Pages
1. Install `gh-pages`:
   ```powershell
   npm install -D gh-pages
   ```
2. Add a `deploy` script to `package.json`:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run:
   ```powershell
   npm run build
   npm run deploy
   ```

---

## 📁 Project Sharing & ZIP Archive

A complete project ZIP archive has been created:
* **Archive Name:** `SHIELD_HER_Project.zip`
* **Location:** `C:\Users\Disha Shaw\.gemini\antigravity\scratch\SHIELD_HER_Project.zip`
* **Contents:** Complete source code, configuration files, `package.json`, `package-lock.json`, test suite, production build (`dist`), and documentation. (Excludes bulky `node_modules` and sensitive files).

### How to Share via Google Drive
1. Locate `SHIELD_HER_Project.zip` at `C:\Users\Disha Shaw\.gemini\antigravity\scratch\SHIELD_HER_Project.zip`.
2. Open [Google Drive](https://drive.google.com).
3. Click **"+ New"** > **"File upload"** and select `SHIELD_HER_Project.zip`.
4. Right-click the uploaded file in Google Drive, select **"Share"**, change access to **"Anyone with the link"**, and copy the sharing link to send to your friend.
5. Your friend can extract the ZIP and run `npm install` followed by `npm run dev`.

---

## 🛠️ Technology Stack
* **Frontend Framework:** React 18 with TypeScript
* **Build System:** Vite 5
* **Styling:** Tailwind CSS with dark navy & rose purple palette
* **Icons:** Lucide React
* **Security:** Web Crypto API (SHA-256 + cryptographic salt)
* **Storage:** Client-Side Web Storage API (`localStorage`)
* **Sensors:** Browser Geolocation API
