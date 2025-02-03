const express = require('express');
const router = express.Router();

// 测试路由
router.get('/test', (req, res) => {
  res.json({ message: '路由工作正常！' });
});

module.exports = router; 