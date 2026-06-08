import React, { useState, useEffect } from 'react';
import './App.css';

// ─── EMPLOYEE DATA ──────────────────────────────────────────────
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

// ─── CHARACTER PROFILE CONFIG ────────────────────────────────────
const CHARACTER_GROUPS = [
  {
    group : 'Work Performance',
    icon  : '📊',
    color : '#00BFFF',
    fields: [
      { key: 'workQuality',    label: 'Work Quality',     desc: 'Quality of output & attention to detail'     },
      { key: 'punctuality',    label: 'Punctuality',       desc: 'Timeliness and adherence to schedule'        },
      { key: 'taskCompletion', label: 'Task Completion',   desc: 'Ability to complete assigned tasks on time'  },
      { key: 'initiative',     label: 'Initiative',        desc: 'Proactiveness and self-motivation on the job'},
    ],
  },
  {
    group : 'Work Behaviour',
    icon  : '🔧',
    color : '#F5A623',
    fields: [
      { key: 'discipline',      label: 'Discipline & Conduct',    desc: 'Adherence to site rules and orderly conduct'   },
      { key: 'professionalism', label: 'Professionalism',          desc: 'Professional demeanor and strong work ethics'  },
      { key: 'teamwork',        label: 'Teamwork & Collaboration', desc: 'Working cooperatively with colleagues'         },
      { key: 'communication',   label: 'Communication Skills',     desc: 'Clear, respectful and effective communication' },
    ],
  },
  {
    group : 'Good Qualities',
    icon  : '✅',
    color : '#00E676',
    fields: [
      { key: 'positiveAttitude', label: 'Positive Attitude',   desc: 'Optimism, enthusiasm and constructive mindset'      },
      { key: 'reliability',      label: 'Reliability & Trust', desc: 'Dependability, honesty and trustworthiness'         },
      { key: 'adaptability',     label: 'Adaptability',        desc: 'Handles change and new challenges effectively'      },
      { key: 'workHabits',       label: 'Work Habits',         desc: 'Overall good habits and personal responsibility'    },
    ],
  },
  {
    group : 'Concerns & Bad Tendencies',
    icon  : '⚠',
    color : '#FF1744',
    fields: [
      { key: 'misconduct',   label: 'Misconduct Level',   desc: '1 = Critical issues observed  ·  5 = None'       },
      { key: 'attitudeRisk', label: 'Attitude Issues',    desc: '1 = Frequent incidents  ·  5 = None observed'    },
      { key: 'absenteeism',  label: 'Absenteeism Risk',   desc: '1 = High risk  ·  5 = Very reliable attendee'    },
      { key: 'conflictRisk', label: 'Conflict Tendency',  desc: '1 = High tendency  ·  5 = No issues at all'     },
    ],
  },
];

const EMPTY_CHARACTER = {
  workQuality: 0, punctuality: 0, taskCompletion: 0, initiative: 0,
  discipline: 0, professionalism: 0, teamwork: 0, communication: 0,
  positiveAttitude: 0, reliability: 0, adaptability: 0, workHabits: 0,
  misconduct: 0, attitudeRisk: 0, absenteeism: 0, conflictRisk: 0,
  notes: '',
  lastUpdated: null,
};

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

