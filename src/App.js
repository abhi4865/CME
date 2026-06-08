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
    const d      = new Date(year, month, i + 1);
    const isPast = d <= today;

    return {
      date:    i + 1,
      dayName: DAY_NAMES[d.getDay()],
      present: isPast ? Math.random() > 0.15 : false,
      payment: isPast && Math.random() > 0.4
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

  let presentDays      = 0;
  let absentDays       = 0;
  let totalWorkingDays = 0;
  let totalSalary      = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    totalWorkingDays++;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const record  = dailyRecords[dateKey]?.[employee.id];

    if (record?.status === 'present') presentDays++;
    if (record?.status === 'absent')  absentDays++;
    if (record?.payment) totalSalary += record.payment;
  }

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
function AdminDashboard({ employee, onLogout, dailyRecords, setDailyRecords }) {
  const now  = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [day,   setDay]           = useState(now.getDate());
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  // dailyRecords is now lifted to App and passed in as a prop

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Clamp day when switching to a shorter month
  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, daysInMonth, day]);

  const dateKey      = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const staff        = EMPLOYEES.filter(e => e.role !== 'Administrator');
  const currentDayData = dailyRecords[dateKey] || {};

  // ── Inherited worksite ──────────────────────────────────────────
  const getInheritedWorksite = (empId) => {
    for (let d = day; d >= 1; d--) {
      const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.worksiteSet) return rec.worksite;
    }
    const allKeys = Object.keys(dailyRecords).sort();
    const cutoff  = dateKey;
    for (let i = allKeys.length - 1; i >= 0; i--) {
      const k = allKeys[i];
      if (k >= cutoff) continue;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.worksiteSet) return rec.worksite;
    }
    return '';
  };

  // ── Inherited salary ────────────────────────────────────────────
  const getInheritedSalary = (empId) => {
    for (let d = day - 1; d >= 1; d--) {
      const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.paymentSet) return rec.payment;
    }
    const allKeys = Object.keys(dailyRecords).sort();
    const cutoff  = dateKey;
    for (let i = allKeys.length - 1; i >= 0; i--) {
      const k = allKeys[i];
      if (k >= cutoff) continue;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.paymentSet) return rec.payment;
    }
    return 0;
  };

  // ── Mutations ──
  const cycleStatus = empId => {
    const empData = currentDayData[empId] || { status: null, payment: 0 };
    const next = empData.status === null ? 'present'
               : empData.status === 'present' ? 'absent'
               : null;

    const newPayment = next === 'present' ? getInheritedSalary(empId) : 0;

    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [empId]: {
          ...empData,
          status:     next,
          payment:    newPayment,
          paymentSet: false,
        },
      },
    }));
  };

  const setPayment = (empId, val) => {
    const empData = currentDayData[empId] || { status: null, payment: 0 };
    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [empId]: {
          ...empData,
          payment:    Math.max(0, parseInt(val) || 0),
          paymentSet: true,
        },
      },
    }));
  };

  const setWorksite = (empId, val) => {
    const empData = currentDayData[empId] || { status: null, payment: 0 };
    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [empId]: { ...empData, worksite: val, worksiteSet: true } },
    }));
  };

  // ── Daily Totals for Stats Strip ──
  let presentCount = 0;
  let absentCount  = 0;
  let totalDailyPayment = 0;

  staff.forEach(emp => {
    const data = currentDayData[emp.id];
    if (data?.status === 'present') presentCount++;
    if (data?.status === 'absent')  absentCount++;
    if (data?.payment)              totalDailyPayment += data.payment;
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
              <label className="day-picker-lbl">Date:</label>
              <select
                className="day-select"
                value={day}
                onChange={e => setDay(Number(e.target.value))}
              >
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {MONTH_NAMES[month]}
                  </option>
                ))}
              </select>

              <label className="day-picker-lbl">Year:</label>
              <select
                className="day-select"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
              >
                {Array.from({ length: 6 }, (_, i) => {
                  const y = now.getFullYear() - 2 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
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
                  <th>Worksite</th>
                  <th>Salary (₹)</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((emp, index) => {
                  const record      = currentDayData[emp.id] || { status: null, payment: 0 };
                  const status      = record.status;
                  const worksiteVal = record.worksiteSet
                    ? record.worksite
                    : getInheritedWorksite(emp.id);
                  const isInherited = !record.worksiteSet && worksiteVal !== '';

                  const isPaymentDisabled  = status !== 'present';
                  const displayPayment     = isPaymentDisabled ? 0 : record.payment;
                  const isSalaryInherited  = status === 'present' && !record.paymentSet && record.payment > 0;

                  return (
                    <tr key={emp.id} className="trow">
                      <td className="td-date">{String(index + 1).padStart(2, '0')}</td>
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
                      <td>
                        <button
                          className={`att-btn ${
                            status === 'present' ? 'att-present'
                            : status === 'absent' ? 'att-absent'
                            : 'att-mark'
                          }`}
                          onClick={() => cycleStatus(emp.id)}
                        >
                          {status === 'present' ? '● PRESENT'
                           : status === 'absent'  ? '● ABSENT'
                           : '○ MARK'}
                        </button>
                      </td>
                      <td>
                        <div className="worksite-cell">
                          <input
                            className={`worksite-inp${isInherited ? ' worksite-inherited' : ''}`}
                            type="text"
                            placeholder="e.g. Site A, Delhi"
                            value={worksiteVal}
                            title={isInherited ? 'Carried over from a previous date — type to change from this date onward' : ''}
                            onChange={e => setWorksite(emp.id, e.target.value)}
                          />
                          {isInherited && <span className="worksite-badge">carried</span>}
                        </div>
                      </td>
                      <td>
                        <div className="worksite-cell">
                          <div className="pay-cell">
                            <span className="rupee">₹</span>
                            <input
                              className={"pay-inp" + (isSalaryInherited ? " pay-inherited" : "")}
                              type="number"
                              min="0"
                              value={displayPayment}
                              disabled={isPaymentDisabled}
                              title={
                                isPaymentDisabled
                                  ? (status === "absent" ? "Absent — salary is ₹0" : "Mark attendance first")
                                  : (isSalaryInherited ? "Auto-filled from previous salary — type to override" : "")
                              }
                              onChange={e => setPayment(emp.id, e.target.value)}
                            />
                          </div>
                          {isSalaryInherited && <span className="worksite-badge">carried</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={4} className="tfoot-lbl" style={{ textAlign: 'right', paddingRight: '2rem' }}>
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
function EmployeeDashboard({ employee, onLogout, dailyRecords }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year]            = useState(now.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum  = i + 1;
    const d       = new Date(year, month, dayNum);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const record  = dailyRecords[dateKey]?.[employee.id];
    return {
      date:     dayNum,
      dayName:  DAY_NAMES[d.getDay()],
      status:   record?.status ?? null,
      payment:  record?.status === 'present' ? (record?.payment || 0) : 0,
      worksite: record?.worksite || '',
    };
  });

  const changeMonth = m => setMonth(m);

  let runningTotal = 0;
  const enriched = rows.map(r => {
    runningTotal += r.payment;
    return { ...r, cumulative: runningTotal };
  });

  const workingDays  = rows.length;
  const presentCount = rows.filter(r => r.status === 'present').length;
  const absentCount  = rows.filter(r => r.status === 'absent').length;
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
              <th>Worksite</th>
              <th>Payment (₹)</th>
              <th>Monthly Cumulative (₹)</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.date} className="trow">
                <td className="td-date">{String(r.date).padStart(2, '0')}</td>
                <td className="td-day">{r.dayName}</td>
                <td>
                  {r.status === 'present' ? (
                    <span className="badge-off att-present">● PRESENT</span>
                  ) : r.status === 'absent' ? (
                    <span className="badge-off att-absent">● ABSENT</span>
                  ) : (
                    <span className="badge-off att-pending">○ NOT MARKED</span>
                  )}
                </td>
                <td>
                  {r.worksite ? (
                    <span className="worksite-label">{r.worksite}</span>
                  ) : (
                    <span className="td-dash">—</span>
                  )}
                </td>
                <td>
                  <div className="pay-cell">
                    <span className="rupee">₹</span>
                    <span className="cum-amt">{r.payment.toLocaleString('en-IN')}</span>
                  </div>
                </td>
                <td className="td-cum">
                  <span className="cum-amt">₹{r.cumulative.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-row">
              <td colSpan={4} className="tfoot-lbl">MONTHLY TOTAL</td>
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
  const [user,         setUser]         = useState(null);
  const [err,          setErr]          = useState('');
  const [dailyRecords, setDailyRecords] = useState({});

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
        <AdminDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
          setDailyRecords={setDailyRecords}
        />
      )}
      {user && user.role !== 'Administrator' && (
        <EmployeeDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
        />
      )}
    </div>
  );
}

export default App;