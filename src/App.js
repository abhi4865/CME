import React, { useState, useEffect } from 'react';
import './App.css';

// ─── DUMMY EMPLOYEE DATA ────────────────────────────────────────
const EMPLOYEES = [
  { id: 1, loginId: 'EMP001', password: 'pass001', name: 'Rajesh Kumar',   role: 'Senior Electrician' },
  { id: 2, loginId: 'EMP002', password: 'pass002', name: 'Priya Sharma',   role: 'Site Supervisor'    },
  { id: 3, loginId: 'EMP003', password: 'pass003', name: 'Amit Singh',     role: 'Technician'         },
  { id: 4, loginId: 'EMP004', password: 'pass004', name: 'Sunita Verma',   role: 'Electrician'        },
  { id: 5, loginId: 'ADMIN',  password: 'admin123', name: 'Admin Manager', role: 'Administrator'      },
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─── BUILD MONTH ATTENDANCE RECORDS ────────────────────────────
function buildMonthRecords(year, month) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isPast = d <= today;

    return {
      date: i + 1,
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
  const [loginId, setLoginId]   = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [shaking, setShaking]   = useState(false);

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

        {/* ── Brand Header ── */}
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

        {/* ── Form ── */}
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

        {/* ── Demo credentials ── */}
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
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({ employee, onLogout }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year]            = useState(now.getFullYear());
  const [rows, setRows]   = useState(() =>
    buildMonthRecords(now.getFullYear(), now.getMonth())
  );

  const changeMonth = m => {
    setMonth(m);
    setRows(buildMonthRecords(year, m));
  };

  const togglePresent = date =>
    setRows(prev => prev.map(r => r.date === date ? { ...r, present: !r.present } : r));

  const setPayment = (date, val) =>
    setRows(prev => prev.map(r =>
      r.date === date ? { ...r, payment: Math.max(0, parseInt(val) || 0) } : r
    ));

  // Compute cumulative totals
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
        <StatCard label="Days Present"  value={presentCount}                             accentColor="#00C853" />
        <StatCard label="Days Absent"   value={absentCount}                              accentColor="#FF1744" />
        <StatCard label="Working Days"  value={workingDays}                              accentColor="#F5A623" />
        <StatCard label="Total Payment" value={`₹${totalPayment.toLocaleString('en-IN')}`} accentColor="#00BFFF" />
      </div>

      {/* ── MONTH PICKER ── */}
      <div className="month-bar">
        <span className="month-bar-lbl">Attendance Sheet</span>
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
              <th>Attendance</th>
              <th>Payment (₹)</th>
              <th>Monthly Cumulative (₹)</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.date} className={`trow ${r.isWeekend ? 'trow-wend' : ''}`}>

                {/* Date */}
                <td className="td-date">{String(r.date).padStart(2, '0')}</td>

                {/* Day */}
                <td className={`td-day ${r.isWeekend ? 'day-wend' : ''}`}>{r.dayName}</td>

                {/* Attendance */}
                <td>
                  {r.isWeekend ? (
                    <span className="badge-off">OFF</span>
                  ) : (
                    <button
                      className={`att-btn ${r.present ? 'att-present' : 'att-absent'}`}
                      onClick={() => togglePresent(r.date)}
                    >
                      {r.present ? '✓  Present' : '✗  Absent'}
                    </button>
                  )}
                </td>

                {/* Payment */}
                <td>
                  {r.isWeekend ? (
                    <span className="td-dash">—</span>
                  ) : (
                    <div className="pay-cell">
                      <span className="rupee">₹</span>
                      <input
                        className="pay-inp"
                        type="number"
                        min="0"
                        value={r.payment}
                        onChange={e => setPayment(r.date, e.target.value)}
                      />
                    </div>
                  )}
                </td>

                {/* Cumulative */}
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

  return (
    <div className="App">
      {user
        ? <Dashboard employee={user} onLogout={() => { setUser(null); setErr(''); }} />
        : <LoginPage  onLogin={handleLogin} error={err} />
      }
    </div>
  );
}

export default App;
