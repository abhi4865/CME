const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getProfile, getAllProfiles, upsertProfile } = require('../controllers/characterController');

// All character profile routes are admin-only
router.get ('/',       protect, isAdmin, getAllProfiles);
router.get ('/:empId', protect, isAdmin, getProfile);
router.put ('/:empId', protect, isAdmin, upsertProfile);

module.exports = router;
