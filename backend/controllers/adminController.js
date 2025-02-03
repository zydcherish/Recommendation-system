const db = require('../utils/db');
const bcrypt = require('bcrypt');

// 获取资源列表
const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const offset = (page - 1) * pageSize;
    
    let sql = `
      SELECT 
        id, name, type, cpu, memory, storage,
        storage_type, usage_type, price, status,
        description, created_at
      FROM resources
      WHERE 1=1
    `;
    const params = [];

    // 关键词搜索
    if (req.query.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${req.query.name}%`);
    }

    // 类型筛选
    if (req.query.type) {
      sql += ` AND type = ?`;
      params.push(req.query.type);
    }

    // 存储类型筛选
    if (req.query.storage_type) {
      sql += ` AND storage_type = ?`;
      params.push(req.query.storage_type);
    }

    // 使用场景筛选
    if (req.query.usage_type) {
      sql += ` AND usage_type = ?`;
      params.push(req.query.usage_type);
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM resources WHERE 1=1
       ${req.query.name ? 'AND name LIKE ?' : ''}
       ${req.query.type ? 'AND type = ?' : ''}
       ${req.query.storage_type ? 'AND storage_type = ?' : ''}
       ${req.query.usage_type ? 'AND usage_type = ?' : ''}`,
      params
    );
    const total = countResult[0].total;

    // 添加排序和分页
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    // 执行查询
    const [resources] = await db.query(sql, params);

    res.json({
      items: resources,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('获取资源列表失败：', error);
    res.status(500).json({ 
      message: '获取资源列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 创建资源
const createResource = async (req, res) => {
  try {
    const {
      name,
      type,
      cpu,
      memory,
      storage,
      storage_type,
      usage_type,
      price,
      description
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO resources (
        name, type, cpu, memory, storage,
        storage_type, usage_type, price, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, type, cpu, memory, storage, storage_type, usage_type, price, description]
    );

    res.json({
      id: result.insertId,
      message: '创建成功'
    });
  } catch (error) {
    console.error('创建资源失败：', error);
    res.status(500).json({ message: '创建资源失败' });
  }
};

// 更新资源
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      cpu,
      memory,
      storage,
      storage_type,
      usage_type,
      price,
      description
    } = req.body;

    await db.query(
      `UPDATE resources 
       SET name = ?, type = ?, cpu = ?, memory = ?,
           storage = ?, storage_type = ?, usage_type = ?,
           price = ?, description = ?
       WHERE id = ?`,
      [name, type, cpu, memory, storage, storage_type, usage_type, price, description, id]
    );

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新资源失败：', error);
    res.status(500).json({ message: '更新资源失败' });
  }
};

// 更新资源状态
const updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }

    await db.query(
      'UPDATE resources SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: '状态更新成功' });
  } catch (error) {
    console.error('更新资源状态失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除资源
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM resources WHERE id = ?', [id]);
    res.json({ message: '资源删除成功' });
  } catch (error) {
    console.error('删除资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取订单列表
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let sql = `
      SELECT 
        o.id,
        o.user_id,
        o.resource_id,
        o.status,
        o.total_price,
        o.created_at,
        o.updated_at,
        u.username,
        r.name as resource_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN resources r ON o.resource_id = r.id
      WHERE 1=1
    `;
    
    const params = [];

    if (req.query.username) {
      sql += ` AND u.username LIKE ?`;
      params.push(`%${req.query.username}%`);
    }

    if (req.query.status) {
      sql += ` AND o.status = ?`;
      params.push(req.query.status);
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id
       WHERE 1=1 
       ${req.query.username ? 'AND u.username LIKE ?' : ''}
       ${req.query.status ? 'AND o.status = ?' : ''}`,
      params
    );
    const total = countResult[0].total;

    // 添加排序和分页
    sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    // 执行查询
    const [orders] = await db.query(sql, params);

    // 格式化日期
    const formattedOrders = orders.map(order => ({
      ...order,
      created_at: order.created_at ? new Date(order.created_at).toLocaleString() : null,
      updated_at: order.updated_at ? new Date(order.updated_at).toLocaleString() : null
    }));

    res.json({
      items: formattedOrders,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('获取订单列表失败：', error);
    res.status(500).json({ 
      message: '获取订单列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 获取订单详情
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        o.id,
        o.order_no,
        o.status,
        o.quantity,
        o.total_price,
        o.created_at,
        o.updated_at,
        u.username,
        u.phone,
        r.name as resource_name,
        r.type as resource_type,
        r.cpu,
        r.memory,
        r.storage
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN resources r ON o.resource_id = r.id
      WHERE o.id = ?
    `;

    const [orders] = await db.query(sql, [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }

    // 格式化日期
    const order = {
      ...orders[0],
      created_at: orders[0].created_at ? new Date(orders[0].created_at).toLocaleString() : null,
      updated_at: orders[0].updated_at ? new Date(orders[0].updated_at).toLocaleString() : null
    };

    res.json(order);
  } catch (error) {
    console.error('获取订单详情失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 取消订单
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (orders[0].status !== '未支付') {
      return res.status(400).json({ message: '只能取消未支付的订单' });
    }

    await db.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      ['已取消', orderId]
    );

    res.json({ message: '订单已取消' });
  } catch (error) {
    console.error('取消订单失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取统计数据
const getStatistics = async (req, res) => {
  try {
    // 获取用户总数
    const [userCountResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE type = "user"');
    const userCount = userCountResult[0].count;

    // 获取资源总数（包括所有状态）
    const [resourceCountResult] = await db.query('SELECT COUNT(*) as count FROM resources');
    const resourceCount = resourceCountResult[0].count;

    // 获取订单统计信息（按状态分类）
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN status = '已支付' THEN total_price ELSE 0 END) as total_income,
        SUM(CASE WHEN status = '未支付' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = '已支付' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status = '已取消' THEN 1 ELSE 0 END) as cancelled_count
      FROM orders
    `);

    // 获取最近7天的订单趋势（包括所有状态）
    const [orderTrend] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_count,
        SUM(CASE WHEN status = '已支付' THEN 1 ELSE 0 END) as paid_count
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 获取资源类型分布（包括所有状态）
    const [resourceTypes] = await db.query(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_count
      FROM resources
      GROUP BY type
    `);

    // 获取最近订单
    const [recentOrders] = await db.query(`
      SELECT 
        o.id,
        o.status,
        o.total_price,
        o.created_at,
        u.username,
        r.name as resource_name,
        r.type as resource_type
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN resources r ON o.resource_id = r.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // 格式化最近订单的日期
    const formattedRecentOrders = recentOrders.map(order => ({
      ...order,
      created_at: order.created_at ? new Date(order.created_at).toLocaleString() : null
    }));

    // 返回更详细的统计数据
    res.json({
      userCount,
      resourceCount,
      orderStats: {
        totalCount: orderStats[0].total_count,
        totalIncome: orderStats[0].total_income || 0,
        pendingCount: orderStats[0].pending_count,
        paidCount: orderStats[0].paid_count,
        cancelledCount: orderStats[0].cancelled_count
      },
      orderTrend: orderTrend.map(item => ({
        date: item.date,
        totalCount: item.total_count,
        paidCount: item.paid_count
      })),
      resourceTypes: resourceTypes.map(item => ({
        type: item.type || '未知类型',
        totalCount: item.count,
        availableCount: item.available_count
      })),
      recentOrders: formattedRecentOrders
    });

  } catch (error) {
    console.error('获取统计数据失败：', error);
    res.status(500).json({ 
      message: '获取统计数据失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 获取用户列表
const getUsers = async (req, res) => {
  try {
    console.log('获取用户列表请求参数:', req.query);
    
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
    const { username, email } = req.query;
    const offset = (page - 1) * pageSize;

    // 构建基础查询
    let sql = `
      SELECT 
        id, username, email, phone, type,
        status, registration_date, last_login,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
      FROM users 
      WHERE 1=1
    `;
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];
    const countParams = [];

    // 添加搜索条件
    if (username) {
      const condition = ' AND username LIKE ?';
      sql += condition;
      countSql += condition;
      params.push(`%${username}%`);
      countParams.push(`%${username}%`);
    }
    if (email) {
      const condition = ' AND email LIKE ?';
      sql += condition;
      countSql += condition;
      params.push(`%${email}%`);
      countParams.push(`%${email}%`);
    }

    // 获取总数
    const [countResult] = await db.query(countSql, countParams);
    const total = countResult[0].total;

    // 添加分页
    sql += ' ORDER BY registration_date DESC LIMIT ?, ?';
    params.push(offset, pageSize);

    console.log('执行SQL:', sql);
    console.log('SQL参数:', params);

    // 使用 query 而不是 execute
    const [users] = await db.query(sql, params);

    // 格式化日期
    const formattedUsers = users.map(user => ({
      ...user,
      registration_date: user.registration_date ? new Date(user.registration_date).toLocaleString() : null,
      last_login: user.last_login ? new Date(user.last_login).toLocaleString() : null
    }));

    res.json({
      total,
      items: formattedUsers,
      page,
      pageSize
    });
  } catch (error) {
    console.error('获取用户列表失败：', error);
    res.status(500).json({ 
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 获取用户详情
const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.execute(
      `SELECT 
        u.*,
        (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
        (SELECT SUM(total_price) FROM orders WHERE user_id = u.id AND status = '已支付') as total_spent
      FROM users u 
      WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取用户订单
    const [orders] = await db.execute(
      `SELECT o.*, r.name as resource_name
       FROM orders o
       LEFT JOIN resources r ON o.resource_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [id]
    );

    const user = users[0];
    user.orders = orders;

    res.json(user);
  } catch (error) {
    console.error('获取用户详情失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户状态
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }

    await db.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: '状态更新成功' });
  } catch (error) {
    console.error('更新用户状态失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  getResources,
  createResource,
  updateResource,
  updateResourceStatus,
  deleteResource,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getStatistics,
  getUsers,
  getUserDetail,
  updateUserStatus,
  deleteUser
}; 