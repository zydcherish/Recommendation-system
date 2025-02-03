const db = require('../utils/db');

// 获取用户信息
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.execute(
      'SELECT id, username, email, phone FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, phone } = req.body;

    await db.execute(
      'UPDATE users SET email = ?, phone = ? WHERE id = ?',
      [email, phone, userId]
    );

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新用户信息失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户订单
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await db.execute(
      `SELECT o.*, r.name as resource_name 
       FROM orders o
       LEFT JOIN resources r ON o.resource_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error('获取用户订单失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户浏览历史
const getBrowsingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const [history] = await db.execute(
      `SELECT h.*, r.name, r.type, r.price 
       FROM browsing_history h
       LEFT JOIN resources r ON h.resource_id = r.id
       WHERE h.user_id = ?
       ORDER BY h.timestamp DESC
       LIMIT 10`,
      [userId]
    );

    res.json(history);
  } catch (error) {
    console.error('获取浏览历史失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserOrders,
  getBrowsingHistory
}; 