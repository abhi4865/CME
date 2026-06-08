const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getMonthRecords, getDayRecords, upsertDayRecord, upsertDayBulk
} = require('../controllers/attendanceController');

router.get('/',                       protect, getMonthRecords);       // ?year=&month=
router.get('/:dateKey',               protect, getDayRecords);
router.put('/:dateKey',               protect, isAdmin, upsertDayBulk);
router.put('/:dateKey/:empId',        protect, isAdmin, upsertDayRecord);

module.exports = router;
