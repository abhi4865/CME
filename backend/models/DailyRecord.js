const mongoose = require('mongoose');

// Mirrors: cme_dailyRecords["YYYY-MM-DD"][empId]
const DayRecordSchema = new mongoose.Schema({
  status       : { type: String, enum: ['present', 'absent', null], default: null },
  payment      : { type: Number, default: 0 },
  paymentSet   : { type: Boolean, default: false },
  timeIn       : { type: String, default: '' },   // 'HH:MM'
  timeOut      : { type: String, default: '' },   // 'HH:MM'
  standardHours: { type: Number, default: 8 },
  overtimeHours: { type: Number, default: 0 },
  worksite     : { type: String, default: '' },
  paidAmount   : { type: Number, default: 0 },
}, { _id: false });

const DailyRecordSchema = new mongoose.Schema({
  dateKey   : { type: String, required: true },        // 'YYYY-MM-DD'
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  record    : { type: DayRecordSchema, default: () => ({}) },
}, { timestamps: true });

// Compound unique index: one record per employee per day
DailyRecordSchema.index({ dateKey: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('DailyRecord', DailyRecordSchema);
