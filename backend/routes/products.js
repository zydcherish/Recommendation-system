const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 获取产品列表
router.get('/', productController.getProducts);

// 获取产品详情
router.get('/:id', productController.getProductDetail);

module.exports = router; 