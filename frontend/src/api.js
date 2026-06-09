// ═══════════════════════════════════════════════════════════════
//  CME API CLIENT — Corporation of Mahanti Electricals
//  Connects frontend to Node.js/Express + MongoDB backend
//  Backend: http://localhost:5000
//  Usage:  import { authAPI, employeeAPI, ... } from './api';
// ═══════════════════════════════════════════════════════════════

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Token helpers ────────────────────────────────────────────────
export function getToken()        { return localStorage.getItem('cme_token'); }
export function clearToken()      { localStorage.removeItem('cme_token'); }
export function saveToken(token)  { localStorage.setItem('cme_token', token); }

// ── Core request helper ──────────────────────────────────────────
async function req(method, path, body) {
  const token = getToken();
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);

  // If token expired / unauthorized, clear token so app re-shows login
  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('cme-unauthorized'));
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ── Shape normalizers ────────────────────────────────────────────
// Backend may return arrays OR keyed objects. Normalise to keyed maps.

/**
 * Converts an array of objects with an `empId` field
 * into a { [empId]: item } map — or passes through if already a plain object.
 */
function toMap(response, idField = 'empId') {
  if (!response) return {};
  if (Array.isArray(response)) {
    const map = {};
    response.forEach(item => {
      const key = item[idField];
      if (key !== undefined) map[key] = item;
    });
    return map;
  }
  // Already an object map
  return response;
}

/**
 * Salary list: backend returns either
 *   { [empId]: SalaryStructure }           (preferred)
 *   [{ empId, dailyRate, ... }]            (array form)
 */
function normaliseSalaryList(data) {
  if (Array.isArray(data)) {
    const map = {};
    data.forEach(s => {
      const { empId, ...rest } = s;
      if (empId !== undefined) map[empId] = rest;
    });
    return map;
  }
  return data || {};
}

/**
 * Settings list: same pattern as salary
 */
function normaliseSettingsList(data) {
  if (Array.isArray(data)) {
    const map = {};
    data.forEach(s => {
      const { empId, ...rest } = s;
      if (empId !== undefined) map[empId] = rest;
    });
    return map;
  }
  return data || {};
}

/**
 * Payment ledger list: backend returns either
 *   { [empId]: PayEvent[] }
 *   [{ empId, events: PayEvent[] }]  or  [{ empId, date, amount }]
 */
function normalisePaymentList(data) {
  if (Array.isArray(data)) {
    const map = {};
    data.forEach(item => {
      const { empId, events, ...rest } = item;
      if (empId !== undefined) {
        if (events) {
          map[empId] = events;
        } else {
          // Flat array of events — group by empId
          if (!map[empId]) map[empId] = [];
          map[empId].push(rest);
        }
      }
    });
    return map;
  }
  return data || {};
}

/**
 * Character list: same as salary
 */
function normaliseCharacterList(data) {
  if (Array.isArray(data)) {
    const map = {};
    data.forEach(c => {
      const { empId, ...rest } = c;
      if (empId !== undefined) map[empId] = rest;
    });
    return map;
  }
  return data || {};
}

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════
export const authAPI = {
  /** POST /api/auth/login → { token, employee } */
  login: (loginId, password) =>
    req('POST', '/auth/login', { loginId, password }),

  /** POST /api/auth/seed  — one-time DB seed (dev only) */
  seed: () => req('POST', '/auth/seed'),
};

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEES
// ═══════════════════════════════════════════════════════════════
export const employeeAPI = {
  /** GET /api/employees → Employee[] */
  list: () => req('GET', '/employees'),

  /** GET /api/employees/:id → Employee */
  get: (id) => req('GET', `/employees/${id}`),

  /**
   * POST /api/employees → Employee (created)
   * NOTE: backend assigns _id; your frontend uses numeric `id`.
   * Make sure your backend stores and returns the `id` field.
   */
  create: (emp) => req('POST', '/employees', emp),

  /** PUT /api/employees/:id → Employee (updated) */
  update: (id, emp) => req('PUT', `/employees/${id}`, emp),

  /** DELETE /api/employees/:id */
  delete: (id) => req('DELETE', `/employees/${id}`),
};

// ═══════════════════════════════════════════════════════════════
//  ATTENDANCE
// ═══════════════════════════════════════════════════════════════
export const attendanceAPI = {
  /**
   * GET /api/attendance?year=YYYY&month=M
   * → { "YYYY-MM-DD": { [empId]: DayRecord } }
   * month is 1-indexed (January = 1)
   */
  getMonth: (year, month) =>
    req('GET', `/attendance?year=${year}&month=${month}`),

  /** GET /api/attendance/:dateKey → { [empId]: DayRecord } */
  getDay: (dateKey) => req('GET', `/attendance/${dateKey}`),

  /**
   * PUT /api/attendance/:dateKey
   * body: { [empId]: DayRecord }   — full day bulk upsert
   */
  putDay: (dateKey, dayData) =>
    req('PUT', `/attendance/${dateKey}`, dayData),

  /**
   * PUT /api/attendance/:dateKey/:empId
   * body: DayRecord                — single employee record
   */
  putRecord: (dateKey, empId, record) =>
    req('PUT', `/attendance/${dateKey}/${empId}`, record),
};

