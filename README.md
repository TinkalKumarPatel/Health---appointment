# CarePoint - Healthcare Appointment & Management Platform

A modern, responsive full-stack healthcare web application connecting patients, doctors, and clinic administrators.

---

## 🌟 Key Features

- **Patient Portal**: Search doctors by specialty, fee, or available date; book consultations; view upcoming & past appointments; 1-click reschedule or cancel bookings.
- **Doctor Portal**: View booked patient queue; manage consultation status (Mark Completed, Cancel); interactive weekly availability scheduler (working hours & active clinic days).
- **Admin Portal**: System metrics overview; user management (view all, toggle roles between Patient/Doctor/Admin, remove accounts); master appointment controls; department specialty directory.
- **AI Health Assistant**: Floating triage assistant modal guiding patients to the correct department based on their symptoms.
- **Interactive BMI Calculator**: Height & weight slider tool with clinical classifications and health advice.
- **Security & Auth**: JWT-based authentication with bcrypt password encryption, role-based route guards, and server-side request validation.
- **Zero-Failure Database Layer**: Connects to MongoDB automatically, with an instant in-memory fallback store so the server never crashes. Pre-seeded with 17 realistic users, 5 clinical specialists, and 15 appointments.

---

## 🚀 Quick Launch (Easiest Way)

Simply double-click `start.bat` in the root folder, or in VS Code terminal run:

```bat
.\start.bat
```

This starts both the backend API and frontend dev server and automatically opens `http://localhost:5173` in your browser.

---

## 🛠️ Manual Terminal Commands

### 1. Backend Server (Port 5000)
```powershell
cd "c:\PROJECT1\Health Appointment\backend"
npm run dev
```

### 2. Frontend Web App (Port 5173)
```powershell
cd "c:\PROJECT1\Health Appointment\frontend"
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 👥 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Features |
|---|---|---|---|
| **Patient** | `rahul@example.com` | `patient123` | Search doctors, book time slots, reschedule/cancel |
| **Doctor** | `doctor.sarah@carepoint.com` | `doctor123` | View patient queue, manage weekly availability |
| **Administrator** | `admin@carepoint.com` | `admin123` | Manage users, view all appointments, platform stats |

> **Pro Tip**: The login page features **1-Click Quick Demo Login** buttons so you don't even have to type credentials to test different user roles!

---

## 📐 Technology Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Axios, Vite, Lucide Icons
- **Backend**: Node.js, Express, JSON Web Token (JWT), bcryptjs, Mongoose
- **Database**: MongoDB (Local or Atlas) + Dual-mode in-memory fallback
