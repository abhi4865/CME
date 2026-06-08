const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
} = require('../controllers/employeeController');

router.get ('/',     protect, getEmployees);
router.get ('/:id',  protect, isAdmin, getEmployee);
router.post('/',     protect, isAdmin, createEmployee);
router.put ('/:id',  protect, isAdmin, updateEmployee);
router.delete('/:id',protect, isAdmin, deleteEmployee);

module.exports = router;
