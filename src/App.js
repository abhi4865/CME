import React, { useState, useEffect } from 'react';
import './App.css';

// ─── EMPLOYEE DATA ──────────────────────────────────────────────
const EMPLOYEES = [
  { id: 1, loginId: 'EMP001', password: 'pass001', name: 'Rajesh Kumar',   role: 'Senior Electrician' },
  { id: 2, loginId: 'EMP002', password: 'pass002', name: 'Priya Sharma',   role: 'Site Supervisor'    },
  { id: 3, loginId: 'EMP003', password: 'pass003', name: 'Amit Singh',     role: 'Technician'         },
  { id: 4, loginId: 'EMP004', password: 'pass004', name: 'Sunita Verma',   role: 'Electrician'        },
  { id: 5, loginId: 'ADMIN',  password: 'admin123', name: 'Admin Manager', role: 'Administrator'      },
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─── HELPERS ────────────────────────────────────────────────────
function buildMonthRecords(year, month) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today     = new Date();

  return Array.from({ length: totalDays }, (_, i) => {
    const d         = new Date(year, month, i + 1);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isPast    = d <= today;

    return {
      date:    i + 1,
      dayName: DAY_NAMES[d.getDay()],
      isWeekend,
      present: isPast && !isWeekend ? Math.random() > 0.15 : false,
      payment: isPast && !isWeekend && Math.random() > 0.4
        ? Math.floor(Math.random() * 700 + 300)
        : 0,
    };
  });
}

