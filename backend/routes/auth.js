const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// 用户登录路由
router.post('/user/login', authController.userLogin);
router.post('/admin/login', authController.adminLogin);
router.post('/logout', verifyToken, authController.logout);

// 用户信息路由
router.get('/user/info', verifyToken, authController.getUserInfo);
router.put('/user/info', verifyToken, authController.updateUserInfo);
router.post('/user/change-password', verifyToken, authController.changePassword);

module.exports = router; 