// ═══════════════════════════════════════════════════════════════
//  SALARY STRUCTURES
// ═══════════════════════════════════════════════════════════════
export const salaryAPI = {
  /**
   * GET /api/salary  (admin)
   * → { [empId]: SalaryStructure }
   */
  list: async () => {
    const data = await req('GET', '/salary');
    return normaliseSalaryList(data);
  },

  /**
   * GET /api/salary/:empId
   * → SalaryStructure
   */
  get: (empId) => req('GET', `/salary/${empId}`),

  /** PUT /api/salary/:empId — body: SalaryStructure */
  update: (empId, struct) => req('PUT', `/salary/${empId}`, struct),

  /**
   * PATCH /api/salary/:empId/payment-mark
   * body: { monthKey: "YYYY-M" }
   */
  markPayment: (empId, monthKey) =>
    req('PATCH', `/salary/${empId}/payment-mark`, { monthKey }),
};

// ═══════════════════════════════════════════════════════════════
//  CHARACTER PROFILES  (admin-only)
// ═══════════════════════════════════════════════════════════════
export const characterAPI = {
  /**
   * GET /api/character  → { [empId]: CharacterProfile }
   */
  list: async () => {
    const data = await req('GET', '/character');
    return normaliseCharacterList(data);
  },

  /** GET /api/character/:empId → CharacterProfile */
  get: (empId) => req('GET', `/character/${empId}`),

  /** PUT /api/character/:empId — body: CharacterProfile */
  update: (empId, profile) => req('PUT', `/character/${empId}`, profile),
};

// ═══════════════════════════════════════════════════════════════
//  PAYMENT LEDGER
// ═══════════════════════════════════════════════════════════════
export const paymentAPI = {
  /**
   * GET /api/payment  (admin) → { [empId]: PayEvent[] }
   */
  list: async () => {
    const data = await req('GET', '/payment');
    return normalisePaymentList(data);
  },

  /**
   * GET /api/payment/:empId → PayEvent[]
   */
  get: async (empId) => {
    const data = await req('GET', `/payment/${empId}`);
    // backend might return { events: [] } or directly []
    return Array.isArray(data) ? data : (data.events || []);
  },

  /** POST /api/payment/:empId — body: PayEvent → adds entry */
  add: (empId, event) => req('POST', `/payment/${empId}`, event),

  /** DELETE /api/payment/:empId/event — body: { eventId } */
  delete: (empId, eventId) =>
    req('DELETE', `/payment/${empId}/event`, { eventId }),
};

// ═══════════════════════════════════════════════════════════════
//  WORKSITES
// ═══════════════════════════════════════════════════════════════
export const worksiteAPI = {
  /** GET /api/worksites → Worksite[] */
  list: () => req('GET', '/worksites'),

  /** POST /api/worksites — body: { id, name } → Worksite */
  create: (site) => req('POST', '/worksites', site),

  /** PUT /api/worksites/:siteId — body: { name } */
  update: (siteId, site) => req('PUT', `/worksites/${siteId}`, site),

  /** DELETE /api/worksites/:siteId */
  delete: (siteId) => req('DELETE', `/worksites/${siteId}`),
};

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE SETTINGS  (OT rate, etc.)
// ═══════════════════════════════════════════════════════════════
export const settingsAPI = {
  /**
   * GET /api/settings  (admin) → { [empId]: { overtimeRate } }
   */
  list: async () => {
    const data = await req('GET', '/settings');
    return normaliseSettingsList(data);
  },

  /** GET /api/settings/:empId → { overtimeRate } */
  get: (empId) => req('GET', `/settings/${empId}`),

  /** PUT /api/settings/:empId — body: { overtimeRate } */
  update: (empId, settings) => req('PUT', `/settings/${empId}`, settings),
};

// ═══════════════════════════════════════════════════════════════
//  CONVENIENCE: load everything for a user after login
//  Returns { employees, attendance, worksites, salary,
//            settings, payment, character }
// ═══════════════════════════════════════════════════════════════
export async function loadAllForUser(user) {
  const isAdmin = user.role === 'Administrator' || user.role === 'Admin Manager';
  const now     = new Date();
  const year    = now.getFullYear();
  const month   = now.getMonth() + 1; // 1-indexed

  const results = await Promise.allSettled([
    employeeAPI.list(),                                       // 0
    attendanceAPI.getMonth(year, month),                      // 1
    worksiteAPI.list(),                                       // 2
    isAdmin ? salaryAPI.list()
            : salaryAPI.get(user.id)
                .then(s => ({ [user.id]: s }))
                .catch(() => ({})),                           // 3
    isAdmin ? settingsAPI.list()
            : settingsAPI.get(user.id)
                .then(s => ({ [user.id]: s }))
                .catch(() => ({})),                           // 4
    isAdmin ? paymentAPI.list()
            : paymentAPI.get(user.id)
                .then(p => ({ [user.id]: p }))
                .catch(() => ({})),                           // 5
    isAdmin ? characterAPI.list()
            : Promise.resolve({}),                            // 6
  ]);

  const ok  = (i) => results[i].status === 'fulfilled' ? results[i].value : null;
  const err = (i) => results[i].status === 'rejected'  ? results[i].reason : null;

  // Log non-critical failures (don't crash the app)
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const names = ['employees','attendance','worksites','salary','settings','payment','character'];
      console.warn(`CME API: ${names[i]} load failed —`, r.reason?.message);
    }
  });

  return {
    employees:         ok(0) || [],
    attendance:        ok(1) || {},
    worksites:         ok(2) || [],
    salaryStructures:  ok(3) || {},
    employeeSettings:  ok(4) || {},
    paymentLedger:     ok(5) || {},
    characterProfiles: ok(6) || {},
    loadedMonthKey:    `${year}-${month}`,
  };
}