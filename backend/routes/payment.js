const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getLedger, getAllLedgers, addPayEvent, removePayEvent } = require('../controllers/paymentController');

router.get   ('/',              protect, isAdmin, getAllLedgers);
router.get   ('/:empId',        protect,          getLedger);
router.post  ('/:empId',        protect, isAdmin, addPayEvent);
router.delete('/:empId/event',  protect, isAdmin, removePayEvent);

module.exports = router;
