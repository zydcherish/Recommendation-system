const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const {
  createOrder,
  getUserOrders,
  getOrderDetail,
  cancelOrder,
  payOrder
} = require('../controllers/orderController');

// 所有订单路由都需要认证
router.use(verifyToken);

// 创建订单
router.post('/', createOrder);

// 获取用户订单列表
router.get('/', getUserOrders);

// 获取订单详情
router.get('/:id', getOrderDetail);

// 取消订单
router.post('/:id/cancel', cancelOrder);

// 支付订单
router.post('/:id/pay', payOrder);

module.exports = router; 