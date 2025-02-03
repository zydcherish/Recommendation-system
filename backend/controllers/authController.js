const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../utils/db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('登录请求数据:', { email });

    // 参数验证
    if (!email || !password) {
      return res.status(400).json({ 
        message: '请提供邮箱和密码'
      });
    }

    // 查询用户
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    console.log('查询到的用户数:', users.length);

    if (users.length === 0) {
      return res.status(401).json({ 
        message: '用户名或密码错误' 
      });
    }

    const user = users[0];

    // 验证密码
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ 
          message: '用户名或密码错误' 
        });
      }
    } catch (bcryptError) {
      console.error('密码验证错误:', bcryptError);
      return res.status(500).json({ 
        message: '密码验证失败' 
      });
    }

    // 生成 token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      type: user.type
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 更新最后登录时间
    try {
      await db.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );
    } catch (updateError) {
      console.error('更新登录时间失败:', updateError);
      // 不影响登录流程，继续执行
    }

    // 准备返回的用户信息
    const userResponse = {
      id: user.id,
      email: user.email,
      type: user.type,
      username: user.username
    };

    console.log('登录成功:', {
      userId: user.id,
      userType: user.type
    });

    res.json({
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('登录处理失败:', error);
    res.status(500).json({
      message: '服务器错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const logout = async (req, res) => {
  try {
    // 这里可以添加一些清理工作，比如记录登出时间
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

module.exports = {
  login,
  logout
}; 