const Employee = require('../models/Employee');

// GET /api/employees  — admin: all; employee: own record only
const getEmployees = async (req, res) => {
  try {
    const isAdmin = ['Administrator','Admin Manager'].includes(req.user.role);
    if (isAdmin) {
      const list = await Employee.find().sort({ loginId: 1 });
      return res.json(list);
    }
    // Non-admin gets only their own profile (no character data — that stays in CharacterProfile)
    res.json([req.user]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/employees  — admin only
const createEmployee = async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Login ID already exists' });
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/employees/:id  — admin only
const updateEmployee = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    // Only update password if a new one is explicitly provided
    Object.assign(emp, rest);
    if (password) emp.password = password;   // pre-save will hash it

    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/employees/:id  — admin only
const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
