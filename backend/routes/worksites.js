const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getWorksites, createWorksite, updateWorksite, deleteWorksite } = require('../controllers/worksiteController');

router.get   ('/',           protect,          getWorksites);
router.post  ('/',           protect, isAdmin, createWorksite);
router.put   ('/:siteId',    protect, isAdmin, updateWorksite);
router.delete('/:siteId',    protect, isAdmin, deleteWorksite);

module.exports = router;
