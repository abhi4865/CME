const mongoose = require('mongoose');

// All 16 rating fields (0–5 stars)
const CharacterProfileSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },

  // Work Performance
  workQuality   : { type: Number, default: 0, min: 0, max: 5 },
  punctuality   : { type: Number, default: 0, min: 0, max: 5 },
  taskCompletion: { type: Number, default: 0, min: 0, max: 5 },
  initiative    : { type: Number, default: 0, min: 0, max: 5 },

  // Work Behaviour
  discipline      : { type: Number, default: 0, min: 0, max: 5 },
  professionalism : { type: Number, default: 0, min: 0, max: 5 },
  teamwork        : { type: Number, default: 0, min: 0, max: 5 },
  communication   : { type: Number, default: 0, min: 0, max: 5 },

  // Good Qualities
  positiveAttitude: { type: Number, default: 0, min: 0, max: 5 },
  reliability     : { type: Number, default: 0, min: 0, max: 5 },
  adaptability    : { type: Number, default: 0, min: 0, max: 5 },
  workHabits      : { type: Number, default: 0, min: 0, max: 5 },

  // Concerns (1 = bad, 5 = none)
  misconduct  : { type: Number, default: 0, min: 0, max: 5 },
  attitudeRisk: { type: Number, default: 0, min: 0, max: 5 },
  absenteeism : { type: Number, default: 0, min: 0, max: 5 },
  conflictRisk: { type: Number, default: 0, min: 0, max: 5 },

  notes      : { type: String, default: '' },
  lastUpdated: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('CharacterProfile', CharacterProfileSchema);
