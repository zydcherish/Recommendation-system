const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// 需要验证token和管理员权限
router.use(verifyToken);
router.use(verifyAdmin);

// 用户管理路由
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// 订单管理
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.post('/orders/:id/cancel', adminController.cancelOrder);

// 其他管理员路由...
router.get('/statistics', adminController.getStatistics);

// 资源管理路由
router.get('/resources', adminController.getResources);
router.post('/resources', adminController.createResource);
router.put('/resources/:id', adminController.updateResource);
router.put('/resources/:id/status', adminController.updateResourceStatus);
router.delete('/resources/:id', adminController.deleteResource);

module.exports = router;