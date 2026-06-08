const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getSalary, getAllSalaries, upsertSalary, markAsPaid } = require('../controllers/salaryController');

router.get ('/',                         protect, isAdmin,  getAllSalaries);
router.get ('/:empId',                   protect,           getSalary);
router.put ('/:empId',                   protect, isAdmin,  upsertSalary);
router.patch('/:empId/payment-mark',     protect, isAdmin,  markAsPaid);

module.exports = router;
