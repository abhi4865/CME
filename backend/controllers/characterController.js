const CharacterProfile = require('../models/CharacterProfile');

// GET /api/character/:empId  — admin only
const getProfile = async (req, res) => {
  try {
    const profile = await CharacterProfile.findOne({ employeeId: req.params.empId });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/character  — all profiles (admin)
const getAllProfiles = async (req, res) => {
  try {
    const list = await CharacterProfile.find();
    const shaped = {};
    for (const p of list) shaped[p.employeeId.toString()] = p;
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/character/:empId  — upsert, admin only
const upsertProfile = async (req, res) => {
  try {
    const data = { ...req.body, lastUpdated: new Date() };
    const updated = await CharacterProfile.findOneAndUpdate(
      { employeeId: req.params.empId },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, getAllProfiles, upsertProfile };