// ─── WORKTIME / OVERTIME HELPERS ─────────────────────────────────
function parseTimeMins(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function calcOvertime(timeIn, timeOut, standardHours) {
  const inM  = parseTimeMins(timeIn);
  const outM = parseTimeMins(timeOut);
  if (inM === null || outM === null || outM <= inM) return 0;
  const workedHrs = (outM - inM) / 60;
  return Math.max(0, parseFloat((workedHrs - (Number(standardHours) || 8)).toFixed(2)));
}

function getOTRate(employeeSettings, empId) {
  return Number(employeeSettings?.[empId]?.overtimeRate) || 0;
}

// ─── PAYMENT LEDGER HELPERS ─────────────────────────────────────
function getLastPaymentInMonth(empId, year, month, paymentLedger) {
  const events = (paymentLedger[empId] || []).filter(e => {
    const [y, m] = e.date.split('-').map(Number);
    return y === year && (m - 1) === month;
  });
  if (!events.length) return null;
  return [...events].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function getUnpaidEarned(empId, year, month, dailyRecords, employeeSettings, paymentLedger) {
  const lastPay    = getLastPaymentInMonth(empId, year, month, paymentLedger);
  const otRate     = getOTRate(employeeSettings, empId);
  const daysInMo   = new Date(year, month + 1, 0).getDate();
  const today      = new Date(); today.setHours(23,59,59,999);
  const startDay   = lastPay ? parseInt(lastPay.date.split('-')[2], 10) + 1 : 1;
  let sum = 0;
  for (let d = startDay; d <= daysInMo; d++) {
    if (new Date(year, month, d) > today) break;
    const dk  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = dailyRecords[dk]?.[empId];
    if (rec?.status === 'present') sum += (rec.payment || 0) + (rec.overtimeHours || 0) * otRate;
  }
  return sum;
}

function getMonthlyTotal(empId, year, month, dailyRecords, employeeSettings) {
  const otRate   = getOTRate(employeeSettings, empId);
  const daysInMo = new Date(year, month + 1, 0).getDate();
  const today    = new Date(); today.setHours(23,59,59,999);
  let sum = 0;
  for (let d = 1; d <= daysInMo; d++) {
    if (new Date(year, month, d) > today) break;
    const dk  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = dailyRecords[dk]?.[empId];
    if (rec?.status === 'present') sum += (rec.payment || 0) + (rec.overtimeHours || 0) * otRate;
  }
  return sum;
}

// ─── TIME PICKER ──────────────────────────────────────────────────
function TimePicker({ value, onChange, disabled }) {
  const parts = value ? value.split(':') : ['08', '00'];
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const setH = nh => onChange(`${String(nh).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
  const setM = nm => onChange(`${String(h).padStart(2,'0')}:${String(nm).padStart(2,'0')}`);
  return (
    <span className="time-picker-wrap">
      <select className="wt-select" value={h} disabled={disabled}
        onChange={e => setH(Number(e.target.value))}>
        {Array.from({length:24},(_,i) =>
          <option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}
      </select>
      <span className="time-colon">:</span>
      <select className="wt-select" value={m} disabled={disabled}
        onChange={e => setM(Number(e.target.value))}>
        {[0,15,30,45].map(mm =>
          <option key={mm} value={mm}>{String(mm).padStart(2,'0')}</option>)}
      </select>
    </span>
  );
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
//  STAR RATING  —  interactive 5-star widget (admin-only)
// ═══════════════════════════════════════════════════════════════
function StarRating({ value, onChange, color = 'var(--amber)' }) {
  const [hovered, setHovered] = useState(0);
  const filled = hovered || value;

  const labels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  return (
    <div className="star-rating" title={value > 0 ? `${value}/5 — ${labels[value]}` : 'Not rated'}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= filled ? 'star-lit' : 'star-dim'}`}
          style={n <= filled ? { color, filter: `drop-shadow(0 0 4px ${color}88)` } : {}}
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
      <span className="star-label">
        {hovered > 0 ? labels[hovered] : (value > 0 ? `${value}/5` : '—')}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CHARACTER PROFILE SECTION  —  Admin-only, never shown to employees
// ═══════════════════════════════════════════════════════════════
// ─── SALARY HELPERS & DEFAULTS ─────────────────────────────────
const DEFAULT_ALLOWANCES = [
  { id: 'ta',    label: 'Travelling Allowance',    amount: 0 },
  { id: 'da',    label: 'Dearness Allowance',       amount: 0 },
  { id: 'hra',   label: 'House Rent Allowance',     amount: 0 },
  { id: 'med',   label: 'Medical Allowance',        amount: 0 },
  { id: 'ot',    label: 'Overtime Pay',             amount: 0 },
  { id: 'bonus', label: 'Performance Bonus',        amount: 0 },
];
const DEFAULT_DEDUCTIONS = [
  { id: 'pf',   label: 'Provident Fund',            amount: 0 },
  { id: 'esi',  label: 'Employee State Insurance',  amount: 0 },
  { id: 'tds',  label: 'Tax Deduction',             amount: 0 },
  { id: 'late', label: 'Late / Absence Deduction',  amount: 0 },
];
function initSalaryStructure() {
  return {
    dailyRate:  500,
    allowances: DEFAULT_ALLOWANCES.map(a => ({ ...a })),
    deductions: DEFAULT_DEDUCTIONS.map(d => ({ ...d })),
    increment:  { type: 'fixed', value: 0 },
  };
}
function getEmpSalary(structs, empId) {
  return (structs && structs[empId]) ? structs[empId] : initSalaryStructure();
}
function computeMonthSalary(structure, dailyRecords, empId, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let presentDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (dailyRecords[key]?.[empId]?.status === 'present') presentDays++;
  }
  const dailyRate       = Number(structure.dailyRate) || 0;
  const basicSalary     = dailyRate * presentDays;
  const totalAllowances = structure.allowances.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const totalDeductions = structure.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const incrementAmt    = structure.increment.type === 'percent'
    ? Math.round(basicSalary * (Number(structure.increment.value) || 0) / 100)
    : (Number(structure.increment.value) || 0);
  const netSalary = basicSalary + totalAllowances + incrementAmt - totalDeductions;
  return { presentDays, basicSalary, totalAllowances, totalDeductions, incrementAmt, netSalary };
}

function CharacterProfileSection({ employee, characterProfiles, setCharacterProfiles }) {
  const getSaved = id => ({ ...EMPTY_CHARACTER, ...(characterProfiles[id] || {}) });

  const [draft, setDraft] = useState(() => getSaved(employee.id));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  // Reset whenever we switch to a different employee
  useEffect(() => {
    setDraft(getSaved(employee.id));
    setDirty(false);
    setSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id]);

  const setRating = (key, val) => {
    setDirty(true);
    setSaved(false);
    setDraft(prev => ({ ...prev, [key]: val }));
  };

  const setNotes = val => {
    setDirty(true);
    setSaved(false);
    setDraft(prev => ({ ...prev, notes: val }));
  };

  const handleSave = () => {
    const ts = new Date().toISOString();
    setCharacterProfiles(prev => ({
      ...prev,
      [employee.id]: { ...draft, lastUpdated: ts },
    }));
    setDraft(prev => ({ ...prev, lastUpdated: ts }));
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  };

  // ── Computed scores ──
  const groupAvg = fields => {
    const rated = fields.filter(f => draft[f.key] > 0);
    if (!rated.length) return null;
    return (rated.reduce((s, f) => s + draft[f.key], 0) / rated.length).toFixed(1);
  };

  const allKeys = CHARACTER_GROUPS.flatMap(g => g.fields.map(f => f.key));
  const ratedAll = allKeys.filter(k => draft[k] > 0);
  const overallScore = ratedAll.length > 0
    ? (ratedAll.reduce((s, k) => s + draft[k], 0) / ratedAll.length).toFixed(1)
    : null;

  const lastUpdatedStr = draft.lastUpdated
    ? new Date(draft.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  // Ratingbelt colour based on score
  const scoreColor = s => {
    if (!s) return 'var(--text-sub)';
    const n = parseFloat(s);
    if (n >= 4.5) return '#00E676';
    if (n >= 3.5) return '#F5A623';
    if (n >= 2.5) return '#29B6F6';
    return '#FF1744';
  };

  return (
    <div className="char-section">

      {/* ── Admin-only banner ── */}
      <div className="char-banner">
        <div className="char-banner-left">
          <span className="char-lock-icon">🔒</span>
          <div>
            <div className="char-banner-title">Character Profile</div>
            <div className="char-banner-sub">ADMIN CONFIDENTIAL · NOT VISIBLE TO EMPLOYEE</div>
          </div>
        </div>

        <div className="char-banner-right">
          {overallScore && (
            <div className="char-overall" style={{ '--score-color': scoreColor(overallScore) }}>
              <span className="char-overall-num">{overallScore}</span>
              <span className="char-overall-star">★</span>
              <span className="char-overall-lbl">OVERALL</span>
            </div>
          )}
          {lastUpdatedStr && (
            <div className="char-timestamp">Updated: {lastUpdatedStr}</div>
          )}
        </div>
      </div>

      {/* ── Rating Groups ── */}
      <div className="char-groups">
        {CHARACTER_GROUPS.map(grp => {
          const avg = groupAvg(grp.fields);
          return (
            <div
              key={grp.group}
              className="char-group"
              style={{ '--grp-color': grp.color }}
            >
              <div className="char-group-hdr">
                <span className="char-group-icon">{grp.icon}</span>
                <span className="char-group-name">{grp.group}</span>
                {avg && (
                  <span className="char-group-avg" style={{ color: grp.color }}>
                    {avg} ★
                  </span>
                )}
              </div>

              <div className="char-fields">
                {grp.fields.map(field => (
                  <div key={field.key} className="char-field">
                    <div className="char-field-info">
                      <span className="char-field-label">{field.label}</span>
                      <span className="char-field-desc">{field.desc}</span>
                    </div>
                    <StarRating
                      value={draft[field.key]}
                      onChange={val => setRating(field.key, val)}
                      color={grp.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Notes ── */}
      <div className="char-notes-wrap">
        <label className="char-notes-lbl">📝 Admin Notes &amp; Observations</label>
        <textarea
          className="char-notes-inp"
          placeholder="Add private notes about this employee — character observations, commendations, incidents, improvement areas, or any relevant remarks visible only to the admin..."
          value={draft.notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      {/* ── Save Row ── */}
      <div className="char-actions">
        {saved && (
          <span className="char-saved-msg">✓ Character profile saved successfully</span>
        )}
        {dirty && !saved && (
          <span className="char-unsaved-msg">● Unsaved changes</span>
        )}
        <button
          className={`char-save-btn ${dirty ? 'char-save-pulse' : ''}`}
          onClick={handleSave}
          disabled={!dirty && !saved}
        >
          {saved ? '✓ Saved' : '💾 Save Character Profile'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE MANAGER  –  Admin-only CRUD panel
// ═══════════════════════════════════════════════════════════════
function EmployeeManager({ employees, setEmployees }) {
  const BLANK = { name: '', email: '', password: '', loginId: '', department: '', role: '' };

  const [view,         setView]        = useState('list');
  const [editTarget,   setEditTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,         setForm]        = useState(BLANK);
  const [formErr,      setFormErr]     = useState('');

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

  const doDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const staff = employees.filter(e => e.role !== 'Administrator');

  // ── Form View ──────────────────────────────────────────────────
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

  // ── List View ──────────────────────────────────────────────────
  return (
    <div className="emp-mgr">

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
//  SALARY DASHBOARD  –  Admin salary structure editor
// ═══════════════════════════════════════════════════════════════
function SalaryDashboard({ employees, salaryStructures, setSalaryStructures, dailyRecords }) {
  const staff   = employees.filter(e => e.role !== 'Administrator');
  const now     = new Date();
  const [selId, setSelId] = useState(staff[0]?.id ?? null);
  const [selMo, setSelMo] = useState(now.getMonth());
  const selYear = now.getFullYear();

  const selEmp = staff.find(e => e.id === selId);
  const struct = selId ? getEmpSalary(salaryStructures, selId) : null;
  const calc   = (selId && struct)
    ? computeMonthSalary(struct, dailyRecords, selId, selYear, selMo)
    : null;

  const upd = fn =>
    setSalaryStructures(prev => ({ ...prev, [selId]: fn(getEmpSalary(prev, selId)) }));

  const setRate        = v  => upd(s => ({ ...s, dailyRate: Math.max(0, parseInt(v) || 0) }));
  const setAllowLabel  = (id,v) => upd(s => ({ ...s, allowances: s.allowances.map(a => a.id===id?{...a,label:v}:a) }));
  const setAllowAmt    = (id,v) => upd(s => ({ ...s, allowances: s.allowances.map(a => a.id===id?{...a,amount:Math.max(0,Number(v)||0)}:a) }));
  const addAllow       = ()     => upd(s => ({ ...s, allowances: [...s.allowances,{id:`a${Date.now()}`,label:'Custom Allowance',amount:0}] }));
  const delAllow       = id     => upd(s => ({ ...s, allowances: s.allowances.filter(a => a.id!==id) }));
  const setDedLabel    = (id,v) => upd(s => ({ ...s, deductions: s.deductions.map(d => d.id===id?{...d,label:v}:d) }));
  const setDedAmt      = (id,v) => upd(s => ({ ...s, deductions: s.deductions.map(d => d.id===id?{...d,amount:Math.max(0,Number(v)||0)}:d) }));
  const addDed         = ()     => upd(s => ({ ...s, deductions: [...s.deductions,{id:`d${Date.now()}`,label:'Custom Deduction',amount:0}] }));
  const delDed         = id     => upd(s => ({ ...s, deductions: s.deductions.filter(d => d.id!==id) }));
  const setIncrType    = t      => upd(s => ({ ...s, increment: {...s.increment, type:t} }));
  const setIncrVal     = v      => upd(s => ({ ...s, increment: {...s.increment, value:Math.max(0,Number(v)||0)} }));

  if (!staff.length) return (
    <div className="salary-empty">
      <span className="salary-empty-icon">💰</span>
      <p>No employees registered. Add employees first to configure salaries.</p>
    </div>
  );

  return (
    <div className="salary-panel">

      {/* ── Left: Employee Selector ── */}
      <div className="salary-emp-list">
        <div className="salary-emp-list-hdr">Select Employee</div>
        {staff.map(emp => (
          <button
            key={emp.id}
            className={`salary-emp-item ${selId === emp.id ? 'salary-emp-item-on' : ''}`}
            onClick={() => setSelId(emp.id)}
          >
            <span className="salary-emp-avatar">{emp.name[0]}</span>
            <div className="salary-emp-meta">
              <span className="salary-emp-name">{emp.name}</span>
              <span className="salary-emp-role">{emp.role}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Right: Editor ── */}
      {selEmp && struct && calc && (
        <div className="salary-editor">

          <div className="salary-editor-hdr">
            <div>
              <h2 className="salary-editor-name">{selEmp.name}</h2>
              <span className="salary-editor-sub">{selEmp.role} · {selEmp.loginId}</span>
            </div>
            <div className="salary-month-sel">
              <span className="month-bar-lbl">Preview Month:</span>
              <select className="day-select" value={selMo} onChange={e => setSelMo(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m} {selYear}</option>)}
              </select>
            </div>
          </div>

          {/* ─── BASIC SALARY ─── */}
          <div className="salary-section">
            <div className="salary-section-hdr">
              <div>
                <span className="salary-section-title">💼 Basic Salary</span>
                <span className="salary-section-sub">Daily Rate × Days Present in {MONTH_NAMES[selMo]}</span>
              </div>
            </div>
            <div className="salary-basic-row">
              <div className="field-group salary-basic-field">
                <label className="field-lbl">Daily Rate (₹)</label>
                <div className="pay-cell">
                  <span className="rupee">₹</span>
                  <input className="pay-inp" type="number" min="0"
                    value={struct.dailyRate} onChange={e => setRate(e.target.value)} />
                </div>
              </div>
              <div className="salary-calc-preview">
                <span className="salary-calc-eq">
                  ₹{(Number(struct.dailyRate)||0).toLocaleString('en-IN')} × {calc.presentDays} days
                </span>
                <span className="salary-calc-result">= ₹{calc.basicSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* ─── INCREMENT ─── */}
          <div className="salary-section">
            <div className="salary-section-hdr">
              <div>
                <span className="salary-section-title">📈 Increment</span>
                <span className="salary-section-sub">Added on top of basic salary</span>
              </div>
            </div>
            <div className="salary-incr-row">
              <div className="salary-incr-type">
                <button className={`sal-type-btn ${struct.increment.type==='fixed'?'sal-type-btn-on':''}`}
                  onClick={() => setIncrType('fixed')}>₹ Fixed Amount</button>
                <button className={`sal-type-btn ${struct.increment.type==='percent'?'sal-type-btn-on':''}`}
                  onClick={() => setIncrType('percent')}>% Percentage</button>
              </div>
              <div className="pay-cell">
                <span className="rupee">{struct.increment.type==='percent'?'%':'₹'}</span>
                <input className="pay-inp" type="number" min="0"
                  value={struct.increment.value} onChange={e => setIncrVal(e.target.value)} />
              </div>
              <span className="salary-calc-result">= ₹{calc.incrementAmt.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* ─── ALLOWANCES ─── */}
          <div className="salary-section">
            <div className="salary-section-hdr">
              <div>
                <span className="salary-section-title">➕ Allowances</span>
                <span className="salary-section-sub">Added to basic salary</span>
              </div>
              <button className="sal-add-btn" onClick={addAllow}>＋ Add Allowance</button>
            </div>
            <div className="tbl-wrap" style={{padding:0,flex:'none'}}>
              <table className="att-tbl sal-tbl">
                <thead><tr><th>Allowance Name</th><th>Monthly Amount (₹)</th><th style={{width:52}}></th></tr></thead>
                <tbody>
                  {struct.allowances.length===0
                    ? <tr><td colSpan={3} className="emp-tbl-empty">No allowances added yet.</td></tr>
                    : struct.allowances.map(a => (
                      <tr key={a.id} className="trow">
                        <td><input className="field-inp sal-name-inp" type="text" value={a.label}
                          onChange={e => setAllowLabel(a.id,e.target.value)} /></td>
                        <td><div className="pay-cell"><span className="rupee">₹</span>
                          <input className="pay-inp" type="number" min="0" value={a.amount}
                            onChange={e => setAllowAmt(a.id,e.target.value)} /></div></td>
                        <td><button className="sal-del-btn" onClick={() => delAllow(a.id)} title="Remove">✕</button></td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="tfoot-row">
                    <td className="tfoot-lbl" style={{textAlign:'right',paddingRight:'2rem'}}>TOTAL ALLOWANCES</td>
                    <td className="tfoot-amt">₹{calc.totalAllowances.toLocaleString('en-IN')}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ─── DEDUCTIONS ─── */}
          <div className="salary-section">
            <div className="salary-section-hdr">
              <div>
                <span className="salary-section-title">➖ Deductions</span>
                <span className="salary-section-sub">Subtracted from total</span>
              </div>
              <button className="sal-add-btn" onClick={addDed}>＋ Add Deduction</button>
            </div>
            <div className="tbl-wrap" style={{padding:0,flex:'none'}}>
              <table className="att-tbl sal-tbl">
                <thead><tr><th>Deduction Name</th><th>Monthly Amount (₹)</th><th style={{width:52}}></th></tr></thead>
                <tbody>
                  {struct.deductions.length===0
                    ? <tr><td colSpan={3} className="emp-tbl-empty">No deductions added yet.</td></tr>
                    : struct.deductions.map(d => (
                      <tr key={d.id} className="trow">
                        <td><input className="field-inp sal-name-inp" type="text" value={d.label}
                          onChange={e => setDedLabel(d.id,e.target.value)} /></td>
                        <td><div className="pay-cell"><span className="rupee">₹</span>
                          <input className="pay-inp" type="number" min="0" value={d.amount}
                            onChange={e => setDedAmt(d.id,e.target.value)} /></div></td>
                        <td><button className="sal-del-btn" onClick={() => delDed(d.id)} title="Remove">✕</button></td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="tfoot-row">
                    <td className="tfoot-lbl" style={{textAlign:'right',paddingRight:'2rem'}}>TOTAL DEDUCTIONS</td>
                    <td className="tfoot-amt">₹{calc.totalDeductions.toLocaleString('en-IN')}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ─── NET SALARY CARD ─── */}
          <div className="sal-net-card">
            <div className="sal-net-title">⚡ NET SALARY — {MONTH_NAMES[selMo]} {selYear}</div>
            <div className="sal-net-formula">
              <div className="sal-net-row">
                <span className="sal-net-lbl">Basic Salary ({calc.presentDays} days × ₹{(struct.dailyRate||0).toLocaleString('en-IN')})</span>
                <span className="sal-net-val">₹{calc.basicSalary.toLocaleString('en-IN')}</span>
              </div>
              {calc.incrementAmt > 0 && (
                <div className="sal-net-row">
                  <span className="sal-net-lbl">+ Increment {struct.increment.type==='percent'?`(${struct.increment.value}% of basic)`:'(Fixed)'}</span>
                  <span className="sal-net-val sal-plus">+₹{calc.incrementAmt.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="sal-net-row">
                <span className="sal-net-lbl">+ Total Allowances ({struct.allowances.length} items)</span>
                <span className="sal-net-val sal-plus">+₹{calc.totalAllowances.toLocaleString('en-IN')}</span>
              </div>
              <div className="sal-net-row">
                <span className="sal-net-lbl">− Total Deductions ({struct.deductions.length} items)</span>
                <span className="sal-net-val sal-minus">−₹{calc.totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="sal-net-divider" />
              <div className="sal-net-row sal-net-total">
                <span className="sal-net-total-lbl">⚡ NET TOTAL SALARY</span>
                <span className="sal-net-total-amt">₹{calc.netSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN EMPLOYEE PROFILE
//  Monthly overview + Character Profile section (admin-only)
// ═══════════════════════════════════════════════════════════════
function AdminEmployeeProfile({
  employee, month, year, dailyRecords, onBack,
  characterProfiles, setCharacterProfiles,
  employeeSettings, setEmployeeSettings,
  salaryStructures,
  paymentLedger, setPaymentLedger,
}) {
  const [profileTab, setProfileTab] = useState('admin'); // 'admin' | 'employee'
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let presentDays      = 0;
  let absentDays       = 0;
  let totalWorkingDays = 0;
  let totalSalary      = 0;
  let cumulativeOT     = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    totalWorkingDays++;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const record  = dailyRecords[dateKey]?.[employee.id];

    if (record?.status === 'present') presentDays++;
    if (record?.status === 'absent')  absentDays++;
    if (record?.payment) totalSalary += record.payment;
    if (record?.overtimeHours) cumulativeOT += record.overtimeHours;
  }

  const otRate = getOTRate(employeeSettings, employee.id);
  const setOTRate = val => setEmployeeSettings(prev => ({
    ...prev,
    [employee.id]: { ...(prev[employee.id] || {}), overtimeRate: Math.max(0, Number(val) || 0) },
  }));

  return (
    <>
      {/* ── Control Bar with profile-tab switcher ── */}
      <div className="month-bar">
        <button className="mtab mtab-on" onClick={onBack}>
          ← Back to Daily List
        </button>
        {/* Admin / Employee view toggle */}
        <div className="admin-profile-tabs">
          <button
            className={`admin-profile-tab ${profileTab === 'admin' ? 'admin-profile-tab-on' : ''}`}
            onClick={() => setProfileTab('admin')}
          >📋 Admin Profile</button>
          <button
            className={`admin-profile-tab ${profileTab === 'employee' ? 'admin-profile-tab-on' : ''}`}
            onClick={() => setProfileTab('employee')}
          >👤 Employee View</button>
        </div>
        <span className="month-display">{MONTH_NAMES[month]} {year} — {employee.name}</span>
      </div>

      {/* ── EMPLOYEE VIEW TAB ── */}
      {profileTab === 'employee' && (
        <EmployeeProfileEmpView
          employee={employee}
          month={month} year={year}
          dailyRecords={dailyRecords}
          salaryStructures={salaryStructures}
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger}
          setPaymentLedger={setPaymentLedger}
        />
      )}

      {/* ── ADMIN VIEW TAB ── */}
      {profileTab === 'admin' && (<>

      {/* ── Monthly Stats ── */}
      <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <StatCard label="Total Salary Received" value={`₹${totalSalary.toLocaleString('en-IN')}`}  accentColor="#00BFFF" />
        <StatCard label="Days Present"           value={presentDays}                                 accentColor="#00C853" />
        <StatCard label="Days Absent"            value={absentDays}                                  accentColor="#FF1744" />
        <StatCard label="Total Working Days"     value={totalWorkingDays}                             accentColor="#F5A623" />
        <StatCard label="Cumulative OT"          value={`${cumulativeOT.toFixed(1)} hrs`}            accentColor="#F5A623" />
      </div>

      {/* ── Employee Details Card ── */}
      <div className="profile-card">
        <div className="profile-avatar">{employee.name[0]}</div>
        <div className="profile-info">
          <h2 className="profile-name">{employee.name}</h2>
          <div className="profile-role">{employee.role}</div>
          <div className="profile-id">ID: {employee.loginId}</div>
        </div>
        {/* ── OT Rate Setter ── */}
        <div className="ot-rate-field">
          <span className="field-lbl">OT Rate</span>
          <div className="pay-cell">
            <span className="rupee">₹</span>
            <input
              type="number"
              className="pay-inp ot-rate-inp"
              min="0"
              max="9999"
              placeholder="0"
              value={otRate || ''}
              onChange={e => setOTRate(e.target.value)}
            />
            <span className="ot-rate-unit">/ hr</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CHARACTER PROFILE  —  Admin-only, never shown to employee
          ══════════════════════════════════════════════════════════ */}
      <CharacterProfileSection
        employee={employee}
        characterProfiles={characterProfiles}
        setCharacterProfiles={setCharacterProfiles}
      />
      </>)}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD  –  Daily roster + Employee Management tabs
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({
  employee, onLogout,
  dailyRecords, setDailyRecords,
  employees, setEmployees,
  characterProfiles, setCharacterProfiles,
  salaryStructures, setSalaryStructures,
  employeeSettings, setEmployeeSettings,
  paymentLedger, setPaymentLedger,
}) {
  const now  = new Date();
  const [year,          setYear]         = useState(now.getFullYear());
  const [month,         setMonth]        = useState(now.getMonth());
  const [day,           setDay]          = useState(now.getDate());
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [activeTab,     setActiveTab]    = useState('attendance');

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, daysInMonth, day]);

  const dateKey        = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const staff          = employees.filter(e => e.role !== 'Administrator');
  const currentDayData = dailyRecords[dateKey] || {};

  // ── Inherited worksite ──────────────────────────────────────────
  const getInheritedWorksite = empId => {
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
  const getInheritedSalary = empId => {
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
        [empId]: { ...empData, status: next, payment: newPayment, paymentSet: false },
      },
    }));
  };

  const setPayment = (empId, val) => {
    const empData = currentDayData[empId] || { status: null, payment: 0 };
    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [empId]: { ...empData, payment: Math.max(0, parseInt(val) || 0), paymentSet: true },
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

  const setStandardHours = (empId, val) => {
    setDailyRecords(prev => {
      const empData = (prev[dateKey] || {})[empId] || {};
      const ot = calcOvertime(empData.timeIn, empData.timeOut, val);
      return { ...prev, [dateKey]: { ...prev[dateKey], [empId]: { ...empData, standardHours: Number(val), overtimeHours: ot } } };
    });
  };

  const setTimeIn = (empId, val) => {
    setDailyRecords(prev => {
      const empData = (prev[dateKey] || {})[empId] || {};
      const ot = calcOvertime(val, empData.timeOut, empData.standardHours || 8);
      return { ...prev, [dateKey]: { ...prev[dateKey], [empId]: { ...empData, timeIn: val, overtimeHours: ot } } };
    });
  };

  const setTimeOut = (empId, val) => {
    setDailyRecords(prev => {
      const empData = (prev[dateKey] || {})[empId] || {};
      const ot = calcOvertime(empData.timeIn, val, empData.standardHours || 8);
      return { ...prev, [dateKey]: { ...prev[dateKey], [empId]: { ...empData, timeOut: val, overtimeHours: ot } } };
    });
  };

  // ── Daily totals ──
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

      {/* ── ADMIN NAVIGATION TABS ── */}
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
        <button
          className={`admin-nav-tab ${activeTab === 'salary' ? 'admin-nav-tab-on' : ''}`}
          onClick={() => { setActiveTab('salary'); setSelectedEmpId(null); }}
        >
          💰 Salary Dashboard
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TAB: DAILY ATTENDANCE
          ══════════════════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        selectedEmployee ? (
          <AdminEmployeeProfile
            employee={selectedEmployee}
            month={month}
            year={year}
            dailyRecords={dailyRecords}
            onBack={() => setSelectedEmpId(null)}
            characterProfiles={characterProfiles}
            setCharacterProfiles={setCharacterProfiles}
            employeeSettings={employeeSettings}
            setEmployeeSettings={setEmployeeSettings}
            salaryStructures={salaryStructures}
            paymentLedger={paymentLedger}
            setPaymentLedger={setPaymentLedger}
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
                    <th>Work Time</th>
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
                    const isInherited        = !record.worksiteSet && worksiteVal !== '';
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
                          {status === 'present' ? (() => {
                            const stdH = record.standardHours || 8;
                            const ot   = record.overtimeHours || 0;
                            return (
                              <div className="wt-cell">
                                <div className="wt-row">
                                  <span className="wt-lbl">Std</span>
                                  <select className="wt-select"
                                    value={stdH}
                                    onChange={e => setStandardHours(emp.id, Number(e.target.value))}>
                                    {Array.from({length:24},(_,i) =>
                                      <option key={i+1} value={i+1}>{i+1}h</option>)}
                                  </select>
                                  <span className="wt-lbl">In</span>
                                  <TimePicker
                                    value={record.timeIn || ''}
                                    onChange={v => setTimeIn(emp.id, v)}
                                    disabled={false}
                                  />
                                  <span className="wt-lbl">Out</span>
                                  <TimePicker
                                    value={record.timeOut || ''}
                                    onChange={v => setTimeOut(emp.id, v)}
                                    disabled={false}
                                  />
                                </div>
                                {ot > 0 && (
                                  <span className="ot-badge">⚡ OT: {ot}h</span>
                                )}
                              </div>
                            );
                          })() : (
                            <span className="td-dash">—</span>
                          )}
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
                    <td colSpan={5} className="tfoot-lbl" style={{ textAlign: 'right', paddingRight: '2rem' }}>
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
          TAB: MANAGE EMPLOYEES
          ══════════════════════════════════════════════════════════ */}
      {activeTab === 'employees' && (
        <EmployeeManager employees={employees} setEmployees={setEmployees} />
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: SALARY DASHBOARD
          ════════════════════════════════════════════════════════ */}
      {activeTab === 'salary' && (
        <SalaryDashboard
          employees={employees}
          salaryStructures={salaryStructures}
          setSalaryStructures={setSalaryStructures}
          dailyRecords={dailyRecords}
        />
      )}

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE SALARY VIEW  –  Read-only monthly salary breakdown
// ═══════════════════════════════════════════════════════════════
function EmployeeSalaryView({ employee, salaryStructures, dailyRecords, month, year }) {
  const struct = getEmpSalary(salaryStructures, employee.id);
  const calc   = computeMonthSalary(struct, dailyRecords, employee.id, year, month);

  return (
    <div className="emp-sal-view">
      <div className="emp-sal-card">

        <div className="emp-sal-card-hdr">
          <div>
            <div className="emp-sal-title">Monthly Salary Statement</div>
            <div className="emp-sal-period">{MONTH_NAMES[month]} {year}</div>
          </div>
          <div className="emp-sal-present-box">
            <span className="emp-sal-present-num">{calc.presentDays}</span>
            <span className="emp-sal-present-lbl">days present</span>
          </div>
        </div>

        {/* Basic */}
        <div className="emp-sal-section">
          <div className="emp-sal-section-lbl">💼 Basic Salary</div>
          <div className="emp-sal-row">
            <span className="emp-sal-item">Daily Rate × Present Days</span>
            <span className="emp-sal-sub">₹{(struct.dailyRate||0).toLocaleString('en-IN')} × {calc.presentDays}</span>
            <span className="emp-sal-amt">₹{calc.basicSalary.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Increment */}
        {calc.incrementAmt > 0 && (
          <div className="emp-sal-section">
            <div className="emp-sal-section-lbl">📈 Increment</div>
            <div className="emp-sal-row">
              <span className="emp-sal-item">
                {struct.increment.type === 'percent'
                  ? `${struct.increment.value}% of Basic Salary`
                  : 'Fixed Increment'}
              </span>
              <span className="emp-sal-sub"></span>
              <span className="emp-sal-amt emp-sal-green">+₹{calc.incrementAmt.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Allowances */}
        <div className="emp-sal-section">
          <div className="emp-sal-section-lbl">➕ Allowances</div>
          {struct.allowances.length === 0
            ? <div className="emp-sal-empty-line">No allowances configured.</div>
            : struct.allowances.map(a => (
              <div key={a.id} className="emp-sal-row">
                <span className="emp-sal-item">{a.label}</span>
                <span className="emp-sal-sub"></span>
                <span className={`emp-sal-amt ${Number(a.amount)>0?'emp-sal-green':'emp-sal-zero'}`}>
                  {Number(a.amount)>0?`+₹${Number(a.amount).toLocaleString('en-IN')}`:'—'}
                </span>
              </div>
            ))}
          <div className="emp-sal-subtotal">
            <span>Total Allowances</span>
            <span className="emp-sal-green">₹{calc.totalAllowances.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="emp-sal-section">
          <div className="emp-sal-section-lbl">➖ Deductions</div>
          {struct.deductions.length === 0
            ? <div className="emp-sal-empty-line">No deductions configured.</div>
            : struct.deductions.map(d => (
              <div key={d.id} className="emp-sal-row">
                <span className="emp-sal-item">{d.label}</span>
                <span className="emp-sal-sub"></span>
                <span className={`emp-sal-amt ${Number(d.amount)>0?'emp-sal-red':'emp-sal-zero'}`}>
                  {Number(d.amount)>0?`−₹${Number(d.amount).toLocaleString('en-IN')}`:'—'}
                </span>
              </div>
            ))}
          <div className="emp-sal-subtotal">
            <span>Total Deductions</span>
            <span className="emp-sal-red">₹{calc.totalDeductions.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Net */}
        <div className="emp-sal-net">
          <div className="emp-sal-net-divider" />
          <div className="emp-sal-net-row">
            <span className="emp-sal-net-lbl">⚡ NET SALARY</span>
            <span className="emp-sal-net-amt">₹{calc.netSalary.toLocaleString('en-IN')}</span>
          </div>
          <div className="emp-sal-net-hint">
            ₹{calc.basicSalary.toLocaleString('en-IN')} basic
            {calc.incrementAmt>0?` + ₹${calc.incrementAmt.toLocaleString('en-IN')} incr.`:''}
            {` + ₹${calc.totalAllowances.toLocaleString('en-IN')} allow.`}
            {` − ₹${calc.totalDeductions.toLocaleString('en-IN')} ded.`}
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAID STATUS BOX  —  admin can click to mark paid; employee views only
// ═══════════════════════════════════════════════════════════════
function PaidStatusBox({ empId, year, month, dailyRecords, employeeSettings, paymentLedger, setPaymentLedger, isAdmin }) {
  const now      = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const lastPay      = getLastPaymentInMonth(empId, year, month, paymentLedger);
  const isPaidToday  = lastPay?.date === todayStr;
  const unpaidAmt    = getUnpaidEarned(empId, year, month, dailyRecords, employeeSettings, paymentLedger);
  const monthlyTotal = getMonthlyTotal(empId, year, month, dailyRecords, employeeSettings);
  const canPay       = isAdmin && isCurrentMonth && !isPaidToday && unpaidAmt > 0;

  const handlePay = () => {
    if (!canPay) return;
    setPaymentLedger(prev => ({
      ...prev,
      [empId]: [...(prev[empId] || []), { date: todayStr, amount: unpaidAmt }],
    }));
  };

  const displayAmt = isPaidToday ? lastPay.amount : unpaidAmt;

  return (
    <div
      className={`paid-status-box${isPaidToday ? ' paid-status-paid' : ''}${canPay ? ' paid-status-can-pay' : ''}`}
      onClick={canPay ? handlePay : undefined}
      title={canPay ? `Click to mark ₹${unpaidAmt.toLocaleString('en-IN')} as paid` : ''}
    >
      <div className="paid-status-top">
        <span className="paid-status-icon">{isPaidToday ? '✓' : '₹'}</span>
        <div className="paid-status-vals">
          <span className="paid-status-amt">₹{displayAmt.toLocaleString('en-IN')}</span>
          <span className="paid-status-lbl">
            {isPaidToday
              ? 'PAID TILL NOW'
              : canPay
                ? '⚡ TAP TO PAY'
                : 'UNPAID EARNED'}
          </span>
        </div>
      </div>
      <div className="paid-status-footer">
        <span className="paid-status-footer-lbl">Month Total</span>
        <span className="paid-status-footer-amt">₹{monthlyTotal.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE PROFILE EMP-VIEW  —  shown inside AdminEmployeeProfile
//  Mirrors what the employee sees, PAID box is admin-interactive
// ═══════════════════════════════════════════════════════════════
function EmployeeProfileEmpView({ employee, month, year, dailyRecords, salaryStructures, employeeSettings, paymentLedger, setPaymentLedger }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const otRate      = getOTRate(employeeSettings, employee.id);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rows = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum  = i + 1;
    const d       = new Date(year, month, dayNum);
    const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
    const record  = dailyRecords[dateKey]?.[employee.id];
    const payment = record?.status === 'present' ? (record?.payment || 0) : 0;
    const otHours = record?.status === 'present' ? (record?.overtimeHours || 0) : 0;
    const otPay   = parseFloat((otHours * otRate).toFixed(2));
    return {
      date: dayNum, dayName: DAY_NAMES[d.getDay()],
      status: record?.status ?? null, payment,
      worksite: record?.worksite || '', otHours, otPay,
      totalDaily: payment + otPay,
    };
  });

  let running = 0;
  const enriched = rows.map(r => { running += r.totalDaily; return { ...r, cumulative: running }; });

  const presentCount = rows.filter(r => r.status === 'present').length;
  const absentCount  = rows.filter(r => r.status === 'absent').length;
  const totalPayment = rows.reduce((s, r) => s + r.payment, 0);
  const totalOTPay   = rows.reduce((s, r) => s + r.otPay, 0);
  const totalAllPay  = totalPayment + totalOTPay;

  return (
    <div className="emp-view-preview">
      {/* Stats strip — identical to employee view */}
      <div className="stats-strip emp-preview-strip">
        <StatCard label="Days Present"  value={presentCount}                                          accentColor="#00C853" />
        <StatCard label="Days Absent"   value={absentCount}                                           accentColor="#FF1744" />
        <StatCard label="Working Days"  value={daysInMonth}                                           accentColor="#F5A623" />
        <StatCard label="OT Rate"       value={otRate ? `₹${otRate}/hr` : '—'}                       accentColor="#F5A623" />
        <StatCard label="Total Earned"  value={`₹${totalAllPay.toLocaleString('en-IN')}`}            accentColor="#00BFFF" />
        <PaidStatusBox
          empId={employee.id}
          year={year} month={month}
          dailyRecords={dailyRecords}
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger}
          setPaymentLedger={setPaymentLedger}
          isAdmin={true}
        />
      </div>

      {/* Tab nav */}
      <div className="emp-tab-nav">
        <button className={`emp-tab-btn ${activeTab === 'attendance' ? 'emp-tab-btn-on' : ''}`}
          onClick={() => setActiveTab('attendance')}>📋 My Attendance</button>
        <button className={`emp-tab-btn ${activeTab === 'salary' ? 'emp-tab-btn-on' : ''}`}
          onClick={() => setActiveTab('salary')}>💰 My Salary</button>
      </div>

      {/* Salary */}
      {activeTab === 'salary' && (
        <EmployeeSalaryView
          employee={employee}
          salaryStructures={salaryStructures}
          dailyRecords={dailyRecords}
          month={month} year={year}
        />
      )}

      {/* Attendance table (read-only) */}
      {activeTab === 'attendance' && (
        <div className="tbl-wrap">
          <table className="att-tbl">
            <thead>
              <tr>
                <th>Date</th><th>Day</th><th>Attendance Status</th>
                <th>Worksite</th><th>Base Pay (₹)</th><th>Total Daily (₹)</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(r => (
                <tr key={r.date} className="trow">
                  <td className="td-date">{String(r.date).padStart(2,'0')}</td>
                  <td className="td-day">{r.dayName}</td>
                  <td>
                    {r.status === 'present' ? <span className="badge-off att-present">● PRESENT</span>
                     : r.status === 'absent' ? <span className="badge-off att-absent">● ABSENT</span>
                     : <span className="badge-off att-pending">○ NOT MARKED</span>}
                  </td>
                  <td>{r.worksite ? <span className="worksite-label">{r.worksite}</span> : <span className="td-dash">—</span>}</td>
                  <td>
                    <div className="pay-cell">
                      <span className="rupee">₹</span>
                      <span className="cum-amt">{r.payment.toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                  <td className="td-cum">
                    <div className="total-daily-cell">
                      <span className="total-daily-amt">₹{r.totalDaily.toLocaleString('en-IN')}</span>
                      {r.otHours > 0 && (
                        <span className="total-daily-sub">+{r.otHours}h OT × ₹{otRate} = ₹{r.otPay.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="tfoot-row">
                <td colSpan={4} className="tfoot-lbl">MONTHLY TOTAL</td>
                <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
                <td className="tfoot-amt">₹{totalAllPay.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE DASHBOARD  –  Personal monthly view (read-only)
//  Character profile is intentionally absent from this view.
// ═══════════════════════════════════════════════════════════════
function EmployeeDashboard({ employee, onLogout, dailyRecords, salaryStructures, employeeSettings, paymentLedger }) {
  const now = new Date();
  const [month,        setMonth]        = useState(now.getMonth());
  const [year]                          = useState(now.getFullYear());
  const [activeEmpTab, setActiveEmpTab] = useState('attendance'); // 'attendance' | 'salary'

  const otRate      = getOTRate(employeeSettings, employee.id);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum  = i + 1;
    const d       = new Date(year, month, dayNum);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const record  = dailyRecords[dateKey]?.[employee.id];
    const payment = record?.status === 'present' ? (record?.payment || 0) : 0;
    const otHours = (record?.status === 'present' ? (record?.overtimeHours || 0) : 0);
    const otPay   = parseFloat((otHours * otRate).toFixed(2));
    return {
      date:       dayNum,
      dayName:    DAY_NAMES[d.getDay()],
      status:     record?.status ?? null,
      payment,
      worksite:   record?.worksite || '',
      otHours,
      otPay,
      totalDaily: payment + otPay,
    };
  });

  let runningTotal = 0;
  const enriched = rows.map(r => {
    runningTotal += r.totalDaily;
    return { ...r, cumulative: runningTotal };
  });

  const workingDays        = rows.length;
  const presentCount       = rows.filter(r => r.status === 'present').length;
  const absentCount        = rows.filter(r => r.status === 'absent').length;
  const totalPayment       = rows.reduce((s, r) => s + r.payment, 0);
  const totalOTHours       = rows.reduce((s, r) => s + r.otHours, 0);
  const totalOTPay         = rows.reduce((s, r) => s + r.otPay, 0);
  const totalAllPay        = totalPayment + totalOTPay;

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
      <div className="stats-strip emp-stats-strip">
        <StatCard label="Days Present"    value={presentCount}                                                  accentColor="#00C853" />
        <StatCard label="Days Absent"     value={absentCount}                                                   accentColor="#FF1744" />
        <StatCard label="Working Days"    value={workingDays}                                                   accentColor="#F5A623" />
        <StatCard label="OT Rate"         value={otRate ? `₹${otRate}/hr` : '—'}                               accentColor="#F5A623" />
        <StatCard label="Total Payment"   value={`₹${totalAllPay.toLocaleString('en-IN')}`}                    accentColor="#00BFFF" />
        <PaidStatusBox
          empId={employee.id}
          year={year} month={month}
          dailyRecords={dailyRecords}
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger || {}}
          setPaymentLedger={() => {}}
          isAdmin={false}
        />
      </div>

      {/* ── TAB NAV ── */}
      <div className="emp-tab-nav">
        <button
          className={`emp-tab-btn ${activeEmpTab === 'attendance' ? 'emp-tab-btn-on' : ''}`}
          onClick={() => setActiveEmpTab('attendance')}
        >📋 My Attendance</button>
        <button
          className={`emp-tab-btn ${activeEmpTab === 'salary' ? 'emp-tab-btn-on' : ''}`}
          onClick={() => setActiveEmpTab('salary')}
        >💰 My Salary</button>
      </div>

      {/* ── MONTH PICKER ── */}
      <div className="month-bar">
        <span className="month-bar-lbl">My Attendance</span>
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
        <span className="month-display">{MONTH_NAMES[month]} {year}</span>
      </div>

      {/* ── SALARY VIEW ── */}
      {activeEmpTab === 'salary' && (
        <EmployeeSalaryView
          employee={employee}
          salaryStructures={salaryStructures}
          dailyRecords={dailyRecords}
          month={month}
          year={year}
        />
      )}

      {/* ── ATTENDANCE TABLE ── */}
      {activeEmpTab === 'attendance' && (
      <div className="tbl-wrap">
        <table className="att-tbl">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Attendance Status</th>
              <th>Worksite</th>
              <th>Base Pay (₹)</th>
              <th>Total Daily (₹)</th>
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
                  <div className="total-daily-cell">
                    <span className="total-daily-amt">₹{r.totalDaily.toLocaleString('en-IN')}</span>
                    {r.otHours > 0 && (
                      <span className="total-daily-sub">
                        +{r.otHours}h OT × ₹{otRate} = ₹{r.otPay.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-row">
              <td colSpan={4} className="tfoot-lbl">MONTHLY TOTAL</td>
              <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
              <td className="tfoot-amt">₹{totalAllPay.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      )}

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
function App() {
  const [employees,         setEmployees]         = useState(INITIAL_EMPLOYEES);
  const [user,              setUser]              = useState(null);
  const [err,               setErr]               = useState('');
  const [dailyRecords,      setDailyRecords]      = useState({});
  // Character profiles — keyed by employee ID, admin-only, never exposed to EmployeeDashboard
  const [characterProfiles,  setCharacterProfiles]  = useState({});
  const [salaryStructures,  setSalaryStructures]  = useState({});
  // Per-employee settings (OT rate, etc.) — read-only to employees
  const [employeeSettings,  setEmployeeSettings]  = useState({});
  // Payment ledger — tracks admin pay-outs; employee sees read-only
  const [paymentLedger,     setPaymentLedger]     = useState({});

  const handleLogin = (id, pwd) => {
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

      {user && user.role === 'Administrator' && (
        <AdminDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
          setDailyRecords={setDailyRecords}
          employees={employees}
          setEmployees={setEmployees}
          characterProfiles={characterProfiles}
          setCharacterProfiles={setCharacterProfiles}
          salaryStructures={salaryStructures}
          setSalaryStructures={setSalaryStructures}
          employeeSettings={employeeSettings}
          setEmployeeSettings={setEmployeeSettings}
          paymentLedger={paymentLedger}
          setPaymentLedger={setPaymentLedger}
        />
      )}

      {/* Character profile is intentionally NOT passed here */}
      {user && user.role !== 'Administrator' && (
        <EmployeeDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
          salaryStructures={salaryStructures}
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger}
        />
      )}
    </div>
  );
}

export default App;
