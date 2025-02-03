const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// 统一登录路由
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

module.exports = router; 