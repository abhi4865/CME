const mongoose = require('mongoose');

const WorksiteSchema = new mongoose.Schema({
  siteId: { type: String, required: true, unique: true },   // 'site_1', 'site_2', ...
  name  : { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Worksite', WorksiteSchema);
