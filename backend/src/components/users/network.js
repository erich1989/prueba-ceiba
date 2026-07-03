const express = require('express');
const response = require('../../network/response');
const controller = require('./controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { strictRateLimiter } = require('../../middleware/rateLimiterMiddleware');

const router = express.Router();

router.post('/register', strictRateLimiter, async (req, res) => {
  try {
    const user = await controller.registerUser(req.body);
    response.success(req, res, user, 201);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/login', strictRateLimiter, async (req, res) => {
  try {
    const sessionData = await controller.loginUser(req.body);
    response.success(req, res, sessionData, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const profile = await controller.getUserProfile(req.user.id);
    response.success(req, res, profile, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

module.exports = router;
