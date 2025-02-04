const db = require('../db');

// 创建订单
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // 从token获取用户ID
    const { resourceId, quantity = 1, duration = 1, remark = '' } = req.body;

    if (!resourceId) {
      return res.status(400).json({ message: '资源ID不能为空' });
    }

    if (!duration || duration < 1) {
      return res.status(400).json({ message: '使用时长必须大于0' });
    }

    // 验证资源是否存在并获取价格
    const [resources] = await db.query(
      'SELECT * FROM resources WHERE id = ? AND status = "available"',
      [resourceId]
    );

    if (resources.length === 0) {
      return res.status(404).json({ message: '资源不存在或不可用' });
    }

    const resource = resources[0];
    const totalPrice = resource.price * quantity * duration; // 按天计费

    // 创建订单
    const [result] = await db.query(
      `INSERT INTO orders (
        user_id, resource_id, quantity, duration, total_price, 
        status, remark, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, '未支付', ?, NOW(), NOW())`,
      [userId, resourceId, quantity, duration, totalPrice, remark]
    );

    // 获取完整的订单信息
    const [orders] = await db.query(`
      SELECT 
        o.*,
        r.name as resource_name,
        r.cpu,
        r.memory,
        r.storage,
        r.price
      FROM orders o
      LEFT JOIN resources r ON o.resource_id = r.id
      WHERE o.id = ?
    `, [result.insertId]);

    res.status(201).json({
      code: 200,
      message: '订单创建成功',
      data: orders[0]
    });
  } catch (error) {
    console.error('创建订单失败：', error);
    res.status(500).json({ 
      code: 500,
      message: '创建订单失败',
      error: error.message 
    });
  }
};

// 获取用户订单列表
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // 可选的状态过滤

    let sql = `
      SELECT 
        o.*,
        r.name as resource_name,
        r.cpu,
        r.memory,
        r.storage,
        r.price
      FROM orders o
      LEFT JOIN resources r ON o.resource_id = r.id
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(sql, params);
    res.json({
      code: 200,
      message: '获取订单列表成功',
      data: orders
    });
  } catch (error) {
    console.error('获取订单列表失败：', error);
    res.status(500).json({ 
      code: 500,
      message: '获取订单列表失败',
      error: error.message
    });
  }
};

// 获取订单详情
const getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const [orders] = await db.query(`
      SELECT 
        o.*,
        r.name as resource_name,
        r.cpu,
        r.memory,
        r.storage,
        r.price,
        u.username as contact_name,
        u.email as contact_phone
      FROM orders o
      LEFT JOIN resources r ON o.resource_id = r.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?
    `, [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取订单详情成功',
      data: orders[0]
    });
  } catch (error) {
    console.error('获取订单详情失败：', error);
    res.status(500).json({
      code: 500,
      message: '获取订单详情失败',
      error: error.message
    });
  }
};

// 取消订单
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // 检查订单是否存在且属于当前用户
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const order = orders[0];

    // 只能取消未支付的订单
    if (order.status !== '未支付') {
      return res.status(400).json({
        code: 400,
        message: '只能取消未支付的订单'
      });
    }

    // 更新订单状态为已取消
    await db.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      ['已取消', orderId]
    );

    res.json({
      code: 200,
      message: '订单已取消',
      data: null
    });
  } catch (error) {
    console.error('取消订单失败：', error);
    res.status(500).json({
      code: 500,
      message: '取消订单失败',
      error: error.message
    });
  }
};

// 支付订单
const payOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // 检查订单是否存在且属于当前用户
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const order = orders[0];

    // 只能支付未支付的订单
    if (order.status !== '未支付') {
      return res.status(400).json({
        code: 400,
        message: '订单状态错误'
      });
    }

    // TODO: 这里应该添加实际的支付逻辑
    // 暂时直接更新订单状态为已支付
    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      ['已支付', orderId]
    );

    res.json({
      code: 200,
      message: '支付成功',
      data: null
    });
  } catch (error) {
    console.error('支付订单失败：', error);
    res.status(500).json({
      code: 500,
      message: '支付订单失败',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetail,
  cancelOrder,
  payOrder
}; 