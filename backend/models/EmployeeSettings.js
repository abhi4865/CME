const mongoose = require('mongoose');

const EmployeeSettingsSchema = new mongoose.Schema({
  employeeId   : { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
  overtimeRate : { type: Number, default: 0 },   // ₹/hr
}, { timestamps: true });

module.exports = mongoose.model('EmployeeSettings', EmployeeSettingsSchema);
