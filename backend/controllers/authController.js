const jwt              = require('jsonwebtoken');
const Employee         = require('../models/Employee');
const Worksite         = require('../models/Worksite');
const SalaryStructure  = require('../models/SalaryStructure');
const EmployeeSettings = require('../models/EmployeeSettings');
const CharacterProfile = require('../models/CharacterProfile');
const PaymentLedger    = require('../models/PaymentLedger');

// ── POST /api/auth/login ──────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password)
      return res.status(400).json({ message: 'loginId and password required' });

    const emp = await Employee.findOne({ loginId: loginId.toUpperCase() });
    if (!emp)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await emp.matchPassword(password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: emp._id, role: emp.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      employee: {
        id:         emp._id,
        loginId:    emp.loginId,
        name:       emp.name,
        role:       emp.role,
        email:      emp.email,
        department: emp.department,
        siteId:     emp.siteId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/auth/seed ───────────────────────────────────────────
const seed = async (req, res) => {
  try {
    const results = [];
    
    // FIX: Added a reset flag. If the URL has ?reset=true, we clear the DB first.
    const reset = req.query.reset === 'true';
    if (reset) {
      await Employee.deleteMany({});
      await Worksite.deleteMany({});
      await SalaryStructure.deleteMany({});
      await EmployeeSettings.deleteMany({});
      await CharacterProfile.deleteMany({});
      await PaymentLedger.deleteMany({});
      results.push('🧹 Existing data wiped clean for fresh seed.');
    }

    // ── 1. EMPLOYEES ──────────────────────────────────────────────
    const empCount = await Employee.countDocuments();
    let employees = [];
    if (empCount === 0) {
      const INITIAL = [
        { loginId:'EMP001', password:'pass001', name:'Rajesh Kumar', role:'Senior Electrician', email:'rajesh@cme.com', department:'Field Operations', siteId:'site_1' },
        { loginId:'EMP002', password:'pass002', name:'Priya Sharma',  role:'Site Supervisor',   email:'priya@cme.com',  department:'Site Management',  siteId:'site_1' },
        { loginId:'EMP003', password:'pass003', name:'Amit Singh',    role:'Technician',        email:'amit@cme.com',   department:'Technical',        siteId:'site_2' },
        { loginId:'EMP004', password:'pass004', name:'Sunita Verma',  role:'Electrician',       email:'sunita@cme.com', department:'Field Operations', siteId:'site_2' },
        { loginId:'ADMIN',  password:'admin123',name:'Main Admin',    role:'Administrator',     email:'admin@cme.com',  department:'Management',       siteId:null    },
      ];
      for (const emp of INITIAL) employees.push(await Employee.create(emp));
      results.push('✓ 5 employees');
    } else {
      employees = await Employee.find({});
      results.push(`— employees skipped (${empCount} exist)`);
    }

    // ── 2. WORKSITES ──────────────────────────────────────────────
    const sitesCount = await Worksite.countDocuments();
    if (sitesCount === 0) {
      await Worksite.insertMany([
        { siteId: 'site_1', name: 'Delhi' },
        { siteId: 'site_2', name: 'Varanasi' },
      ]);
      results.push('✓ 2 worksites');
    } else {
      results.push(`— worksites skipped (${sitesCount} exist)`);
    }

    // ── 3. SALARY STRUCTURES ──────────────────────────────────────
    const salaryCount = await SalaryStructure.countDocuments();
    if (salaryCount === 0) {
      const ROLE_RATES = {
        'Senior Electrician': 800,
        'Site Supervisor':    1100,
        'Technician':         650,
        'Electrician':        600,
        'Administrator':      1600,
      };
      const DEFAULT_ALLOWANCES = [
        { id: 'ta',    label: 'Travelling Allowance',   amount: 0 },
        { id: 'da',    label: 'Dearness Allowance',     amount: 0 },
        { id: 'hra',   label: 'House Rent Allowance',   amount: 0 },
        { id: 'med',   label: 'Medical Allowance',      amount: 0 },
        { id: 'ot',    label: 'Overtime Pay',           amount: 0 },
        { id: 'bonus', label: 'Performance Bonus',      amount: 0 },
      ];
      const DEFAULT_DEDUCTIONS = [
        { id: 'pf',   label: 'Provident Fund',           amount: 0 },
        { id: 'esi',  label: 'Employee State Insurance', amount: 0 },
        { id: 'tds',  label: 'Tax Deduction',            amount: 0 },
        { id: 'late', label: 'Late / Absence Deduction', amount: 0 },
      ];

      await SalaryStructure.insertMany(
        employees.map(emp => ({
          employeeId:   emp._id,
          dailyRate:    ROLE_RATES[emp.role] || 500,
          allowances:   DEFAULT_ALLOWANCES.map(a => ({ ...a })),
          deductions:   DEFAULT_DEDUCTIONS.map(d => ({ ...d })),
          increment:    { type: 'fixed', value: 0 },
          upiId:        '',
          paymentMarks: {},
        }))
      );
      results.push('✓ 5 salary structures');
    } else {
      results.push(`— salary structures skipped (${salaryCount} exist)`);
    }

    // ── 4. EMPLOYEE SETTINGS ──────────────────────────────────────
    const settingsCount = await EmployeeSettings.countDocuments();
    if (settingsCount === 0) {
      const OT_RATES = {
        'Senior Electrician': 120,
        'Site Supervisor':    160,
        'Technician':         100,
        'Electrician':         90,
        'Administrator':      200,
      };
      await EmployeeSettings.insertMany(
        employees.map(emp => ({
          employeeId:   emp._id,
          overtimeRate: OT_RATES[emp.role] || 0,
        }))
      );
      results.push('✓ 5 employee settings');
    } else {
      results.push(`— employee settings skipped (${settingsCount} exist)`);
    }

    // ── 5. CHARACTER PROFILES ─────────────────────────────────────
    const charCount = await CharacterProfile.countDocuments();
    if (charCount === 0) {
      await CharacterProfile.insertMany(
        employees.map(emp => ({
          employeeId:      emp._id,
          workQuality:     0, punctuality:    0, taskCompletion: 0, initiative:    0,
          discipline:      0, professionalism:0, teamwork:       0, communication: 0,
          positiveAttitude:0, reliability:    0, adaptability:   0, workHabits:    0,
          misconduct:      0, attitudeRisk:   0, absenteeism:    0, conflictRisk:  0,
          notes:           '',
          lastUpdated:     null,
        }))
      );
      results.push('✓ 5 character profiles');
    } else {
      results.push(`— character profiles skipped (${charCount} exist)`);
    }

    // ── 6. PAYMENT LEDGERS ────────────────────────────────────────
    const ledgerCount = await PaymentLedger.countDocuments();
    if (ledgerCount === 0) {
      await PaymentLedger.insertMany(
        employees.map(emp => ({
          employeeId: emp._id,
          events:     [],
        }))
      );
      results.push('✓ 5 payment ledgers');
    } else {
      results.push(`— payment ledgers skipped (${ledgerCount} exist)`);
    }

    res.json({ message: results.join('\n') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/employees/:id (EDIT EMPLOYEE) ────────────────────────
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { loginId, name, role, email, department, siteId } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    if (loginId) {
      const duplicate = await Employee.findOne({
        loginId: loginId.toUpperCase(),
        _id: { $ne: id } 
      });

      if (duplicate) {
        return res.status(400).json({ message: `${loginId} is already exist.` });
      }
    }

    const updatedEmp = await Employee.findByIdAndUpdate(
      id,
      { 
        ...(loginId && { loginId: loginId.toUpperCase() }), 
        name, 
        role, 
        email, 
        department, 
        siteId 
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmp) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json({ message: 'Employee updated successfully.', employee: updatedEmp });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/employees/:id (DELETE EMPLOYEE) ───────────────────
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'A valid Employee ID must be provided to delete.' });
    }

    const deletedEmp = await Employee.findByIdAndDelete(id);

    if (!deletedEmp) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // Cascading deletes to ensure clean removal
    await Promise.all([
      SalaryStructure.deleteOne({ employeeId: id }),
      EmployeeSettings.deleteOne({ employeeId: id }),
      CharacterProfile.deleteOne({ employeeId: id }),
      PaymentLedger.deleteOne({ employeeId: id })
    ]);

    res.status(200).json({ message: 'Employee and all associated records deleted successfully.' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── EXPORTS ───────────────────────────────────────────────────────
module.exports = { login, seed, updateEmployee, deleteEmployee };