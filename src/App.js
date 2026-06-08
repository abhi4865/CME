import React, { useState, useEffect } from 'react';
import './App.css';

const CME_LOGO = 'data:image/png;base64,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';

// ─── EMPLOYEE DATA ──────────────────────────────────────────────
const INITIAL_EMPLOYEES = [
  { id: 1, loginId: 'EMP001', password: 'pass001', name: 'Rajesh Kumar',   role: 'Senior Electrician', email: 'rajesh@cme.com',  department: 'Field Operations', siteId: 'site_1' },
  { id: 2, loginId: 'EMP002', password: 'pass002', name: 'Priya Sharma',   role: 'Site Supervisor',    email: 'priya@cme.com',   department: 'Site Management',  siteId: 'site_1' },
  { id: 3, loginId: 'EMP003', password: 'pass003', name: 'Amit Singh',     role: 'Technician',         email: 'amit@cme.com',    department: 'Technical',        siteId: 'site_2' },
  { id: 4, loginId: 'EMP004', password: 'pass004', name: 'Sunita Verma',   role: 'Electrician',        email: 'sunita@cme.com',  department: 'Field Operations', siteId: 'site_2' },
  { id: 5, loginId: 'ADMIN',  password: 'admin123', name: 'Main Admin',    role: 'Administrator',      email: 'admin@cme.com',   department: 'Management',       siteId: null    },
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

function calcUnderTime(timeIn, timeOut, standardHours) {
  const inM  = parseTimeMins(timeIn);
  const outM = parseTimeMins(timeOut);
  if (inM === null || outM === null || outM <= inM) return 0;
  const workedHrs = (outM - inM) / 60;
  return Math.max(0, parseFloat(((Number(standardHours) || 8) - workedHrs).toFixed(2)));
}

function getOTRate(employeeSettings, empId) {
  return Number(employeeSettings?.[empId]?.overtimeRate) || 0;
}

// Auto-compute out time = timeIn + standardHours
// e.g. timeIn='09:00', stdH=8 → '17:00'
function computeAutoOutTime(timeIn, standardHours) {
  const inM = parseTimeMins(timeIn);
  if (inM === null) {
    // fallback: 09:00 + stdH
    const fallbackOut = 9 * 60 + (Number(standardHours) || 8) * 60;
    const h = Math.floor(fallbackOut / 60) % 24;
    const m = fallbackOut % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  const outM = inM + (Number(standardHours) || 8) * 60;
  const h = Math.floor(outM / 60) % 24;
  const m = outM % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
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
  const parts = value ? value.split(':') : ['09', '00'];
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
          <div className="brand-bolt">
            <img src={CME_LOGO} alt="CME Logo" className="brand-logo-img" />
          </div>
          <div className="brand-info">
            <span className="brand-cme">CME</span>
            <span className="brand-full">Corporation of Mahanti Electricals</span>
            <span className="brand-contractor">"A" Class Govt. Contractor</span>
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
    dailyRate:    500,
    allowances:   DEFAULT_ALLOWANCES.map(a => ({ ...a })),
    deductions:   DEFAULT_DEDUCTIONS.map(d => ({ ...d })),
    increment:    { type: 'fixed', value: 0 },
    upiId:        '',
    receipt:      null,
    paymentMarks: {},
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
function EmployeeManager({ employees, setEmployees, worksites }) {
  const BLANK = { name: '', email: '', password: '', loginId: '', department: '', role: '', siteId: '' };

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
      siteId:     emp.siteId      || '',
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
      siteId:     form.siteId || null,
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
        siteId:     form.siteId || null,
      }
    ));
    setView('list');
    setEditTarget(null);
  };

  const doDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const staff = employees.filter(e => e.role !== 'Administrator' && e.role !== 'Admin Manager');

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
            <div className="field-group">
              <label className="field-lbl">Assigned Worksite</label>
              <select
                className="field-inp"
                value={form.siteId}
                onChange={e => handleFieldChange('siteId', e.target.value)}
              >
                <option value="">— No site assigned —</option>
                {(worksites || []).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
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
              <th>Worksite</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={7} className="emp-tbl-empty">
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
                  <td>
                    {emp.siteId
                      ? <span className="worksite-badge ws-pill">{(worksites||[]).find(s=>s.id===emp.siteId)?.name || '—'}</span>
                      : <span className="td-dash">—</span>
                    }
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
function SalaryDashboard({ employees, salaryStructures, setSalaryStructures, dailyRecords, employeeSettings, paymentLedger }) {
  const staff   = employees.filter(e => e.role !== 'Administrator' && e.role !== 'Admin Manager');
  const now     = new Date();
  const [selId, setSelId] = useState(staff[0]?.id ?? null);
  const [selMo, setSelMo] = useState(now.getMonth());
  const selYear = now.getFullYear();

  const selEmp = staff.find(e => e.id === selId);
  const struct = selId ? getEmpSalary(salaryStructures, selId) : null;
  const calc   = (selId && struct)
    ? computeMonthSalary(struct, dailyRecords, selId, selYear, selMo)
    : null;

  // ── Monthly cumulative sum (same logic as EmployeeSalaryView) ──
  const monthlyCumulative = React.useMemo(() => {
    if (!selId) return 0;
    const otRate = getOTRate(employeeSettings, selId);
    const daysInMonth = new Date(selYear, selMo + 1, 0).getDate();
    let cumSum = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dk  = `${selYear}-${String(selMo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const rec = dailyRecords[dk]?.[selId];
      const payment    = rec?.status === 'present' ? (rec?.payment || 0) : 0;
      const stdH       = rec?.standardHours || 8;
      const otHours    = rec?.status === 'present' ? (rec?.overtimeHours || 0) : 0;
      const utHours    = rec?.status === 'present' ? calcUnderTime(rec?.timeIn, rec?.timeOut, stdH) : 0;
      const hourlyRate = stdH > 0 ? payment / stdH : 0;
      const otPay      = parseFloat((otHours * otRate).toFixed(2));
      const utPay      = parseFloat((utHours * hourlyRate).toFixed(2));
      const totalDaily = Math.max(0, payment + otPay - utPay);
      const paidAmount = rec?.paidAmount || 0;
      cumSum += totalDaily - paidAmount;
    }
    return cumSum;
  }, [selId, selMo, selYear, dailyRecords, employeeSettings]);

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

  // ── UPI / Receipt / Payment Mark ──
  const setUpiId   = v  => upd(s => ({ ...s, upiId: v }));
  const delUpiId   = () => upd(s => ({ ...s, upiId: '' }));
  const setReceipt = r  => upd(s => ({ ...s, receipt: r }));
  const delReceipt = () => upd(s => ({ ...s, receipt: null }));
  const monthKey   = `${selYear}-${selMo}`;
  const alreadyPaid = !!(struct?.paymentMarks?.[monthKey]?.paid);
  const markPaid = () => {
    if (alreadyPaid) return;
    upd(s => ({
      ...s,
      paymentMarks: {
        ...(s.paymentMarks || {}),
        [monthKey]: { paid: true, timestamp: new Date().toISOString() },
      },
    }));
  };
  const handleReceiptUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('File too large. Please upload under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => setReceipt({ name: file.name, data: ev.target.result, type: file.type, uploadedAt: new Date().toISOString() });
    reader.readAsDataURL(file);
  };

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

              {/* 1 — Cumulative Sum */}
              <div className="sal-net-row sal-net-cumulative-row">
                <span className="sal-net-lbl">
                  📊 Monthly Cumulative Sum after all payment deductions
                  <span className="sal-net-lbl-sub"> (attendance earnings − payments received)</span>
                </span>
                <span className={`sal-net-val ${monthlyCumulative < 0 ? 'sal-minus' : 'sal-plus'}`}>
                  {monthlyCumulative < 0 ? '−' : ''}₹{Math.abs(monthlyCumulative).toLocaleString('en-IN')}
                </span>
              </div>

              {/* 2 — Increment */}
              <div className="sal-net-row">
                <span className="sal-net-lbl">📈 Increment {struct.increment.type === 'percent' ? `(${struct.increment.value}% of basic)` : '(Fixed)'}</span>
                <span className={`sal-net-val ${calc.incrementAmt > 0 ? 'sal-plus' : ''}`}>
                  {calc.incrementAmt > 0 ? '+' : ''}₹{calc.incrementAmt.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 3 — Total Allowances */}
              <div className="sal-net-row">
                <span className="sal-net-lbl">➕ Total Allowances ({struct.allowances.length} items)</span>
                <span className={`sal-net-val ${calc.totalAllowances > 0 ? 'sal-plus' : ''}`}>
                  +₹{calc.totalAllowances.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 4 — Total Deductions */}
              <div className="sal-net-row">
                <span className="sal-net-lbl">➖ Total Deductions ({struct.deductions.length} items)</span>
                <span className={`sal-net-val ${calc.totalDeductions > 0 ? 'sal-minus' : ''}`}>
                  −₹{calc.totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="sal-net-divider" />

              {/* NET TOTAL */}
              <div className="sal-net-row sal-net-total">
                <span className="sal-net-total-lbl">⚡ NET TOTAL SALARY</span>
                <span className="sal-net-total-amt">
                  ₹{(monthlyCumulative + calc.totalAllowances + calc.incrementAmt - calc.totalDeductions).toLocaleString('en-IN')}
                </span>
              </div>

            </div>
          </div>

          {/* ─── PAYMENT CONFIRMATION SECTION ─── */}
          <div className="pay-confirm-section">
            <div className="pay-confirm-hdr">
              <span className="pay-confirm-title">💳 Payment Details</span>
              <span className="pay-confirm-sub">UPI · Receipt · Salary Confirmation</span>
            </div>

            {/* UPI ID */}
            <div className="pay-confirm-row">
              <span className="pay-confirm-lbl">UPI ID</span>
              <div className="pay-upi-wrap">
                <input
                  className="pay-upi-inp"
                  type="text"
                  placeholder="e.g. name@upi or 9876543210@okicici"
                  value={struct.upiId || ''}
                  onChange={e => setUpiId(e.target.value)}
                />
                {struct.upiId && (
                  <button className="pay-del-btn" onClick={delUpiId} title="Delete UPI ID">✕</button>
                )}
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="pay-confirm-row">
              <span className="pay-confirm-lbl">Receipt</span>
              <div className="pay-receipt-wrap">
                {struct.receipt ? (
                  <div className="pay-receipt-preview">
                    {struct.receipt.type?.startsWith('image/') ? (
                      <img src={struct.receipt.data} alt="receipt" className="pay-receipt-img" />
                    ) : (
                      <a href={struct.receipt.data} download={struct.receipt.name} className="pay-receipt-link">
                        📄 {struct.receipt.name}
                      </a>
                    )}
                    <span className="pay-receipt-name">{struct.receipt.name}</span>
                    <button className="pay-del-btn" onClick={delReceipt} title="Remove receipt">✕</button>
                  </div>
                ) : (
                  <label className="pay-upload-btn">
                    📎 Upload Receipt
                    <input type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={handleReceiptUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Mark Paid Button */}
            <div className="pay-mark-row">
              {alreadyPaid ? (
                <div className="pay-success-msg">
                  <span className="pay-success-icon">✓</span>
                  <div className="pay-success-text">
                    <span className="pay-success-title">MONTHLY SALARY PAID SUCCESSFULLY</span>
                    <span className="pay-success-dt">
                      {new Date(struct.paymentMarks[monthKey].timestamp).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <button className="pay-mark-paid-btn" onClick={markPaid}>
                  <span className="pay-mark-paid-led" />
                  MARK AS PAID
                </button>
              )}
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
  employee, month, year, dailyRecords, setDailyRecords, onBack,
  characterProfiles, setCharacterProfiles,
  employeeSettings, setEmployeeSettings,
  salaryStructures,
  paymentLedger, setPaymentLedger,
}) {
  const [profileTab, setProfileTab] = useState('employee'); // 'admin' | 'employee'
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
            className={`admin-profile-tab ${profileTab === 'employee' ? 'admin-profile-tab-on' : ''}`}
            onClick={() => setProfileTab('employee')}
          >👤 Employee View</button>
          <button
            className={`admin-profile-tab ${profileTab === 'admin' ? 'admin-profile-tab-on' : ''}`}
            onClick={() => setProfileTab('admin')}
          >📋 Admin View</button>
        </div>
        <span className="month-display">{MONTH_NAMES[month]} {year} — {employee.name}</span>
      </div>

      {/* ── EMPLOYEE VIEW TAB ── */}
      {profileTab === 'employee' && (
        <EmployeeProfileEmpView
          employee={employee}
          month={month} year={year}
          dailyRecords={dailyRecords}
          setDailyRecords={setDailyRecords}
          salaryStructures={salaryStructures}
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger}
          setPaymentLedger={setPaymentLedger}
          isAdmin={true}
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
//  WORKSITE DASHBOARD  –  Admin-only, two-level site manager
// ═══════════════════════════════════════════════════════════════
function WorksiteDashboard({ worksites, setWorksites, dailyRecords, employees }) {
  const [activeSiteId,  setActiveSiteId]  = useState(null);
  const [materials,     setMaterials]     = useState({});   // { siteId: [{id,name,qty,unit,notes}] }
  const [photos,        setPhotos]        = useState({});   // { siteId: [{id,src}] }
  const [lightboxSrc,   setLightboxSrc]   = useState(null);
  const [renameId,      setRenameId]      = useState(null);
  const [renameDraft,   setRenameDraft]   = useState('');
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const fileInputRef = React.useRef(null);

  const staff = employees.filter(e => e.role !== 'Administrator' && e.role !== 'Admin Manager');

  // ── Helpers ──────────────────────────────────────────────────
  const getSiteRecords = (siteName) => {
    const result = [];
    Object.entries(dailyRecords).forEach(([dateKey, dayData]) => {
      Object.entries(dayData).forEach(([empIdStr, rec]) => {
        if (rec?.worksite === siteName) {
          const emp = staff.find(e => e.id === Number(empIdStr));
          result.push({ dateKey, empId: Number(empIdStr), empName: emp?.name || '—', rec });
        }
      });
    });
    return result.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  };

  const getSiteStats = (site) => {
    const recs = getSiteRecords(site.name);
    const dates = new Set(recs.map(r => r.dateKey));
    const emps  = new Set(recs.map(r => r.empId));
    const payout = recs.reduce((s, r) => s + (r.rec.status === 'present' ? (r.rec.payment || 0) : 0), 0);
    return { totalDays: dates.size, totalEmps: emps.size, totalPayout: payout, totalPresent: recs.filter(r=>r.rec.status==='present').length };
  };

  // ── Site mutations ────────────────────────────────────────────
  const addSite = () => {
    const raw = window.prompt('Enter new worksite name:');
    if (!raw) return;
    const name = raw.trim();
    if (!name) return;
    if (worksites.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      window.alert(`A site named "${name}" already exists.`);
      return;
    }
    setWorksites(prev => [...prev, { id: `site_${Date.now()}`, name }]);
  };

  const doDeleteSite = () => {
    if (!deleteTarget) return;
    setWorksites(prev => prev.filter(s => s.id !== deleteTarget.id));
    if (activeSiteId === deleteTarget.id) setActiveSiteId(null);
    setDeleteTarget(null);
  };

  const startRename = (site) => { setRenameId(site.id); setRenameDraft(site.name); };

  const commitRename = () => {
    const name = renameDraft.trim();
    if (!name) { setRenameId(null); return; }
    if (worksites.some(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== renameId)) {
      window.alert(`A site named "${name}" already exists.`);
      return;
    }
    setWorksites(prev => prev.map(s => s.id === renameId ? { ...s, name } : s));
    setRenameId(null);
  };

  // ── Material mutations ────────────────────────────────────────
  const getMats = siteId => materials[siteId] || [];

  const addMaterial = siteId => setMaterials(prev => ({
    ...prev,
    [siteId]: [...getMats(siteId), { id: `mat_${Date.now()}`, name: '', qty: '', unit: '', notes: '' }],
  }));

  const updateMat = (siteId, matId, field, val) => setMaterials(prev => ({
    ...prev,
    [siteId]: getMats(siteId).map(m => m.id === matId ? { ...m, [field]: val } : m),
  }));

  const deleteMat = (siteId, matId) => setMaterials(prev => ({
    ...prev,
    [siteId]: getMats(siteId).filter(m => m.id !== matId),
  }));

  // ── Photo mutations ───────────────────────────────────────────
  const getPhotos = siteId => photos[siteId] || [];

  const handlePhotoUpload = (siteId, files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setPhotos(prev => ({
          ...prev,
          [siteId]: [...(prev[siteId] || []), { id: `ph_${Date.now()}_${Math.random()}`, src: e.target.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const deletePhoto = (siteId, photoId) => setPhotos(prev => ({
    ...prev,
    [siteId]: getPhotos(siteId).filter(p => p.id !== photoId),
  }));

  const activeSite = worksites.find(s => s.id === activeSiteId);

  // ════════════════════════════════════════════════════════════
  //  LEVEL 2 — Individual Site Dashboard
  // ════════════════════════════════════════════════════════════
  if (activeSite) {
    const siteRecs = getSiteRecords(activeSite.name);
    const stats    = getSiteStats(activeSite);
    const mats     = getMats(activeSite.id);
    const sitePhotos = getPhotos(activeSite.id);

    return (
      <div className="ws-page">
        {/* Lightbox */}
        {lightboxSrc && (
          <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
            <div className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</div>
            <img
              className="lightbox-img"
              src={lightboxSrc}
              alt="Site"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {/* ── Top bar ── */}
        <div className="ws-topbar">
          <button className="mtab mtab-on ws-back-btn" onClick={() => setActiveSiteId(null)}>
            ← All Sites
          </button>
          <div className="ws-site-title-row">
            {renameId === activeSite.id ? (
              <div className="ws-rename-row">
                <input
                  className="field-inp ws-rename-inp"
                  value={renameDraft}
                  onChange={e => setRenameDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenameId(null); }}
                  autoFocus
                />
                <button className="ws-rename-ok" onClick={commitRename}>✓ Save</button>
                <button className="ws-rename-cancel" onClick={() => setRenameId(null)}>✕</button>
              </div>
            ) : (
              <>
                <h2 className="ws-site-name">🏗 {activeSite.name}</h2>
                <button className="ws-rename-btn" onClick={() => startRename(activeSite)}>✏ Rename</button>
              </>
            )}
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <StatCard label="Total Days Logged"      value={stats.totalDays}                                   accentColor="#F5A623" />
          <StatCard label="Employees Assigned"     value={stats.totalEmps}                                   accentColor="#00BFFF" />
          <StatCard label="Present Entries"        value={stats.totalPresent}                                accentColor="#00C853" />
          <StatCard label="Total Site Payout"      value={`₹${stats.totalPayout.toLocaleString('en-IN')}`}  accentColor="#F5A623" />
        </div>

        {/* ── Attendance Log ── */}
        <div className="ws-section">
          <div className="ws-section-hdr">
            <span className="ws-section-title">📋 Attendance Log</span>
            <span className="ws-section-sub">{siteRecs.length} entr{siteRecs.length === 1 ? 'y' : 'ies'} for {activeSite.name}</span>
          </div>
          <div className="tbl-wrap" style={{ padding: 0 }}>
            <table className="att-tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Status</th>
                  <th>Pay (₹)</th>
                </tr>
              </thead>
              <tbody>
                {siteRecs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="emp-tbl-empty">
                      No attendance records found for this worksite. Mark attendance with this site assigned to populate the log.
                    </td>
                  </tr>
                ) : (
                  siteRecs.map((r, i) => (
                    <tr key={i} className="trow">
                      <td className="td-date">{r.dateKey}</td>
                      <td>
                        <div className="emp-name-cell">
                          <span className="user-name">{r.empName}</span>
                        </div>
                      </td>
                      <td>
                        {r.rec.status === 'present' ? (
                          <span className="badge-off att-present">● PRESENT</span>
                        ) : r.rec.status === 'absent' ? (
                          <span className="badge-off att-absent">● ABSENT</span>
                        ) : (
                          <span className="badge-off att-pending">○ NOT MARKED</span>
                        )}
                      </td>
                      <td>
                        <div className="pay-cell">
                          <span className="rupee">₹</span>
                          <span className="cum-amt">
                            {r.rec.status === 'present' ? (r.rec.payment || 0).toLocaleString('en-IN') : '0'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Site Materials ── */}
        <div className="ws-section">
          <div className="ws-section-hdr">
            <div>
              <span className="ws-section-title">🧱 Site Materials</span>
              <span className="ws-section-sub">Track supplies and consumables for this site</span>
            </div>
            <button className="emp-btn-add ws-add-mat-btn" onClick={() => addMaterial(activeSite.id)}>
              ＋ Add Material
            </button>
          </div>
          <div className="tbl-wrap" style={{ padding: 0 }}>
            <table className="att-tbl ws-mat-tbl">
              <thead>
                <tr>
                  <th>Material Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Notes</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {mats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="emp-tbl-empty">
                      No materials added yet. Click "＋ Add Material" to track site supplies.
                    </td>
                  </tr>
                ) : (
                  mats.map(mat => (
                    <tr key={mat.id} className="trow">
                      <td>
                        <input
                          className="field-inp ws-mat-inp"
                          type="text"
                          placeholder="e.g. Cement"
                          value={mat.name}
                          onChange={e => updateMat(activeSite.id, mat.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="field-inp ws-mat-inp ws-mat-qty"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={mat.qty}
                          onChange={e => updateMat(activeSite.id, mat.id, 'qty', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="field-inp ws-mat-inp ws-mat-unit"
                          type="text"
                          placeholder="bags / kg / pcs"
                          value={mat.unit}
                          onChange={e => updateMat(activeSite.id, mat.id, 'unit', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="field-inp ws-mat-inp"
                          type="text"
                          placeholder="Optional notes…"
                          value={mat.notes}
                          onChange={e => updateMat(activeSite.id, mat.id, 'notes', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          className="sal-del-btn"
                          onClick={() => deleteMat(activeSite.id, mat.id)}
                          title="Remove row"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Site Photos ── */}
        <div className="ws-section ws-photos-section">
          <div className="ws-section-hdr">
            <div>
              <span className="ws-section-title">📸 Site Photos</span>
              <span className="ws-section-sub">{sitePhotos.length} photo{sitePhotos.length !== 1 ? 's' : ''} uploaded</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => { handlePhotoUpload(activeSite.id, e.target.files); e.target.value = ''; }}
          />

          <div
            className="photo-upload-box"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('photo-upload-box-drag'); }}
            onDragLeave={e => e.currentTarget.classList.remove('photo-upload-box-drag')}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('photo-upload-box-drag');
              handlePhotoUpload(activeSite.id, e.dataTransfer.files);
            }}
          >
            <span className="photo-upload-icon">📷</span>
            <span className="photo-upload-lbl">Click to upload or drag &amp; drop site photos</span>
            <span className="photo-upload-hint">Supports JPG, PNG, WEBP, GIF</span>
          </div>

          {sitePhotos.length > 0 && (
            <div className="photo-grid">
              {sitePhotos.map(ph => (
                <div key={ph.id} className="photo-thumb" onClick={() => setLightboxSrc(ph.src)}>
                  <img src={ph.src} alt="Site" />
                  <button
                    className="photo-del-btn"
                    onClick={e => { e.stopPropagation(); deletePhoto(activeSite.id, ph.id); }}
                    title="Delete photo"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  LEVEL 1 — Site List (card grid)
  // ════════════════════════════════════════════════════════════
  return (
    <div className="ws-page">
      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">⚠</div>
            <h3 className="confirm-title">Delete Worksite?</h3>
            <p className="confirm-msg">
              Remove <strong>{deleteTarget.name}</strong>? This only removes the site entry.
              Attendance records already saved with this worksite name will remain unchanged.
            </p>
            <div className="confirm-actions">
              <button className="emp-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="emp-btn-delete-confirm" onClick={doDeleteSite}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="ws-list-header">
        <div>
          <h2 className="ws-list-title">🏗 Worksite Dashboard</h2>
          <p className="ws-list-sub">
            {worksites.length} site{worksites.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button className="emp-btn-add" onClick={addSite}>＋ Add Site</button>
      </div>

      {worksites.length === 0 ? (
        <div className="ws-empty">
          <span className="ws-empty-icon">🏗</span>
          <p>No worksites registered. Click "＋ Add Site" to create your first worksite.</p>
        </div>
      ) : (
        <div className="site-card-grid">
          {worksites.map(site => {
            const stats = getSiteStats(site);
            return (
              <div key={site.id} className="site-card">
                <div className="site-card-top">
                  <div className="site-card-icon">🏗</div>
                  <div className="site-card-info">
                    <div className="site-card-name">{site.name}</div>
                    <div className="site-card-stats">
                      <span className="site-card-stat">
                        <span className="site-card-stat-val">{stats.totalDays}</span>
                        <span className="site-card-stat-lbl">days logged</span>
                      </span>
                      <span className="site-card-stat-sep">·</span>
                      <span className="site-card-stat">
                        <span className="site-card-stat-val">{stats.totalEmps}</span>
                        <span className="site-card-stat-lbl">employees</span>
                      </span>
                      <span className="site-card-stat-sep">·</span>
                      <span className="site-card-stat">
                        <span className="site-card-stat-val site-card-payout">
                          ₹{stats.totalPayout.toLocaleString('en-IN')}
                        </span>
                        <span className="site-card-stat-lbl">payout</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="site-card-actions">
                  <button
                    className="login-btn site-card-open-btn"
                    onClick={() => setActiveSiteId(site.id)}
                  >
                    🏗 Open Dashboard
                  </button>
                  <button
                    className="site-card-del-btn"
                    onClick={() => setDeleteTarget(site)}
                    title="Delete site"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN MANAGER PANEL  –  Main-Admin-only: CRUD for Admin Managers
//  Admin Managers can do everything an admin can BUT cannot see
//  or touch this panel.
// ═══════════════════════════════════════════════════════════════
function AdminManagerPanel({ employees, setEmployees, isMainAdmin }) {
  const BLANK_AM = { name: '', email: '', password: '', loginId: '', department: 'Management' };

  const [amView,        setAmView]        = useState('list');   // 'list' | 'create' | 'edit'
  const [amEditTarget,  setAmEditTarget]  = useState(null);
  const [amDeleteTarget,setAmDeleteTarget]= useState(null);
  const [amForm,        setAmForm]        = useState(BLANK_AM);
  const [amFormErr,     setAmFormErr]     = useState('');

  // All Admin Manager accounts (role === 'Admin Manager')
  const managers = employees.filter(e => e.role === 'Admin Manager');

  const openAmCreate = () => {
    setAmForm({ ...BLANK_AM });
    setAmFormErr('');
    setAmView('create');
  };

  const openAmEdit = mgr => {
    setAmEditTarget(mgr);
    setAmForm({
      name:       mgr.name,
      email:      mgr.email      || '',
      password:   mgr.password,
      loginId:    mgr.loginId,
      department: mgr.department || 'Management',
    });
    setAmFormErr('');
    setAmView('edit');
  };

  const cancelAmForm = () => { setAmView('list'); setAmEditTarget(null); setAmFormErr(''); };

  const handleAmFieldChange = (field, val) =>
    setAmForm(prev => ({ ...prev, [field]: val }));

  const validateAm = () => {
    if (!amForm.name.trim())     return 'Full name is required.';
    if (!amForm.loginId.trim())  return 'Manager ID is required.';
    if (!amForm.password.trim()) return 'Password is required.';
    const dup = employees.find(e =>
      e.loginId.toLowerCase() === amForm.loginId.trim().toLowerCase() &&
      (amView === 'create' || e.id !== amEditTarget?.id)
    );
    if (dup) return `ID "${amForm.loginId.trim().toUpperCase()}" is already taken.`;
    return null;
  };

  const handleAmCreate = () => {
    const err = validateAm();
    if (err) { setAmFormErr(err); return; }
    setEmployees(prev => [...prev, {
      id:         Math.max(...prev.map(e => e.id)) + 1,
      loginId:    amForm.loginId.trim().toUpperCase(),
      password:   amForm.password.trim(),
      name:       amForm.name.trim(),
      role:       'Admin Manager',
      email:      amForm.email.trim(),
      department: amForm.department.trim() || 'Management',
      siteId:     null,
    }]);
    setAmView('list');
  };

  const handleAmSaveEdit = () => {
    const err = validateAm();
    if (err) { setAmFormErr(err); return; }
    setEmployees(prev => prev.map(e =>
      e.id !== amEditTarget.id ? e : {
        ...e,
        loginId:    amForm.loginId.trim().toUpperCase(),
        password:   amForm.password.trim(),
        name:       amForm.name.trim(),
        email:      amForm.email.trim(),
        department: amForm.department.trim() || 'Management',
      }
    ));
    setAmView('list');
    setAmEditTarget(null);
  };

  const doAmDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== amDeleteTarget.id));
    setAmDeleteTarget(null);
  };

  // ── Form view — only reachable by main admin ──
  if ((amView === 'create' || amView === 'edit') && isMainAdmin) {
    const isEdit = amView === 'edit';
    return (
      <div className="emp-form-wrap">
        <div className="emp-form-header">
          <button className="mtab mtab-on emp-back-btn" onClick={cancelAmForm}>
            ← Back to Manager List
          </button>
          <h2 className="emp-form-title">
            {isEdit ? '✏ Edit Admin Manager' : '＋ New Admin Manager'}
          </h2>
          <p className="emp-form-sub">
            {isEdit
              ? `Updating record for ${amEditTarget.name} (${amEditTarget.loginId})`
              : 'Create an Admin Manager account. They can manage everything except this panel.'}
          </p>
        </div>

        <div className="emp-form">
          <div className="emp-form-grid">
            <div className="field-group">
              <label className="field-lbl">Full Name *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. Vikram Nair"
                value={amForm.name}
                onChange={e => handleAmFieldChange('name', e.target.value)}
                autoFocus
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Manager ID *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. MGR001"
                value={amForm.loginId}
                onChange={e => handleAmFieldChange('loginId', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Password *</label>
              <input
                className="field-inp"
                type="text"
                placeholder="Set a login password"
                value={amForm.password}
                onChange={e => handleAmFieldChange('password', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Email Address</label>
              <input
                className="field-inp"
                type="email"
                placeholder="e.g. vikram@cme.com"
                value={amForm.email}
                onChange={e => handleAmFieldChange('email', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-lbl">Department</label>
              <input
                className="field-inp"
                type="text"
                placeholder="e.g. Management"
                value={amForm.department}
                onChange={e => handleAmFieldChange('department', e.target.value)}
              />
            </div>
          </div>

          <div className="am-role-note">
            <span className="am-role-note-icon">🔐</span>
            <span>
              Admin Managers have full access to Daily Attendance, Employee Management,
              Worksite Dashboard and Salary — but <strong>cannot</strong> create, edit,
              rename or delete other Admin Manager profiles.
            </span>
          </div>

          {amFormErr && (
            <div className="login-error emp-form-err">
              <span>⚠</span> {amFormErr}
            </div>
          )}

          <div className="emp-form-actions">
            <button className="emp-btn-cancel" onClick={cancelAmForm}>Cancel</button>
            <button
              className="login-btn emp-form-submit"
              onClick={isEdit ? handleAmSaveEdit : handleAmCreate}
            >
              {isEdit ? 'Save Changes' : 'Create Manager'}
              <span className="login-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="emp-mgr">

      {/* Delete confirm */}
      {amDeleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">⚠</div>
            <h3 className="confirm-title">Delete Admin Manager?</h3>
            <p className="confirm-msg">
              You are about to permanently remove{' '}
              <strong>{amDeleteTarget.name}</strong> ({amDeleteTarget.loginId}).
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="emp-btn-cancel" onClick={() => setAmDeleteTarget(null)}>
                Cancel
              </button>
              <button className="emp-btn-delete-confirm" onClick={doAmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="emp-mgr-header">
        <div>
          <h2 className="emp-mgr-title">Admin Manager Directory</h2>
          <p className="emp-mgr-sub">
            {managers.length} manager{managers.length !== 1 ? 's' : ''} registered
            &nbsp;·&nbsp;
            <span className="am-priv-note">🔐 Visible to Main Admin only</span>
          </p>
        </div>
        {isMainAdmin && (
          <button className="emp-btn-add" onClick={openAmCreate}>
            ＋ Add Admin Manager
          </button>
        )}
      </div>

      <div className="tbl-wrap">
        <table className="att-tbl emp-tbl">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Manager</th>
              <th>Manager ID</th>
              <th>Department</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td colSpan={6} className="emp-tbl-empty">
                  No admin managers yet. Click "＋ Add Admin Manager" to create one.
                </td>
              </tr>
            ) : (
              managers.map((mgr, idx) => (
                <tr key={mgr.id} className="trow">
                  <td className="td-date">{String(idx + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="emp-name-cell">
                      <span className="user-name">{mgr.name}</span>
                      <span className="emp-role-sub am-role-badge">🔐 Admin Manager</span>
                    </div>
                  </td>
                  <td>
                    <code className="emp-id-badge am-id-badge">{mgr.loginId}</code>
                  </td>
                  <td className="emp-tbl-muted">
                    {mgr.department || <span className="td-dash">—</span>}
                  </td>
                  <td className="emp-tbl-muted">
                    {mgr.email || <span className="td-dash">—</span>}
                  </td>
                  <td>
                    <div className="action-btns">
                      {isMainAdmin ? (
                        <>
                          <button
                            className="action-btn action-edit"
                            onClick={() => openAmEdit(mgr)}
                          >
                            ✏ Edit
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => setAmDeleteTarget(mgr)}
                          >
                            🗑 Delete
                          </button>
                        </>
                      ) : (
                        <span className="td-dash am-readonly-note">View only</span>
                      )}
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
  worksites, setWorksites,
  isMainAdmin,
}) {
  const now  = new Date();
  const [year,          setYear]         = useState(now.getFullYear());
  const [month,         setMonth]        = useState(now.getMonth());
  const [day,           setDay]          = useState(now.getDate());
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [activeTab,     setActiveTab]    = useState('attendance');
  const [siteFilter,    setSiteFilter]   = useState('all');

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, daysInMonth, day]);

  const dateKey        = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const staff          = employees.filter(e => e.role !== 'Administrator' && e.role !== 'Admin Manager');
  const filteredStaff  = siteFilter === 'all' ? staff : staff.filter(e => e.siteId === siteFilter);
  const currentDayData = dailyRecords[dateKey] || {};

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

  // ── Inherited timeIn — scans backwards for last explicitly-set timeIn,
  //    defaults to 09:00 (fixes the "minute not changed → OT not calculated" bug
  //    by always storing a real value in state instead of leaving timeIn empty)
  const getInheritedTimeIn = empId => {
    for (let d = day - 1; d >= 1; d--) {
      const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.timeInSet && rec?.timeIn) return rec.timeIn;
    }
    const allKeys = Object.keys(dailyRecords).sort();
    const cutoff  = dateKey;
    for (let i = allKeys.length - 1; i >= 0; i--) {
      const k = allKeys[i];
      if (k >= cutoff) continue;
      const rec = dailyRecords[k]?.[empId];
      if (rec?.timeInSet && rec?.timeIn) return rec.timeIn;
    }
    return '09:00'; // default
  };

  // ── Mutations ──
  const cycleStatus = empId => {
    const empData = currentDayData[empId] || { status: null, payment: 0 };
    const next = empData.status === null ? 'present'
               : empData.status === 'present' ? 'absent'
               : null;

    const newPayment = next === 'present' ? getInheritedSalary(empId) : 0;
    // Always seed timeIn with inherited value so OT/UT calc works immediately
    // without requiring the admin to touch the In picker
    const newTimeIn  = next === 'present' ? (empData.timeIn || getInheritedTimeIn(empId)) : (empData.timeIn || '');
    // Auto-set timeOut = timeIn + standardHours (admin can override via picker)
    const stdH       = empData.standardHours || 8;
    const newTimeOut = next === 'present'
      ? (empData.timeOut || computeAutoOutTime(newTimeIn, stdH))
      : (empData.timeOut || '');
    // Recalc OT with the seeded times
    const newOT = next === 'present' ? calcOvertime(newTimeIn, newTimeOut, stdH) : 0;

    setDailyRecords(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [empId]: { ...empData, status: next, payment: newPayment, paymentSet: false, timeIn: newTimeIn, timeOut: newTimeOut, overtimeHours: newOT },
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

  const setStandardHours = (empId, val) => {
    setDailyRecords(prev => {
      const empData    = (prev[dateKey] || {})[empId] || {};
      // Auto-adjust timeOut = timeIn + new stdH, then recompute OT
      const newTimeOut = computeAutoOutTime(empData.timeIn || '09:00', val);
      const ot         = calcOvertime(empData.timeIn, newTimeOut, val);
      return { ...prev, [dateKey]: { ...prev[dateKey], [empId]: { ...empData, standardHours: Number(val), timeOut: newTimeOut, overtimeHours: ot } } };
    });
  };

  const setTimeIn = (empId, val) => {
    setDailyRecords(prev => {
      const empData = (prev[dateKey] || {})[empId] || {};
      const stdH    = empData.standardHours || 8;
      // Auto-adjust timeOut = new timeIn + stdH, then recompute OT
      const newTimeOut = computeAutoOutTime(val, stdH);
      const ot         = calcOvertime(val, newTimeOut, stdH);
      return { ...prev, [dateKey]: { ...prev[dateKey], [empId]: { ...empData, timeIn: val, timeInSet: true, timeOut: newTimeOut, overtimeHours: ot } } };
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

  filteredStaff.forEach(emp => {
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
          <img src={CME_LOGO} alt="CME Logo" className="hdr-logo-img" />
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
          className={`admin-nav-tab ${activeTab === 'worksites' ? 'admin-nav-tab-on' : ''}`}
          onClick={() => { setActiveTab('worksites'); setSelectedEmpId(null); }}
        >
          🏗 Worksite Dashboard
        </button>
        <button
          className={`admin-nav-tab ${activeTab === 'salary' ? 'admin-nav-tab-on' : ''}`}
          onClick={() => { setActiveTab('salary'); setSelectedEmpId(null); }}
        >
          💰 Salary Dashboard
        </button>
        {isMainAdmin && (
          <button
            className={`admin-nav-tab admin-nav-tab-am ${activeTab === 'adminManagers' ? 'admin-nav-tab-on' : ''}`}
            onClick={() => { setActiveTab('adminManagers'); setSelectedEmpId(null); }}
          >
            🔐 Admin Managers
          </button>
        )}
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
            setDailyRecords={setDailyRecords}
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
              <StatCard label="Total Staff"   value={filteredStaff.length}                                      accentColor="#00BFFF" />
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

              {/* ── Worksite Filter ── */}
              <div className="day-picker-wrap site-filter-wrap">
                <label className="day-picker-lbl site-filter-lbl">🏗 Site:</label>
                <select
                  className="day-select site-filter-select"
                  value={siteFilter}
                  onChange={e => setSiteFilter(e.target.value)}
                >
                  <option value="all">All Sites</option>
                  {worksites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
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
                    <th>Work Time</th>
                    <th>OT / UT</th>
                    <th>Salary (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="emp-tbl-empty">
                        No employees assigned to this site. Assign employees via Manage Employees.
                      </td>
                    </tr>
                  ) : filteredStaff.map((emp, index) => {
                    const record      = currentDayData[emp.id] || { status: null, payment: 0 };
                    const status      = record.status;
                    const isPaymentDisabled  = status !== 'present';
                    const displayPayment     = isPaymentDisabled ? 0 : record.payment;
                    const isSalaryInherited  = status === 'present' && !record.paymentSet && record.payment > 0;
                    const underTimeHours     = status === 'present'
                      ? calcUnderTime(record.timeIn, record.timeOut, record.standardHours || 8)
                      : 0;

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
                          {status === 'present' ? (() => {
                            const stdH = record.standardHours || 8;
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
                              </div>
                            );
                          })() : (
                            <span className="td-dash">—</span>
                          )}
                        </td>
                        <td>
                          {status === 'present' ? (
                            <div className="ot-ut-cell">
                              {(record.overtimeHours || 0) > 0 && (
                                <span className="ot-badge ot-green">+{record.overtimeHours}h OT</span>
                              )}
                              {underTimeHours > 0 && (
                                <span className="ut-red">-{underTimeHours}h UT</span>
                              )}
                              {!(record.overtimeHours || 0) && !underTimeHours && (
                                <span className="td-dash">—</span>
                              )}
                            </div>
                          ) : (
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
        <EmployeeManager employees={employees} setEmployees={setEmployees} worksites={worksites} />
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: WORKSITE DASHBOARD
          ══════════════════════════════════════════════════════════ */}
      {activeTab === 'worksites' && (
        <WorksiteDashboard
          worksites={worksites}
          setWorksites={setWorksites}
          dailyRecords={dailyRecords}
          employees={employees}
        />
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
          employeeSettings={employeeSettings}
          paymentLedger={paymentLedger}
        />
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ADMIN MANAGERS  —  Main Admin only
          ════════════════════════════════════════════════════════ */}
      {activeTab === 'adminManagers' && isMainAdmin && (
        <AdminManagerPanel
          employees={employees}
          setEmployees={setEmployees}
          isMainAdmin={isMainAdmin}
        />
      )}

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE SALARY VIEW  –  Read-only monthly salary breakdown
// ═══════════════════════════════════════════════════════════════
function EmployeeSalaryView({ employee, salaryStructures, dailyRecords, month, year, employeeSettings }) {
  const struct  = getEmpSalary(salaryStructures, employee.id);
  const calc    = computeMonthSalary(struct, dailyRecords, employee.id, year, month);
  const otRate  = getOTRate(employeeSettings, employee.id);

  // Compute monthly cumulative running total (attendance earnings after paid deductions)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let monthlyCumulative = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dk  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = dailyRecords[dk]?.[employee.id];
    const payment  = rec?.status === 'present' ? (rec?.payment || 0) : 0;
    const stdH     = rec?.standardHours || 8;
    const otHours  = rec?.status === 'present' ? (rec?.overtimeHours || 0) : 0;
    const utHours  = rec?.status === 'present' ? calcUnderTime(rec?.timeIn, rec?.timeOut, stdH) : 0;
    const hourlyRate = stdH > 0 ? payment / stdH : 0;
    const otPay    = parseFloat((otHours * otRate).toFixed(2));
    const utPay    = parseFloat((utHours * hourlyRate).toFixed(2));
    const totalDaily = Math.max(0, payment + otPay - utPay);
    const paidAmount = rec?.paidAmount || 0;
    monthlyCumulative += totalDaily - paidAmount;
  }

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

        {/* Monthly Cumulative Sum — primary figure */}
        <div className="emp-sal-section">
          <div className="emp-sal-row emp-sal-cumulative-row">
            <span className="emp-sal-item emp-sal-cumulative-lbl">📊 Monthly cumulative sum after all payment deduction</span>
            <span className="emp-sal-sub"></span>
            <span className={`emp-sal-amt emp-sal-cumulative-amt ${monthlyCumulative < 0 ? 'emp-sal-red' : 'emp-sal-green'}`}>
              {monthlyCumulative < 0 ? '−' : ''}₹{Math.abs(monthlyCumulative).toLocaleString('en-IN')}
            </span>
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

          {/* 1 — Cumulative Sum */}
          <div className="emp-sal-net-row emp-sal-net-seq-row">
            <span className="emp-sal-net-seq-lbl">📊 Monthly Cumulative Sum</span>
            <span className={`emp-sal-net-seq-val ${monthlyCumulative < 0 ? 'emp-sal-red' : 'emp-sal-green'}`}>
              {monthlyCumulative < 0 ? '−' : ''}₹{Math.abs(monthlyCumulative).toLocaleString('en-IN')}
            </span>
          </div>

          {/* 2 — Increment */}
          <div className="emp-sal-net-row emp-sal-net-seq-row">
            <span className="emp-sal-net-seq-lbl">📈 Increment</span>
            <span className={`emp-sal-net-seq-val ${calc.incrementAmt > 0 ? 'emp-sal-green' : ''}`}>
              {calc.incrementAmt > 0 ? '+' : ''}₹{calc.incrementAmt.toLocaleString('en-IN')}
            </span>
          </div>

          {/* 3 — Total Allowances */}
          <div className="emp-sal-net-row emp-sal-net-seq-row">
            <span className="emp-sal-net-seq-lbl">➕ Total Allowances</span>
            <span className={`emp-sal-net-seq-val ${calc.totalAllowances > 0 ? 'emp-sal-green' : ''}`}>
              +₹{calc.totalAllowances.toLocaleString('en-IN')}
            </span>
          </div>

          {/* 4 — Total Deductions */}
          <div className="emp-sal-net-row emp-sal-net-seq-row">
            <span className="emp-sal-net-seq-lbl">➖ Total Deductions</span>
            <span className={`emp-sal-net-seq-val ${calc.totalDeductions > 0 ? 'emp-sal-red' : ''}`}>
              −₹{calc.totalDeductions.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="emp-sal-net-divider" />

          {/* NET TOTAL */}
          <div className="emp-sal-net-row">
            <span className="emp-sal-net-lbl">⚡ NET SALARY</span>
            <span className="emp-sal-net-amt">
              ₹{(monthlyCumulative + calc.totalAllowances + calc.incrementAmt - calc.totalDeductions).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* ── Employee read-only payment details ── */}
        {(() => {
          const empMonthKey = `${year}-${month}`;
          const payMark = struct?.paymentMarks?.[empMonthKey];
          return (
            <div className="pay-confirm-section emp-pay-readonly">
              <div className="pay-confirm-hdr">
                <span className="pay-confirm-title">💳 Payment Details</span>
                <span className="pay-confirm-sub">UPI · Receipt · Salary Confirmation</span>
              </div>

              {/* UPI ID — read-only */}
              <div className="pay-confirm-row">
                <span className="pay-confirm-lbl">UPI ID</span>
                <span className="pay-upi-readonly">
                  {struct?.upiId ? struct.upiId : <span className="pay-upi-none">Not set</span>}
                </span>
              </div>

              {/* Receipt — view only */}
              <div className="pay-confirm-row">
                <span className="pay-confirm-lbl">Receipt</span>
                <div className="pay-receipt-wrap">
                  {struct?.receipt ? (
                    <div className="pay-receipt-preview">
                      {struct.receipt.type?.startsWith('image/') ? (
                        <img src={struct.receipt.data} alt="receipt" className="pay-receipt-img" />
                      ) : (
                        <a href={struct.receipt.data} download={struct.receipt.name} className="pay-receipt-link">
                          📄 {struct.receipt.name}
                        </a>
                      )}
                      <span className="pay-receipt-name">{struct.receipt.name}</span>
                    </div>
                  ) : (
                    <span className="pay-upi-none">No receipt uploaded</span>
                  )}
                </div>
              </div>

              {/* Payment status */}
              <div className="pay-mark-row">
                {payMark?.paid ? (
                  <div className="pay-success-msg">
                    <span className="pay-success-icon">✓</span>
                    <div className="pay-success-text">
                      <span className="pay-success-title">MONTHLY SALARY PAID SUCCESSFULLY</span>
                      <span className="pay-success-dt">
                        {new Date(payMark.timestamp).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="pay-unpaid-badge">⏳ SALARY PENDING FOR THIS MONTH</span>
                )}
              </div>
            </div>
          );
        })()}

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
function EmployeeProfileEmpView({ employee, month, year, dailyRecords, setDailyRecords, salaryStructures, employeeSettings, paymentLedger, setPaymentLedger, isAdmin }) {
  const [activeTab, setActiveTab] = useState('attendance');
  // payInput keyed by dateKey — admin's per-row payment amount draft
  const [payInputs, setPayInputs] = useState({});

  const otRate      = getOTRate(employeeSettings, employee.id);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rows = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum    = i + 1;
    const d         = new Date(year, month, dayNum);
    const dateKey   = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
    const record    = dailyRecords[dateKey]?.[employee.id];
    const payment   = record?.status === 'present' ? (record?.payment || 0) : 0;
    const stdH      = record?.standardHours || 8;
    const otHours   = record?.status === 'present' ? (record?.overtimeHours || 0) : 0;
    const utHours   = record?.status === 'present'
      ? calcUnderTime(record?.timeIn, record?.timeOut, stdH)
      : 0;
    const hourlyRate  = stdH > 0 ? payment / stdH : 0;
    const otPay       = parseFloat((otHours * otRate).toFixed(2));
    const utPay       = parseFloat((utHours * hourlyRate).toFixed(2));
    const totalDaily  = Math.max(0, payment + otPay - utPay);
    const paidAmount  = record?.paidAmount || 0;
    const paidStatus  = record?.paidStatus || null;
    return {
      date: dayNum, dayName: DAY_NAMES[d.getDay()], dateKey,
      status: record?.status ?? null, payment,
      otHours, otPay, utHours, utPay, totalDaily, paidAmount, paidStatus,
    };
  });

  // Cumulative = running totalDaily - paid amounts
  let running = 0;
  const enriched = rows.map(r => {
    running += r.totalDaily;
    running -= r.paidAmount;
    return { ...r, cumulative: running };
  });

  const presentCount = rows.filter(r => r.status === 'present').length;
  const absentCount  = rows.filter(r => r.status === 'absent').length;
  const totalPayment = rows.reduce((s, r) => s + r.payment, 0);
  const totalOTPay   = rows.reduce((s, r) => s + r.otPay, 0);
  const totalUTPay   = rows.reduce((s, r) => s + r.utPay, 0);
  const totalAllPay  = rows.reduce((s, r) => s + r.totalDaily, 0);

  // Latest paid date mapping for neutralizing previous buttons
  const latestPaidDateNum = Math.max(0, ...rows.filter(r => r.paidStatus === 'paid').map(r => r.date));

  const handleMarkPaid = (dateKey, amount) => {
    if (!setDailyRecords) return;
    setDailyRecords(prev => {
      const existing = (prev[dateKey] || {})[employee.id] || {};
      return {
        ...prev,
        [dateKey]: {
          ...(prev[dateKey] || {}),
          [employee.id]: { ...existing, paidAmount: Number(amount) || 0, paidStatus: 'paid' },
        },
      };
    });
    setPayInputs(prev => ({ ...prev, [dateKey]: undefined }));
  };

  return (
    <div className="emp-view-preview">
      {/* Stats strip */}
      <div className="stats-strip emp-preview-strip">
        <StatCard label="Days Present"  value={presentCount}                                          accentColor="#00C853" />
        <StatCard label="Days Absent"   value={absentCount}                                           accentColor="#FF1744" />
        <StatCard label="Working Days"  value={daysInMonth}                                           accentColor="#F5A623" />
        <StatCard label="OT Rate"       value={otRate ? `₹${otRate}/hr` : '—'}                       accentColor="#F5A623" />
        <StatCard label="Total Earned"  value={`₹${totalAllPay.toLocaleString('en-IN')}`}            accentColor="#00BFFF" />
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
          employeeSettings={employeeSettings}
        />
      )}

      {/* Attendance table */}
      {activeTab === 'attendance' && (
        <div className="tbl-wrap">
          <table className="att-tbl">
            <thead>
              <tr>
                <th>Date</th><th>Day</th><th>Attendance Status</th>
                <th>Base Pay (₹)</th><th>OT / UT</th><th>Daily Total (₹)</th>
                <th>Cumulative (₹)</th>
                {isAdmin && <th>Payment</th>}
              </tr>
            </thead>
            <tbody>
              {enriched.map(r => {
                const payDraft = payInputs[r.dateKey] !== undefined ? payInputs[r.dateKey] : r.cumulative;
                const isNeutralized = r.date < latestPaidDateNum && r.paidStatus !== 'paid';

                return (
                  <tr key={r.date} className="trow">
                    <td className="td-date">{String(r.date).padStart(2,'0')}</td>
                    <td className="td-day">{r.dayName}</td>
                    <td>
                      {r.status === 'present' ? <span className="badge-off att-present">● PRESENT</span>
                       : r.status === 'absent' ? <span className="badge-off att-absent">● ABSENT</span>
                       : <span className="badge-off att-pending">○ NOT MARKED</span>}
                    </td>
                    <td>
                      <div className="pay-cell">
                        <span className="rupee">₹</span>
                        <span className="cum-amt">{r.payment.toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ot-ut-cell">
                        {r.otHours > 0 && (
                          <div className="ot-cell">
                            <span className="ot-badge ot-green">+{r.otHours}h OT</span>
                            <span className="ot-rate-calc">+{r.otHours}h × ₹{otRate} = <span className="ot-rate-calc-amt">₹{r.otPay.toLocaleString('en-IN')}</span></span>
                          </div>
                        )}
                        {r.utHours > 0 && (
                          <div className="ut-cell">
                            <span className="ut-red">-{r.utHours}h UT</span>
                            <span className="ut-deduct">−₹{r.utPay.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {r.otHours === 0 && r.utHours === 0 && <span className="td-dash">—</span>}
                      </div>
                    </td>
                    <td className="td-cum">
                      <div className="total-daily-cell">
                        <span className="total-daily-amt">₹{r.totalDaily.toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="td-cum">
                      <div className="cum-cell">
                        <span className={`cum-amt ${r.cumulative < 0 ? 'cum-negative' : ''}`}>
                          ₹{r.cumulative.toLocaleString('en-IN')}
                        </span>
                        {r.paidAmount > 0 && (
                          <span className="cum-paid-sub">−₹{r.paidAmount.toLocaleString('en-IN')} paid</span>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td>
                        {r.status === 'present' ? (
                          r.paidStatus === 'paid' ? (
                            <span className="paid-row-badge">✓ PAID ₹{r.paidAmount.toLocaleString('en-IN')}</span>
                          ) : (
                            <div className="pay-action-cell">
                              <div className="pay-cell">
                                <span className="rupee">₹</span>
                                <input
                                  type="number" min="0"
                                  className="pay-inp pay-inp-sm"
                                  value={payDraft}
                                  onChange={e => setPayInputs(prev => ({ ...prev, [r.dateKey]: e.target.value }))}
                                  disabled={isNeutralized}
                                />
                              </div>
                              {isNeutralized ? (
                                <button className="pay-paid-btn pay-paid-btn-neutral" disabled>Neutral</button>
                              ) : (
                                <button
                                  className="pay-paid-btn"
                                  onClick={() => handleMarkPaid(r.dateKey, payDraft)}
                                >Pay Now</button>
                              )}
                            </div>
                          )
                        ) : (
                          <span className="td-dash">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="tfoot-row">
                <td colSpan={3} className="tfoot-lbl">MONTHLY TOTAL</td>
                <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
                <td className="tfoot-amt tfoot-ut">−₹{totalUTPay.toLocaleString('en-IN')}</td>
                <td className="tfoot-amt">₹{totalAllPay.toLocaleString('en-IN')}</td>
                <td className="tfoot-amt">₹{running.toLocaleString('en-IN')}</td>
                {isAdmin && <td></td>}
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
function EmployeeDashboard({ employee, onLogout, dailyRecords, salaryStructures, employeeSettings }) {
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
    const stdH    = record?.standardHours || 8;
    const otHours = (record?.status === 'present' ? (record?.overtimeHours || 0) : 0);
    const utHours = record?.status === 'present'
      ? calcUnderTime(record?.timeIn, record?.timeOut, stdH)
      : 0;
    const hourlyRate = stdH > 0 ? payment / stdH : 0;
    const otPay     = parseFloat((otHours * otRate).toFixed(2));
    const utPay     = parseFloat((utHours * hourlyRate).toFixed(2));
    const paidAmount = record?.paidAmount || 0;
    const paidStatus = record?.paidStatus || null;
    return {
      date:       dayNum,
      dayName:    DAY_NAMES[d.getDay()],
      status:     record?.status ?? null,
      payment,
      otHours,
      otPay,
      utHours,
      utPay,
      paidAmount,
      paidStatus,
      totalDaily: Math.max(0, payment + otPay - utPay),
    };
  });

  let runningTotal = 0;
  const enriched = rows.map(r => {
    runningTotal += r.totalDaily;
    runningTotal -= r.paidAmount;
    return { ...r, cumulative: runningTotal };
  });

  const workingDays        = rows.length;
  const presentCount       = rows.filter(r => r.status === 'present').length;
  const absentCount        = rows.filter(r => r.status === 'absent').length;
  const totalPayment       = rows.reduce((s, r) => s + r.payment, 0);
  const totalOTHours       = rows.reduce((s, r) => s + r.otHours, 0);
  const totalOTPay         = rows.reduce((s, r) => s + r.otPay, 0);
  const totalUTPay         = rows.reduce((s, r) => s + r.utPay, 0);
  const totalAllPay        = rows.reduce((s, r) => s + r.totalDaily, 0);

  return (
    <div className="dashboard">

      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="hdr-brand">
          <img src={CME_LOGO} alt="CME Logo" className="hdr-logo-img" />
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
          employeeSettings={employeeSettings}
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
              <th>Base Pay (₹)</th>
              <th>OT / UT</th>
              <th>Daily Total (₹)</th>
              <th>Cumulative (₹)</th>
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
                  <div className="pay-cell">
                    <span className="rupee">₹</span>
                    <span className="cum-amt">{r.payment.toLocaleString('en-IN')}</span>
                  </div>
                </td>
                <td>
                  <div className="ot-ut-cell">
                    {r.otHours > 0 && (
                      <div className="ot-cell">
                        <span className="ot-badge ot-green">+{r.otHours}h OT</span>
                        <span className="ot-rate-calc">+{r.otHours}h × ₹{otRate} = <span className="ot-rate-calc-amt">₹{r.otPay.toLocaleString('en-IN')}</span></span>
                      </div>
                    )}
                    {r.utHours > 0 && (
                      <div className="ut-cell">
                        <span className="ut-red">-{r.utHours}h UT</span>
                        <span className="ut-deduct">−₹{r.utPay.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {r.otHours === 0 && r.utHours === 0 && <span className="td-dash">—</span>}
                  </div>
                </td>
                <td className="td-cum">
                  <div className="total-daily-cell">
                    <span className="total-daily-amt">₹{r.totalDaily.toLocaleString('en-IN')}</span>
                  </div>
                </td>
                <td className="td-cum">
                  <div className="cum-cell">
                    <span className={`cum-amt ${r.cumulative < 0 ? 'cum-negative' : ''}`}>
                      ₹{r.cumulative.toLocaleString('en-IN')}
                    </span>
                    {r.paidAmount > 0 && (
                      <span className="cum-paid-sub">
                        {r.paidStatus === 'paid' ? '✓ Paid Till Now' : `−₹${r.paidAmount.toLocaleString('en-IN')}`}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-row">
              <td colSpan={3} className="tfoot-lbl">MONTHLY TOTAL</td>
              <td className="tfoot-amt">₹{totalPayment.toLocaleString('en-IN')}</td>
              <td className="tfoot-amt tfoot-ut">−₹{totalUTPay.toLocaleString('en-IN')}</td>
              <td className="tfoot-amt">₹{totalAllPay.toLocaleString('en-IN')}</td>
              <td className="tfoot-amt">₹{runningTotal.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      )}

    </div>
  );
}


// ─── localStorage helpers ────────────────────────────────────────
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function usePersisted(key, fallback) {
  const [state, setState] = useState(() => lsGet(key, fallback));
  const setPersisted = React.useCallback(valOrFn => {
    setState(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      lsSet(key, next);
      return next;
    });
  }, [key]);
  return [state, setPersisted];
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
function App() {
  const [employees,        setEmployeesRaw]     = useState(() => lsGet('cme_employees', INITIAL_EMPLOYEES));
  const [user,             setUser]             = useState(null);
  const [err,              setErr]              = useState('');
  const [dailyRecords,     setDailyRecords]     = usePersisted('cme_dailyRecords', {});
  // Character profiles — keyed by employee ID, admin-only, never exposed to EmployeeDashboard
  const [characterProfiles, setCharacterProfiles] = usePersisted('cme_characterProfiles', {});
  const [salaryStructures, setSalaryStructures] = usePersisted('cme_salaryStructures', {});
  // Per-employee settings (OT rate, etc.) — persisted so rate carries across days & sessions
  const [employeeSettings, setEmployeeSettings] = usePersisted('cme_employeeSettings', {});
  // Payment ledger — tracks admin pay-outs; employee sees read-only
  const [paymentLedger,    setPaymentLedger]    = usePersisted('cme_paymentLedger', {});
  // Worksites — managed by admin
  const [worksites,        setWorksites]        = usePersisted('cme_worksites', [
    { id: 'site_1', name: 'Delhi' },
    { id: 'site_2', name: 'Varanasi' },
  ]);

  // Persist employees (wrap raw setter)
  const setEmployees = React.useCallback(valOrFn => {
    setEmployeesRaw(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      lsSet('cme_employees', next);
      return next;
    });
  }, []);

  const handleLogin = (id, pwd) => {
    const emp = employees.find(e =>
      e.loginId.toLowerCase() === id.toLowerCase() && e.password === pwd
    );
    if (emp) { setUser(emp); setErr(''); }
    else     { setErr('Invalid Login ID or Password. Please try again.'); }
  };

  const handleLogout = () => { setUser(null); setErr(''); };

  // Main admin = anyone with role 'Administrator' (the ADMIN account)
  // Admin Manager = secondary admin, cannot manage other admin managers
  const isMainAdmin   = user?.role === 'Administrator';
  const isAdminAccess = user?.role === 'Administrator' || user?.role === 'Admin Manager';

  return (
    <div className="App">
      {!user && <LoginPage onLogin={handleLogin} error={err} />}

      {user && isAdminAccess && (
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
          worksites={worksites}
          setWorksites={setWorksites}
          isMainAdmin={isMainAdmin}
        />
      )}

      {/* Character profile is intentionally NOT passed here */}
      {user && !isAdminAccess && (
        <EmployeeDashboard
          employee={user}
          onLogout={handleLogout}
          dailyRecords={dailyRecords}
          salaryStructures={salaryStructures}
          employeeSettings={employeeSettings}
        />
      )}
    </div>
  );
}

export default App;