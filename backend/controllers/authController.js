const jwt      = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Worksite = require('../models/Worksite');

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
    const count = await Employee.countDocuments();
    if (count > 0)
      return res.json({ message: 'DB already seeded — skipping.' });

    const INITIAL = [
      { loginId:'EMP001', password:'pass001', name:'Rajesh Kumar', role:'Senior Electrician', email:'rajesh@cme.com', department:'Field Operations', siteId:'site_1' },
      { loginId:'EMP002', password:'pass002', name:'Priya Sharma',  role:'Site Supervisor',   email:'priya@cme.com',  department:'Site Management',  siteId:'site_1' },
      { loginId:'EMP003', password:'pass003', name:'Amit Singh',    role:'Technician',         email:'amit@cme.com',   department:'Technical',        siteId:'site_2' },
      { loginId:'EMP004', password:'pass004', name:'Sunita Verma',  role:'Electrician',        email:'sunita@cme.com', department:'Field Operations', siteId:'site_2' },
      { loginId:'ADMIN',  password:'admin123',name:'Main Admin',    role:'Administrator',      email:'admin@cme.com',  department:'Management',       siteId:null    },
    ];

    for (const emp of INITIAL) {
      await Employee.create(emp);
    }

    const sitesCount = await Worksite.countDocuments();
    if (sitesCount === 0) {
      await Worksite.insertMany([
        { siteId: 'site_1', name: 'Delhi' },
        { siteId: 'site_2', name: 'Varanasi' },
      ]);
    }

    res.json({ message: 'Seeded 5 employees + 2 worksites successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── EXPORTS ───────────────────────────────────────────────────────
module.exports = { login, seed };  // ← THIS WAS MISSING