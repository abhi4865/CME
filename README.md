--<div align="center">

# ⚡ CME Employee Portal

**Attendance & Payroll Management System for Corporation of Mahanti Electricals**

*"A" Class Govt. Contractor*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

</div>

---

## 📋 Overview

**CME Employee Portal** is a full-stack web application built for a small electrical contractor firm to digitize daily attendance tracking, worksite management, and payroll calculation. It replaces manual registers with a role-based dashboard that lets administrators log daily attendance, set per-day wages, manage worksites, and review employee performance — while employees get a transparent, read-only view of their own attendance and salary history.

The app is themed as a **dark industrial control panel**, reflecting the operational nature of the business.

---

## ✨ Key Features

- **Role-based access control** — Administrator, Admin Manager, and Employee roles with distinct permissions
- **Daily attendance tracking** — present/absent toggles, time-in/time-out capture, automatic overtime & undertime calculation
- **Per-employee payroll** — daily rate, allowances, deductions, increments, UPI payout details, and payment ledger
- **Worksite management** — multi-site support with materials tracking and photo galleries per site
- **Confidential character profiles** — 16-field performance/behavior rating system visible to admins only
- **Cumulative salary engine** — real-time computation of monthly earnings, carried-over pay, and net salary
- **JWT-based authentication** with token expiry handling and automatic session recovery
- **Responsive dashboards** for both admin and employee workflows

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (single-page app), CSS Custom Properties |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Atlas) |
| **Auth** | JWT (Bearer token) |
| **Fonts** | DM Sans (UI), Share Tech Mono (numerics/code) |
| **Deployment (suggested)** | Backend → Railway / Render / EC2 · Frontend → Netlify / Vercel · DB → MongoDB Atlas |

### Architecture

The frontend communicates with an Express REST API (`/api/*`) secured by JWT-based auth and role guards, which persists data to MongoDB. See [`cme_backend_architecture.svg`](./cme_backend_architecture.svg) for the full system diagram.

```
React SPA  ──fetch──▶  Express API  ──Mongoose──▶  MongoDB Atlas
 (App.js)              (Auth · Role Guard)          (Employees, Attendance,
                        /api/auth  /api/employees     Salary, Worksites, etc.)
                        /api/attendance /api/salary
                        /api/sites
```

---

## 🔑 Roles & Access

| Role | Dashboard | Permissions |
|---|---|---|
| **Administrator** | AdminDashboard | Full access — attendance, employees, worksites, salary, and Admin Manager account management |
| **Admin Manager** | AdminDashboard | Same as Administrator, **except** cannot manage other Admin Manager accounts |
| **Employee** | EmployeeDashboard | Read-only view of own attendance, salary breakdown, and payment history |

> 🔒 Character (performance) profiles are admin-confidential and are **never** exposed to the Employee dashboard.

---

## 🗂️ Project Structure

```
.
├── App.js       # Root component — routing, state, and all dashboards
├── App.css      # Design system (CSS custom properties) and component styles
├── api.js       # API client — auth, employees, attendance, salary, worksites, etc.
└── cme_backend_architecture.svg   # System architecture diagram
```

> This repository currently contains the **frontend** application. The backend (Express + MongoDB) is consumed via the API client in `api.js` and is expected to run separately (see [Backend Setup](#backend-setup)).

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm or yarn
- A running instance of the CME backend API (Express + MongoDB) — see [Backend Setup](#backend-setup)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/cme-employee-portal.git
cd cme-employee-portal

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not set, the app defaults to `http://localhost:5000/api`.

### Backend Setup

This frontend expects a REST API exposing the following resource groups:

| Resource | Base Route |
|---|---|
| Auth | `/api/auth` |
| Employees | `/api/employees` |
| Attendance | `/api/attendance` |
| Salary | `/api/salary` |
| Character Profiles | `/api/character` |
| Payment Ledger | `/api/payment` |
| Worksites | `/api/worksites` |
| Employee Settings | `/api/settings` |

Refer to `api.js` for the full request/response contract expected by the frontend.

---

## 🧮 Salary Calculation Logic

```
NET SALARY = monthlyCumulative
           + increment (fixed ₹ OR % of basic salary)
           + totalAllowances
           − totalDeductions
```

- `monthlyCumulative` = sum of daily earnings (minus any amounts already paid out) across the month
- `basicSalary` = `dailyRate × presentDays` (used only for percentage-based increment calculations)
- Overtime/undertime is calculated automatically from recorded time-in/time-out against standard working hours

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#090B10` |
| Surface | `#0F1219` / `#141820` |
| Accent (Amber) | `#F5A623` |
| Success (Green) | `#00E676` |
| Danger (Red) | `#FF1744` |
| Info (Blue) | `#29B6F6` |
| Text | `#DDE3F0` |
| Muted Text | `#5C6480` |
| Radius | `10px` |

Currency is formatted in **Indian Rupees (₹)** using the `en-IN` locale.

---

## 🗺️ Roadmap

- [ ] Export attendance & salary reports to PDF/Excel
- [ ] Search & filter in employee and salary lists
- [ ] Pagination for large employee lists
- [ ] Push notifications for payment/attendance events
- [ ] Persisted materials & photo storage for worksites (currently local-only)
- [ ] Light mode theme

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built for **Corporation of Mahanti Electricals**

</