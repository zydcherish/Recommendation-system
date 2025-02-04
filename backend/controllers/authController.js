const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../utils/db');

// 用户登录
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('用户登录请求:', { email });

    if (!email || !password) {
      return res.status(400).json({ 
        code: 400,
        message: '请提供邮箱和密码' 
      });
    }

    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND type = "user"',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        code: 401,
        message: '用户名或密码错误' 
      });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ 
        code: 401,
        message: '用户名或密码错误' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          type: user.type
        }
      }
    });
  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({ 
      code: 500,
      message: '服务器错误' 
    });
  }
};

// 管理员登录
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('管理员登录请求:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: '请提供邮箱和密码' });
    }

    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND type = "admin"',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        type: user.type
      }
    });
  } catch (error) {
    console.error('管理员登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 退出登录
const logout = async (req, res) => {
  try {
    if (req.user?.id) {
      await db.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [req.user.id]
      );
    }
    res.json({ message: '登出成功' });
  } catch (error) {
    console.error('登出失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户信息
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.execute(
      'SELECT id, username, email, phone FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败'
    });
  }
};

// 更新用户信息
const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
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
      return res.status(400).json({
        code: 400,
        message: '没有要更新的字段'
      });
    }

    params.push(userId);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await db.execute(query, params);

    // 获取更新后的用户信息
    const [users] = await db.execute(
      'SELECT id, username, email, phone FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: users[0]
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败'
    });
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '请提供原密码和新密码'
      });
    }

    // 验证原密码
    const [users] = await db.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    const isValid = await bcrypt.compare(oldPassword, users[0].password);
    if (!isValid) {
      return res.status(401).json({
        code: 401,
        message: '原密码错误'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({
      code: 200,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      code: 500,
      message: '修改密码失败'
    });
  }
};

// 用户注册
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    console.log('注册请求数据:', { username, email, phone }); // 添加日志
    
    // 验证用户名和密码
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码为必填项'
      });
    }

    // 如果提供了邮箱，检查是否已存在
    if (email) {
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          code: 400,
          message: '该邮箱已被注册'
        });
      }
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户，使用数据库默认值
    const [result] = await db.execute(
      `INSERT INTO users 
       (username, password, email, phone, type, status) 
       VALUES (?, ?, ?, ?, 'user', 'active')`,
      [username, hashedPassword, email || null, phone || null]
    );

    console.log('用户创建成功:', result.insertId); // 添加日志

    // 生成JWT token
    const token = jwt.sign(
      { id: result.insertId, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        token,
        user: {
          id: result.insertId,
          username,
          email: email || null,
          type: 'user'
        }
      }
    });
  } catch (error) {
    console.error('注册失败:', error.message, error.stack);
    res.status(500).json({
      code: 500,
      message: '注册失败，请稍后重试',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  userLogin,
  adminLogin,
  logout,
  getUserInfo,
  updateUserInfo,
  changePassword
}; 