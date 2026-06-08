const DailyRecord = require('../models/DailyRecord');
const Employee    = require('../models/Employee');

// GET /api/attendance?year=2025&month=5
// Returns all records for the month, shaped as: { "YYYY-MM-DD": { [empId]: record } }
const getMonthRecords = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || month === undefined)
      return res.status(400).json({ message: 'year and month required' });

    const y = parseInt(year);
    const m = parseInt(month);  // 0-based like JS Date

    // Build all date keys in this month
    const totalDays = new Date(y, m + 1, 0).getDate();
    const dateKeys  = Array.from({ length: totalDays }, (_, i) => {
      const d = String(i + 1).padStart(2, '0');
      const mo = String(m + 1).padStart(2, '0');
      return `${y}-${mo}-${d}`;
    });

    const records = await DailyRecord.find({ dateKey: { $in: dateKeys } });

    // Shape: { "YYYY-MM-DD": { [empId]: DayRecord } }
    const shaped = {};
    for (const r of records) {
      if (!shaped[r.dateKey]) shaped[r.dateKey] = {};
      shaped[r.dateKey][r.employeeId.toString()] = r.record;
    }

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance/:dateKey  — single day, all employees
const getDayRecords = async (req, res) => {
  try {
    const records = await DailyRecord.find({ dateKey: req.params.dateKey });
    const shaped  = {};
    for (const r of records) shaped[r.employeeId.toString()] = r.record;
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/attendance/:dateKey/:empId  — upsert a single DayRecord
const upsertDayRecord = async (req, res) => {
  try {
    const { dateKey, empId } = req.params;

    const updated = await DailyRecord.findOneAndUpdate(
      { dateKey, employeeId: empId },
      { $set: { record: req.body } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ [empId]: updated.record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/attendance/:dateKey  — bulk upsert for an entire day
// Body: { [empId]: DayRecord, ... }
const upsertDayBulk = async (req, res) => {
  try {
    const { dateKey } = req.params;
    const entries = Object.entries(req.body);  // [[empId, record], ...]

    const ops = entries.map(([empId, record]) => ({
      updateOne: {
        filter: { dateKey, employeeId: empId },
        update: { $set: { record } },
        upsert: true,
      },
    }));

    if (ops.length) await DailyRecord.bulkWrite(ops);

    res.json({ message: `${ops.length} records saved for ${dateKey}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMonthRecords, getDayRecords, upsertDayRecord, upsertDayBulk };
