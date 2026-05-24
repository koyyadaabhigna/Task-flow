const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getWeekly,
  getPriority,
  getMonthly,
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/summary', getSummary);
router.get('/weekly', getWeekly);
router.get('/priority', getPriority);
router.get('/monthly', getMonthly);

module.exports = router;
