const router = require('express').Router();
const { signup, login, me } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const limiter = require('../middleware/rateLimiter');
const { validateSignup, validateLogin } = require('../validators/authValidator');
router.post('/signup', limiter, validateSignup, signup);
router.post('/login', limiter, validateLogin, login);
router.get('/me', auth, me);
module.exports = router;
