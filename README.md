# CampusConnect — AI-powered Student Administrative Management Platform

CampusConnect is an integrated Smart Education Service Hub designed to connect college students, administrative staff, department heads (HODs), and campus service providers (Food Court & Stationery Store) through one unified platform.

---

## 🌟 Key Platform Capabilities

1. **Student Portal**
   - **Smart Administrative Service Centre:** Apply for Bonafide Certificates, Study Certificates, Conduct Certificates, Educational Loan Breakdowns, Internship NOCs, and Exam Revaluations.
   - **Live Request Progress Tracker:** Multi-stage visual timeline tracking (Submitted → Document Check → Parent Verification → HOD Approval → Administrative Processing → Certificate Issued).
   - **AI Completion-Time Prediction Model:** Calculates estimated turnaround dates based on historical departmental velocity, working days, and current queue depth.
   - **Mandatory Parent Verification:** Independent time-limited link or OTP verification portal. HOD approval is locked on the server until parent verification succeeds.
   - **AI Document Pre-checks:** OCR verification simulating file legibility, student identity validation, and signature presence.
   - **Automatic Academic Alerts Engine:** Automated notifications when attendance drops below the 75% minimum threshold or internal test marks slip below target.
   - **Student Assist AI Chatbot:** Intelligent grounded assistant answering administrative questions, tracking requests, checking attendance, and offering direct platform navigation.
   - **Digital Food Court:** Browse 6 dining categories, customize cart, complete digital payment (Razorpay / Demo Gateway), and receive single-use QR collection receipts.
   - **Digital Stationery Store:** Purchase lab record files, spiral notebooks, drawing kits, pens, and document printing services with QR collection.

2. **Staff & Admin Portals**
   - **Administrative Staff Dashboard:** Priority request inbox, document verification tools, student correction requests, and certificate generation with digital seal.
   - **HOD Approval Console:** Review department applications with mandatory server-side parent verification lock.
   - **Academic Monitoring & Threshold Controls:** Configure minimum attendance percentage targets (default 75%) and internal mark scales per department.
   - **Food Court & Stationery Counter Operations:** Menu inventory control, stock updates, preparation time configuration, and live camera QR scanner to validate customer collection receipts and prevent double-pickup.
   - **Institutional Administrator Settings:** Service definition registry and immutable append-only audit trail inspector.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React Icons, Recharts Analytics.
- **Backend & Database:** PostgreSQL, Supabase (`@supabase/supabase-js`), Supabase Storage, Row Level Security (RLS) policies.
- **Shopping & QR Receipts:** Razorpay payment integration, `qrcode.react` generator, `html5-qrcode` camera scanner.

---

## 🚀 Quick Start Guide

### 1. Installation

```bash
# Clone repository or navigate to workspace directory
cd CampusConnect

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Populate optional variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RAZORPAY_KEY_ID`

### 3. Database Migration (PostgreSQL / Supabase)

To deploy to Supabase, run the migration script located in `supabase/schema.sql` in the Supabase SQL Editor.

### 4. Running Locally

```bash
# Start Vite development server
npm run dev
```

### 5. Build for Production

```bash
# Verify TypeScript and build production bundle
npm run build
```

---

## 🔑 One-Click Demo Personas for Quick Evaluation

You can test any role instantly using the top navigation bar's **Switch Role** pill menu:

| Role | Name | Description / Responsibilities |
| ---- | ---- | ------------------------------ |
| **Student** | Alex Morgan | Apply for certificates, track requests, check 75% attendance alerts, order food & stationery. |
| **Admin Staff** | Prof. Sarah Jenkins | Process certificate requests, run document pre-checks, issue digital certificates. |
| **HOD** | Dr. Robert Vance | Review department applications (unlocked after parent verification). |
| **Institutional Admin** | Dr. Elena Rostova | View audit history logs, service rules, and system configuration. |
| **Food Court Staff** | Chef Mario Rossi | Manage menu stock, launch QR camera scanner to validate food collection. |
| **Stationery Staff** | Alex Bookmaster | Manage stationery inventory, launch QR camera scanner to validate stationery collection. |
| **Parent Verification** | Independent Portal | Access via link preview on tracker or switch to `Parent Verification Portal`. |

---

## 📜 Complete End-to-End Workflows Tested

1. **Certificate Application & Parent Verification:**
   Student applies for Bonafide Certificate → AI OCR pre-check runs → Parent verification link generated → Parent approves via independent portal → HOD approval unlocks → HOD approves → Digital certificate issued & downloaded with confetti celebration!

2. **Automatic Academic Alert Monitoring:**
   Student attendance drops to 66.7% (<75% threshold) → System automatically triggers alert notice → In-app error notification dispatched → Staff risk monitor reflects student status → Administrator adjusts threshold and re-evaluates.

3. **Campus Dining & QR Collection:**
   User adds South Indian Combo Dosa & Smoothie to cart → Stock verified → Digital payment confirmed → Single-use QR receipt generated → Counter staff scans QR with camera/simulator → Collection verified & marked.
