const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/auth');

// 获取用户个人信息
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, phone, type, registration_date, last_login, status FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 更新用户个人信息
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const updateFields = [];
    const params = [];

    if (username) {
      updateFields.push('username = ?');
      params.push(username);
    }

    if (email) {
      updateFields.push('email = ?');
      params.push(email);
    }

    if (phone) {
      updateFields.push('phone = ?');
      params.push(phone);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: '没有要更新的字段' });
    }

    params.push(req.user.id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await db.query(query, params);

    // 获取更新后的用户信息
    const [users] = await db.query(
      'SELECT id, username, email, phone, type, registration_date, last_login, status FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ message: '更新用户信息失败' });
  }
});

// 获取用户订单
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, r.name as resource_name, r.cpu, r.memory, r.storage 
       FROM orders o 
       LEFT JOIN resources r ON o.resource_id = r.id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(orders);
  } catch (error) {
    console.error('获取用户订单失败:', error);
    res.status(500).json({ message: '获取用户订单失败' });
  }
});

// 获取用户浏览历史
router.get('/history', verifyToken, async (req, res) => {
  try {
    const [history] = await db.query(
      `SELECT h.*, r.name, r.cpu, r.memory, r.storage, r.price 
       FROM browsing_history h 
       LEFT JOIN resources r ON h.resource_id = r.id 
       WHERE h.user_id = ? 
       ORDER BY h.timestamp DESC 
       LIMIT 10`,
      [req.user.id]
    );

    res.json(history);
  } catch (error) {
    console.error('获取浏览历史失败:', error);
    res.status(500).json({ message: '获取浏览历史失败' });
  }
});

module.exports = router;