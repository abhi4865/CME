const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getSettings, getAllSettings, upsertSettings } = require('../controllers/settingsController');

router.get('/',        protect, isAdmin, getAllSettings);
router.get('/:empId',  protect,          getSettings);
router.put('/:empId',  protect, isAdmin, upsertSettings);

module.exports = router;
