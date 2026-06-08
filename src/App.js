import React, { useState, useEffect } from 'react';
import './App.css';

// ─── EMPLOYEE DATA ──────────────────────────────────────────────
// Moved to INITIAL_EMPLOYEES so App can manage it as state (enables CRUD)
const INITIAL_EMPLOYEES = [
  { id: 1, loginId: 'EMP001', password: 'pass001', name: 'Rajesh Kumar',   role: 'Senior Electrician', email: 'rajesh@cme.com',  department: 'Field Operations' },
  { id: 2, loginId: 'EMP002', password: 'pass002', name: 'Priya Sharma',   role: 'Site Supervisor',    email: 'priya@cme.com',   department: 'Site Management'  },
  { id: 3, loginId: 'EMP003', password: 'pass003', name: 'Amit Singh',     role: 'Technician',         email: 'amit@cme.com',    department: 'Technical'        },
  { id: 4, loginId: 'EMP004', password: 'pass004', name: 'Sunita Verma',   role: 'Electrician',        email: 'sunita@cme.com',  department: 'Field Operations' },
  { id: 5, loginId: 'ADMIN',  password: 'admin123', name: 'Admin Manager', role: 'Administrator',      email: 'admin@cme.com',   department: 'Management'       },
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
//  EMPLOYEE MANAGER  –  Admin-only CRUD panel
//  Features: View all · Create · Edit · Delete (with confirmation)
// ═══════════════════════════════════════════════════════════════
function EmployeeManager({ employees, setEmployees }) {
  const BLANK = { name: '', email: '', password: '', loginId: '', department: '', role: '' };

  const [view,          setView]         = useState('list');   // 'list' | 'create' | 'edit'
  const [editTarget,    setEditTarget]   = useState(null);
  const [deleteTarget,  setDeleteTarget] = useState(null);
  const [form,          setForm]         = useState(BLANK);
  const [formErr,       setFormErr]      = useState('');

  // ── Open helpers ──────────────────────────────────────────────
  const openCreate = () => {
    setForm({ ...BLANK, role: 'Electrician' });
    setFormErr('');
    setView('create');
  };

  const openEdit = emp => {
    setEditTarget(emp);
    setForm({
      name:       emp.name,
      email:      emp.email       || '',
      password:   emp.password,
      loginId:    emp.loginId,
      department: emp.department  || '',
      role:       emp.role,
    });
    setFormErr('');
    setView('edit');
  };

  const cancelForm = () => { setView('list'); setEditTarget(null); setFormErr(''); };

  const handleFieldChange = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    if (!form.name.trim())     return 'Full name is required.';
    if (!form.loginId.trim())  return 'Employee ID is required.';
    if (!form.password.trim()) return 'Password is required.';
    const dup = employees.find(e =>
      e.loginId.toLowerCase() === form.loginId.trim().toLowerCase() &&
      (view === 'create' || e.id !== editTarget?.id)
    );
    if (dup) return `Employee ID "${form.loginId.trim().toUpperCase()}" is already taken.`;
    return null;
  };

  // ── Create ────────────────────────────────────────────────────
  const handleCreate = () => {
    const err = validate();
    if (err) { setFormErr(err); return; }
    setEmployees(prev => [...prev, {
      id:         Math.max(...prev.map(e => e.id)) + 1,
      loginId:    form.loginId.trim().toUpperCase(),
      password:   form.password.trim(),
      name:       form.name.trim(),
      role:       form.role.trim() || 'Electrician',
      email:      form.email.trim(),
      department: form.department.trim(),
    }]);
    setView('list');
  };

  // ── Save Edit ─────────────────────────────────────────────────
  const handleSaveEdit = () => {
    const err = validate();
    if (err) { setFormErr(err); return; }
    setEmployees(prev => prev.map(e =>
      e.id !== editTarget.id ? e : {
        ...e,
        loginId:    form.loginId.trim().toUpperCase(),
        password:   form.password.trim(),
        name:       form.name.trim(),
        role:       form.role.trim() || e.role,
        email:      form.email.trim(),
        department: form.department.trim(),
      }
    ));
    setView('list');
    setEditTarget(null);
  };

  // ── Delete ────────────────────────────────────────────────────
  const doDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Non-admin staff only
  const staff = employees.filter(e => e.role !== 'Administrator');

  // ════════════════════════════════════════════════════════════
  //  FORM VIEW  (shared for Create and Edit)
  // ════════════════════════════════════════════════════════════
  if (view === 'create' || view === 'edit') {
    const isEdit = view === 'edit';
    return (
      <div className="emp-form-wrap">
        <div className="emp-form-header">
          <button className="mtab mtab-on emp-back-btn" onClick={cancelForm}>
            ← Back to Directory
          </button>
          <h2 className="emp-form-title">
            {isEdit ? '✏ Edit Employee' : '＋ New Employee'}
          </h2>
          <p className="emp-form-sub">
            {isEdit
              ? `Updating record for ${editTarget.name} (${editTarget.loginId})`
              : 'Fill in the details below to create a new employee account.'}
          </p>
        </div>

        <div className="emp-form">
          <div className="emp-form-grid">
            <div className="field-group">
              <label className="field-lbl">Full Name *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. Ravi Prasad"
                value={form.name}
                onChange={e => handleFieldChange('name', e.target.value)}
                autoFocus
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Employee ID *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. EMP005"
                value={form.loginId}
                onChange={e => handleFieldChange('loginId', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Password *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="Set a login password"
                value={form.password}
                onChange={e => handleFieldChange('password', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Email Address</label>
              <input
                className="field-inp"
                type="email"
                placeholder="e.g. ravi@cme.com"
                value={form.email}
                onChange={e => handleFieldChange('email', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Department</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. Field Operations"
                value={form.department}
                onChange={e => handleFieldChange('department', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Role / Designation</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. Senior Electrician"
                value={form.role}
                onChange={e => handleFieldChange('role', e.target.value)}
              />
            </div>
          </div>

          {formErr && (
            <div className="login-error emp-form-err">
              <span>⚠</span> {formErr}
            </div>
          )}

          <div className="emp-form-actions">
            <button className="emp-btn-cancel" onClick={cancelForm}>Cancel</button>
            <button
              className="login-btn emp-form-submit"
              onClick={isEdit ? handleSaveEdit : handleCreate}
            >
              {isEdit ? 'Save Changes' : 'Create Employee'}
              <span className="login-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  LIST VIEW
  // ════════════════════════════════════════════════════════════
  return (
    <div className="emp-mgr">

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">⚠</div>
            <h3 className="confirm-title">Delete Employee?</h3>
            <p className="confirm-msg">
              You are about to permanently remove{' '}
              <strong>{deleteTarget.name}</strong> ({deleteTarget.loginId}).
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="emp-btn-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="emp-btn-delete-confirm" onClick={doDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Panel Header ── */}
      <div className="emp-mgr-header">
        <div>
          <h2 className="emp-mgr-title">Employee Directory</h2>
          <p className="emp-mgr-sub">
            {staff.length} employee{staff.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button className="emp-btn-add" onClick={openCreate}>
          ＋ Add Employee
        </button>
      </div>

      {/* ── Directory Table ── */}
      <div className="tbl-wrap">
        <table className="att-tbl emp-tbl">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={6} className="emp-tbl-empty">
                  No employees registered yet. Click "＋ Add Employee" to get started.
                </td>
              </tr>
            ) : (
              staff.map((emp, idx) => (
                <tr key={emp.id} className="trow">
                  <td className="td-date">{String(idx + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="emp-name-cell">
                      <span className="user-name">{emp.name}</span>
                      <span className="emp-role-sub">{emp.role}</span>
                    </div>
                  </td>
                  <td>
                    <code className="emp-id-badge">{emp.loginId}</code>
                  </td>
                  <td className="emp-tbl-muted">
                    {emp.department || <span className="td-dash">—</span>}
                  </td>
                  <td className="emp-tbl-muted">
                    {emp.email || <span className="td-dash">—</span>}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn action-edit"
                        onClick={() => openEdit(emp)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => setDeleteTarget(emp)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
//  ADMIN DASHBOARD  –  Daily roster + Employee Management tabs
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({ employee, onLogout, dailyRecords, setDailyRecords, employees, setEmployees }) {
  const now  = new Date();
  const [year,         setYear]         = useState(now.getFullYear());
  const [month,        setMonth]        = useState(now.getMonth());
  const [day,          setDay]          = useState(now.getDate());
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  // ── New: tab navigation (admin-only, completely hidden from employees) ──
  const [activeTab,    setActiveTab]    = useState('attendance'); // 'attendance' | 'employees'

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Clamp day when switching to a shorter month
  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, daysInMonth, day]);

  const dateKey        = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // Use employees prop (state) instead of the old EMPLOYEES constant
  const staff          = employees.filter(e => e.role !== 'Administrator');
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
  let presentCount      = 0;
  let absentCount       = 0;
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

      {/* ── ADMIN NAVIGATION TABS (visible to Administrator only) ── */}
      <div className="admin-nav">
        <button
          className={`admin-nav-tab ${activeTab === 'attendance' ? 'admin-nav-tab-on' : ''}`}
          onClick={() => { setActiveTab('attendance'); setSelectedEmpId(null); }}
        >
          📋 Daily Attendance
        </button>
        <button
          className={`admin-nav-tab ${activeTab === 'employees' ? 'admin-nav-tab-on' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Manage Employees
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TAB: DAILY ATTENDANCE  (existing functionality, unchanged)
          ══════════════════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        selectedEmployee ? (
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
        )
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: MANAGE EMPLOYEES  (new — admin-only CRUD panel)
          ══════════════════════════════════════════════════════════ */}
      {activeTab === 'employees' && (
        <EmployeeManager employees={employees} setEmployees={setEmployees} />
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
  // employees is now state so the admin can create / edit / delete
  const [employees,    setEmployees]    = useState(INITIAL_EMPLOYEES);
  const [user,         setUser]         = useState(null);
  const [err,          setErr]          = useState('');
  const [dailyRecords, setDailyRecords] = useState({});

  const handleLogin = (id, pwd) => {
    // Always check the live employees state (picks up newly created accounts)
    const emp = employees.find(e =>
      e.loginId.toLowerCase() === id.toLowerCase() && e.password === pwd
    );
    if (emp) { setUser(emp); setErr(''); }
    else     { setErr('Invalid Login ID or Password. Please try again.'); }
  };

  const handleLogout = () => { setUser(null); setErr(''); };

  return (
    <div className="App">
      {!user && <LoginPage onLogin={handleLogin} error={err} />}

      {/* Administrator sees the full dashboard including Manage Employees tab */}
      {user && user.role === 'Administrator' && (
        <AdminDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
          setDailyRecords={setDailyRecords}
          employees={employees}
          setEmployees={setEmployees}
        />
      )}

      {/* Regular employees only see their own read-only attendance view */}
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
