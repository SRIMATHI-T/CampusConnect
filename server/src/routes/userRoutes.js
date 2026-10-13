const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const controller = require('../controllers/userController');
router.get('/', auth, role('admin'), controller.list);
router.patch('/me', auth, controller.updateProfile);
module.exports = router;
