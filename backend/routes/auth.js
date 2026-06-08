const router = require('express').Router();
const { login, seed } = require('../controllers/authController');

router.post('/login', login);
router.post('/seed',  seed);   // Run once — populates DB with default employees & worksites

module.exports = router;