// ═══════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin, error }) {
  const [loginId,  setLoginId]  = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [shaking,  setShaking]  = useState(false);

  useEffect(() => {
    if (error) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(loginId.trim(), password);
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className={`login-card ${shaking ? 'shake' : ''}`}>

        <div className="brand-block">
          <div className="brand-bolt">⚡</div>
          <div className="brand-info">
            <span className="brand-cme">CME</span>
            <span className="brand-full">Corporation of Mahanti Electricals</span>
          </div>
        </div>

        <div className="brand-rule" />

        <h2 className="login-heading">Employee Portal</h2>
        <p className="login-tagline">Sign in to access your attendance dashboard</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-lbl">Login ID</label>
            <input
              className="field-inp"
              type="text"
              placeholder="e.g. EMP001"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="field-group">
            <label className="field-lbl">Password</label>
            <div className="pwd-wrap">
              <input
                className="field-inp"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="pwd-eye"
                onClick={() => setShowPwd(v => !v)}
                aria-label="Toggle password visibility"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button className="login-btn" type="submit">
            Sign In <span className="login-arrow">→</span>
          </button>
        </form>

        <div className="demo-hint">
          <span className="demo-lbl">Demo accounts:</span>
          <code>EMP001 / pass001</code>
          <span className="demo-sep">·</span>
          <code>ADMIN / admin123</code>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STAT CARD
// ═══════════════════════════════════════════════════════════════
function StatCard({ label, value, accentColor }) {
  return (
    <div className="stat-card" style={{ '--card-accent': accentColor }}>
      <span className="stat-val">{value}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN EMPLOYEE PROFILE
//  Calculates monthly totals from the shared dailyRecords state
// ═══════════════════════════════════════════════════════════════
function AdminEmployeeProfile({ employee, month, year, dailyRecords, onBack }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let presentDays     = 0;
  let totalWorkingDays = 0;
  let totalSalary     = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj   = new Date(year, month, d);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    if (!isWeekend) {
      totalWorkingDays++;
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record  = dailyRecords[dateKey]?.[employee.id];

      if (record?.present)  presentDays++;
      if (record?.payment)  totalSalary += record.payment;
    }
  }

  const absentDays = totalWorkingDays - presentDays;

  return (
    <>
      {/* ── Control Bar ── */}
      <div className="month-bar">
        <button className="mtab mtab-on" onClick={onBack}>
          ← Back to Daily List
        </button>
        <span className="month-display">{MONTH_NAMES[month]} {year} — Monthly Overview</span>
      </div>

      {/* ── Monthly Stats ── */}
      <div className="stats-strip">
        <StatCard label="Total Salary Received" value={`₹${totalSalary.toLocaleString('en-IN')}`}  accentColor="#00BFFF" />
        <StatCard label="Days Present"           value={presentDays}                                 accentColor="#00C853" />
        <StatCard label="Days Absent"            value={absentDays}                                  accentColor="#FF1744" />
        <StatCard label="Total Working Days"     value={totalWorkingDays}                             accentColor="#F5A623" />
      </div>

      {/* ── Employee Details Card ── */}
      <div className="profile-card">
        <div className="profile-avatar">{employee.name[0]}</div>
        <div className="profile-info">
          <h2 className="profile-name">{employee.name}</h2>
          <div className="profile-role">{employee.role}</div>
          <div className="profile-id">ID: {employee.loginId}</div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD  –  Daily roster for all employees
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({ employee, onLogout }) {
  const now  = new Date();
  const [year]  = useState(now.getFullYear());
  const [month, setMonth]         = useState(now.getMonth());
  const [day,   setDay]           = useState(now.getDate());
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  // dailyRecords: { "YYYY-MM-DD": { empId: { present, payment } } }
  const [dailyRecords, setDailyRecords] = useState({});

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Clamp day when switching to a shorter month
  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, daysInMonth, day]);

  const dateKey      = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const staff        = EMPLOYEES.filter(e => e.role !== 'Administrator');
  const currentDayData = dailyRecords[dateKey] || {};

  // ── Mutations ──
  const togglePresent = empId => {
    const empData = currentDayData[empId] || { present: false, payment: 0 };
    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [empId]: { ...empData, present: !empData.present } },
    }));
  };

  const setPayment = (empId, val) => {
    const empData = currentDayData[empId] || { present: false, payment: 0 };
    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [empId]: { ...empData, payment: Math.max(0, parseInt(val) || 0) } },
    }));
  };

  // ── Daily Totals for Stats Strip ──
  let presentCount = 0;
  let absentCount  = staff.length;
  let totalDailyPayment = 0;

  staff.forEach(emp => {
    const data = currentDayData[emp.id];
    if (data?.present)  { presentCount++; absentCount--; }
    if (data?.payment)  { totalDailyPayment += data.payment; }
  });

  const selectedEmployee = staff.find(e => e.id === selectedEmpId);

  return (
    <div className="dashboard">

      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="hdr-brand">
          <span className="hdr-bolt">⚡</span>
          <div>
            <div className="hdr-cme">CME</div>
            <div className="hdr-full">Corporation of Mahanti Electricals</div>
          </div>
        </div>
        <div className="hdr-user">
          <div className="user-chip">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">{employee.name}</span>
              <span className="user-meta">{employee.role}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>⏻ Logout</button>
        </div>
      </header>

      {/* ── Conditionally render Profile OR Daily Table ── */}
      {selectedEmployee ? (
        <AdminEmployeeProfile
          employee={selectedEmployee}
          month={month}
          year={year}
          dailyRecords={dailyRecords}
          onBack={() => setSelectedEmpId(null)}
        />
      ) : (
        <>
          {/* ── STATS STRIP ── */}
          <div className="stats-strip">
            <StatCard label="Total Staff"   value={staff.length}                                              accentColor="#00BFFF" />
            <StatCard label="Present Today" value={presentCount}                                              accentColor="#00C853" />
            <StatCard label="Absent Today"  value={absentCount}                                               accentColor="#FF1744" />
            <StatCard label="Daily Payout"  value={`₹${totalDailyPayment.toLocaleString('en-IN')}`}          accentColor="#F5A623" />
          </div>

          {/* ── DATE PICKER BAR ── */}
          <div className="month-bar">
            <span className="month-bar-lbl">Daily Marking</span>

            <div className="month-tabs">
              {MONTH_NAMES.map((m, i) => (
                <button
                  key={i}
                  className={`mtab ${month === i ? 'mtab-on' : ''}`}
                  onClick={() => setMonth(i)}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="day-picker-wrap">
              <label className="day-picker-lbl">Select Date:</label>
              <select
                className="day-select"
                value={day}
                onChange={e => setDay(Number(e.target.value))}
              >
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {MONTH_NAMES[month]} {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── ADMIN ATTENDANCE TABLE ── */}
          <div className="tbl-wrap">
            <table className="att-tbl">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Employee Name</th>
                  <th>Present / Absent</th>
                  <th>Salary (₹)</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((emp, index) => {
                  const record = currentDayData[emp.id] || { present: false, payment: 0 };
                  return (
                    <tr key={emp.id} className="trow">

                      {/* S.No */}
                      <td className="td-date">{String(index + 1).padStart(2, '0')}</td>

                      {/* Name – click to open profile */}
                      <td>
                        <div className="emp-name-cell">
                          <span
                            className="user-name emp-name-link"
                            onClick={() => setSelectedEmpId(emp.id)}
                            title={`View ${emp.name}'s monthly profile`}
                          >
                            {emp.name}
                          </span>
                          <span className="emp-role-sub">{emp.role} · {emp.loginId}</span>
                        </div>
                      </td>

                      {/* Present / Absent Toggle */}
                      <td>
                        <button
                          className={`att-btn ${record.present ? 'att-present' : 'att-absent'}`}
                          onClick={() => togglePresent(emp.id)}
                        >
                          {record.present ? '✓  Present' : '✗  Absent'}
                        </button>
                      </td>

                      {/* Salary Input */}
                      <td>
                        <div className="pay-cell">
                          <span className="rupee">₹</span>
                          <input
                            className="pay-inp"
                            type="number"
                            min="0"
                            value={record.payment}
                            onChange={e => setPayment(emp.id, e.target.value)}
                          />
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={3} className="tfoot-lbl" style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    DAILY TOTAL
                  </td>
                  <td className="tfoot-amt">₹{totalDailyPayment.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE DASHBOARD  –  Personal monthly view (read-only)
// ═══════════════════════════════════════════════════════════════
function EmployeeDashboard({ employee, onLogout }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year]            = useState(now.getFullYear());
  const [rows,  setRows]  = useState(() => buildMonthRecords(now.getFullYear(), now.getMonth()));

  const changeMonth = m => {
    setMonth(m);
    setRows(buildMonthRecords(year, m));
  };

  let runningTotal = 0;
  const enriched = rows.map(r => {
    if (!r.isWeekend) runningTotal += r.payment;
    return { ...r, cumulative: runningTotal };
  });

  const workingDays  = rows.filter(r => !r.isWeekend).length;
  const presentCount = rows.filter(r => !r.isWeekend && r.present).length;
  const absentCount  = rows.filter(r => !r.isWeekend && !r.present).length;
  const totalPayment = rows.reduce((s, r) => s + r.payment, 0);

  return (
    <div className="dashboard">

      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="hdr-brand">
          <span className="hdr-bolt">⚡</span>
          <div>
            <div className="hdr-cme">CME</div>
            <div className="hdr-full">Corporation of Mahanti Electricals</div>
          </div>
        </div>
        <div className="hdr-user">
          <div className="user-chip">
            <div className="user-avatar">{employee.name[0]}</div>
            <div className="user-info">
              <span className="user-name">{employee.name}</span>
              <span className="user-meta">{employee.role} · {employee.loginId}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>⏻ Logout</button>
        </div>
      </header>

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        <StatCard label="Days Present"  value={presentCount}                                  accentColor="#00C853" />
        <StatCard label="Days Absent"   value={absentCount}                                   accentColor="#FF1744" />
        <StatCard label="Working Days"  value={workingDays}                                   accentColor="#F5A623" />
        <StatCard label="Total Payment" value={`₹${totalPayment.toLocaleString('en-IN')}`}   accentColor="#00BFFF" />
      </div>

      {/* ── MONTH PICKER ── */}
      <div className="month-bar">
        <span className="month-bar-lbl">My Attendance</span>
        <div className="month-tabs">
          {MONTH_NAMES.map((m, i) => (
            <button
              key={i}
              className={`mtab ${month === i ? 'mtab-on' : ''}`}
              onClick={() => changeMonth(i)}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
        <span className="month-display">{MONTH_NAMES[month]} {year}</span>
      </div>

      {/* ── ATTENDANCE TABLE ── */}
      <div className="tbl-wrap">
        <table className="att-tbl">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Attendance Status</th>
              <th>Payment (₹)</th>
              <th>Monthly Cumulative (₹)</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.date} className={`trow ${r.isWeekend ? 'trow-wend' : ''}`}>

                <td className="td-date">{String(r.date).padStart(2, '0')}</td>
                <td className={`td-day ${r.isWeekend ? 'day-wend' : ''}`}>{r.dayName}</td>

                <td>
                  {r.isWeekend ? (
                    <span className="badge-off">OFF</span>
                  ) : (
                    <span
                      className={`badge-off ${r.present ? 'att-present' : 'att-absent'}`}
                      style={{ padding: '0.4rem 1rem' }}
                    >
                      {r.present ? 'Present' : 'Absent'}
                    </span>
                  )}
                </td>

                <td>
                  {r.isWeekend ? (
                    <span className="td-dash">—</span>
                  ) : (
                    <div className="pay-cell">
                      <span className="rupee">₹</span>
                      <span className="cum-amt">{r.payment}</span>
                    </div>
                  )}
                </td>

                <td className="td-cum">
                  {r.isWeekend ? (
                    <span className="td-dash">—</span>
                  ) : (
                    <span className="cum-amt">₹{r.cumulative.toLocaleString('en-IN')}</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-row">
              <td colSpan={3} className="tfoot-lbl">MONTHLY TOTAL</td>
              <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
              <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
function App() {
  const [user, setUser] = useState(null);
  const [err,  setErr]  = useState('');

  const handleLogin = (id, pwd) => {
    const emp = EMPLOYEES.find(e =>
      e.loginId.toLowerCase() === id.toLowerCase() && e.password === pwd
    );
    if (emp) { setUser(emp); setErr(''); }
    else     { setErr('Invalid Login ID or Password. Please try again.'); }
  };

  const handleLogout = () => { setUser(null); setErr(''); };

  return (
    <div className="App">
      {!user && <LoginPage onLogin={handleLogin} error={err} />}
      {user && user.role === 'Administrator' && (
        <AdminDashboard employee={user} onLogout={handleLogout} />
      )}
      {user && user.role !== 'Administrator' && (
        <EmployeeDashboard employee={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
