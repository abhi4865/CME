const PaymentLedger = require('../models/PaymentLedger');

// GET /api/payment/:empId
const getLedger = async (req, res) => {
  try {
    const ledger = await PaymentLedger.findOne({ employeeId: req.params.empId });
    res.json(ledger ? ledger.events : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/payment  — all ledgers (admin), shaped as { [empId]: events[] }
const getAllLedgers = async (req, res) => {
  try {
    const list = await PaymentLedger.find();
    const shaped = {};
    for (const l of list) shaped[l.employeeId.toString()] = l.events;
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payment/:empId  — add a PayEvent
const addPayEvent = async (req, res) => {
  try {
    const { date, amount, timestamp } = req.body;
    if (!date || amount === undefined)
      return res.status(400).json({ message: 'date and amount required' });

    const payEvent = { date, amount, timestamp: timestamp || new Date().toISOString() };

    const ledger = await PaymentLedger.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $push: { events: payEvent } },
      { upsert: true, new: true }
    );
    res.status(201).json(ledger.events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/payment/:empId/event  — remove a specific event by timestamp
const removePayEvent = async (req, res) => {
  try {
    const { timestamp } = req.body;
    const ledger = await PaymentLedger.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $pull: { events: { timestamp } } },
      { new: true }
    );
    res.json(ledger ? ledger.events : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLedger, getAllLedgers, addPayEvent, removePayEvent };
