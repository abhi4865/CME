const mongoose = require('mongoose');

const PayEventSchema = new mongoose.Schema({
  date     : { type: String, required: true },   // 'YYYY-MM-DD'
  amount   : { type: Number, required: true },
  timestamp: { type: String, required: true },   // ISO string
}, { _id: false });

const PaymentLedgerSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
  events    : { type: [PayEventSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('PaymentLedger', PaymentLedgerSchema);
