const mongoose = require('mongoose');

const AllowanceSchema = new mongoose.Schema({
  id    : String,
  label : String,
  amount: { type: Number, default: 0 },
}, { _id: false });

const SalaryStructureSchema = new mongoose.Schema({
  employeeId  : { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
  dailyRate   : { type: Number, default: 0 },
  allowances  : { type: [AllowanceSchema], default: [] },
  deductions  : { type: [AllowanceSchema], default: [] },
  increment   : {
    type  : { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
    value : { type: Number, default: 0 },
  },
  upiId       : { type: String, default: '' },
  receipt     : {
    name: String,
    type: String,       // MIME type
    data: String,       // base64
  },
  // paymentMarks: { "YYYY-M": { timestamp: ISO } }
  paymentMarks: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('SalaryStructure', SalaryStructureSchema);
