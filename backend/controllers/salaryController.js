const SalaryStructure = require('../models/SalaryStructure');

// GET /api/salary/:empId
const getSalary = async (req, res) => {
  try {
    const struct = await SalaryStructure.findOne({ employeeId: req.params.empId });
    if (!struct) return res.json(null);
    res.json(struct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/salary  — all salary structures (admin)
const getAllSalaries = async (req, res) => {
  try {
    const list = await SalaryStructure.find();
    // Return as { [empId]: structure } to match frontend shape
    const shaped = {};
    for (const s of list) shaped[s.employeeId.toString()] = s;
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/salary/:empId  — upsert full salary structure
const upsertSalary = async (req, res) => {
  try {
    const updated = await SalaryStructure.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $set: req.body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/salary/:empId/payment-mark  — stamp paymentMarks["YYYY-M"]
const markAsPaid = async (req, res) => {
  try {
    const { periodKey, timestamp } = req.body;  // periodKey e.g. "2025-5"
    if (!periodKey) return res.status(400).json({ message: 'periodKey required' });

    const updated = await SalaryStructure.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $set: { [`paymentMarks.${periodKey}`]: { timestamp } } },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSalary, getAllSalaries, upsertSalary, markAsPaid };
