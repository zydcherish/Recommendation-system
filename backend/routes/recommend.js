const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

// 获取推荐产品列表
router.get('/products', recommendController.getRecommendProducts);

// 添加搜索路由
router.get('/search', recommendController.searchProducts);

module.exports = router;