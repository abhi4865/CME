# CME Backend — Corporation of Mahanti Electricals

Node.js · Express · MongoDB · JWT Auth

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create your `.env` (copy from `.env.example`)
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cme_db   # or your Atlas URI
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running locally, or use a free [MongoDB Atlas](https://cloud.mongodb.com) cluster.

### 4. Run the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 5. Seed the database (ONE TIME ONLY)
```bash
curl -X POST http://localhost:5000/api/auth/seed
```
This creates the 5 default employees + 2 worksites exactly matching your frontend defaults.

---

## API Reference

### Auth
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | Public | Login → returns `{ token, employee }` |
| POST | `/api/auth/seed` | Public | Seed default data (run once) |

### Employees
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/employees` | Any logged-in |
| GET | `/api/employees/:id` | Admin |
| POST | `/api/employees` | Admin |
| PUT | `/api/employees/:id` | Admin |
| DELETE | `/api/employees/:id` | Admin |

### Attendance
| Method | Path | Access | Notes |
|--------|------|--------|-------|
| GET | `/api/attendance?year=&month=` | Any | Returns `{ "YYYY-MM-DD": { [empId]: record } }` |
| GET | `/api/attendance/:dateKey` | Any | Single day |
| PUT | `/api/attendance/:dateKey` | Admin | Bulk upsert full day |
| PUT | `/api/attendance/:dateKey/:empId` | Admin | Single record |

### Salary
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/salary` | Admin |
| GET | `/api/salary/:empId` | Any |
| PUT | `/api/salary/:empId` | Admin |
| PATCH | `/api/salary/:empId/payment-mark` | Admin |

### Character Profiles ⚠️ Admin-only
| Method | Path |
|--------|------|
| GET | `/api/character` |
| GET | `/api/character/:empId` |
| PUT | `/api/character/:empId` |

### Payment Ledger
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/payment` | Admin |
| GET | `/api/payment/:empId` | Any |
| POST | `/api/payment/:empId` | Admin |
| DELETE | `/api/payment/:empId/event` | Admin |

### Worksites
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/worksites` | Any |
| POST | `/api/worksites` | Admin |
| PUT | `/api/worksites/:siteId` | Admin |
| DELETE | `/api/worksites/:siteId` | Admin |

### Settings (OT Rate)
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/settings` | Admin |
| GET | `/api/settings/:empId` | Any |
| PUT | `/api/settings/:empId` | Admin |

---

## Frontend Integration

1. Copy `api.js` → `frontend/src/api.js`
2. Add to `frontend/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Replace `localStorage` calls in `App.js` with imports from `api.js`:
   ```js
   import { authAPI, attendanceAPI, salaryAPI, ... } from './api';
   ```

### Login example
```js
// Before (localStorage)
const emp = employees.find(e => e.loginId === id && e.password === pwd);

// After (API)
const emp = await authAPI.login(loginId, password);
setUser(emp);
```

### Attendance example
```js
// Before
const saved = lsGet('cme_dailyRecords', {});

// After
const saved = await attendanceAPI.getMonth(year, month);
```

---

## Roles & Security

| Role | Token claim | Endpoints |
|------|-------------|-----------|
| `Administrator` | isMainAdmin | All endpoints |
| `Admin Manager` | isAdmin | All except Admin Managers panel |
| Any other | — | Own data only; no character profiles |

JWT tokens expire in **7 days**. The token is stored in `localStorage` under `cme_token`.

---

## File Structure
```
backend/
├── server.js
├── .env.example
├── package.json
├── models/
│   ├── Employee.js
│   ├── DailyRecord.js
│   ├── SalaryStructure.js
│   ├── CharacterProfile.js
│   ├── PaymentLedger.js
│   ├── Worksite.js
│   └── EmployeeSettings.js
├── middleware/
│   └── auth.js
├── controllers/
│   ├── authController.js
│   ├── employeeController.js
│   ├── attendanceController.js
│   ├── salaryController.js
│   ├── characterController.js
│   ├── paymentController.js
│   ├── worksiteController.js
│   └── settingsController.js
└── routes/
    ├── auth.js
    ├── employees.js
    ├── attendance.js
    ├── salary.js
    ├── character.js
    ├── payment.js
    ├── worksites.js
    └── settings.js
```