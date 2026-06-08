const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema({
  loginId    : { type: String, required: true, unique: true, uppercase: true, trim: true },
  password   : { type: String, required: true },
  name       : { type: String, required: true, trim: true },
  role       : { type: String, required: true, trim: true },
  email      : { type: String, trim: true, lowercase: true },
  department : { type: String, trim: true },
  siteId     : { type: String, default: null },
}, { timestamps: true });

// Hash password before save
EmployeeSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
EmployeeSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Never expose password in JSON responses
EmployeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Employee', EmployeeSchema);