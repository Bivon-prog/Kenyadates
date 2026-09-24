# KenyaDates (Kenya & East Africa Dating Platform)

KenyaDates is a modern, high-performance dating platform tailored for Kenya and East Africa. It features real-time chat with Swahili/English translation, M-Pesa STK push payment integration, regional/tribal filters, and face verification.

---

## 🏗️ Architecture Overview

The repository is structured as a full-stack monorepo:

```
kenyadates/
├── web/        # Next.js 16 Web Application (App Router + Tailwind CSS + Framer Motion)
├── mobile/     # Flutter Cross-Platform Mobile Application (Riverpod + GoRouter)
└── backend/    # NestJS Monolith API (Prisma + PostgreSQL + WebSockets + M-Pesa STK Push)
```

---

## ⚡ Getting Started

### 1. Backend API (`/backend`)
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
- **API Base URL**: `http://localhost:5000`
- **Swagger Docs**: `http://localhost:5000/api/docs`

### 2. Web Application (`/web`)
```bash
cd web
npm install
npm run dev
```
- Access web application at `http://localhost:3000`

### 3. Mobile Application (`/mobile`)
```bash
cd mobile
flutter pub get
flutter run
```

---

## ✨ Features
- 💖 **Swipe & Discovery Feed**: Interactive profile cards with location and verified badges.
- 💬 **Real-time Swahili Chat**: Socket.io live chat featuring auto-translation between Sheng/Swahili and English.
- 📱 **Safaricom M-Pesa STK Push**: Instant coin purchases via Daraja API integration.
- 🛡️ **Verification & Moderation**: Identity verification workflow and user reporting engine.
