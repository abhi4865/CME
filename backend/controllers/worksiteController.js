const Worksite = require('../models/Worksite');

// GET /api/worksites
const getWorksites = async (req, res) => {
  try {
    const sites = await Worksite.find().sort({ siteId: 1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/worksites  — admin only
const createWorksite = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name required' });

    // Auto-generate a siteId
    const count  = await Worksite.countDocuments();
    const siteId = `site_${count + 1}_${Date.now()}`;

    const site = await Worksite.create({ siteId, name });
    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/worksites/:siteId  — rename, admin only
const updateWorksite = async (req, res) => {
  try {
    const site = await Worksite.findOneAndUpdate(
      { siteId: req.params.siteId },
      { $set: { name: req.body.name } },
      { new: true }
    );
    if (!site) return res.status(404).json({ message: 'Worksite not found' });
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/worksites/:siteId  — admin only (attendance records unaffected)
const deleteWorksite = async (req, res) => {
  try {
    const site = await Worksite.findOneAndDelete({ siteId: req.params.siteId });
    if (!site) return res.status(404).json({ message: 'Worksite not found' });
    res.json({ message: 'Worksite deleted', siteId: req.params.siteId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWorksites, createWorksite, updateWorksite, deleteWorksite };
