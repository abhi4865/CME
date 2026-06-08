const EmployeeSettings = require('../models/EmployeeSettings');

// GET /api/settings/:empId
const getSettings = async (req, res) => {
  try {
    const s = await EmployeeSettings.findOne({ employeeId: req.params.empId });
    res.json(s || { overtimeRate: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/settings  — all settings (admin), shaped as { [empId]: { overtimeRate } }
const getAllSettings = async (req, res) => {
  try {
    const list = await EmployeeSettings.find();
    const shaped = {};
    for (const s of list) shaped[s.employeeId.toString()] = { overtimeRate: s.overtimeRate };
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/settings/:empId  — upsert, admin only
const upsertSettings = async (req, res) => {
  try {
    const updated = await EmployeeSettings.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $set: req.body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSettings, getAllSettings, upsertSettings };
