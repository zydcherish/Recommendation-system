const jwt = require('jsonwebtoken');
const db = require('../db');

// Token验证中间件
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      message: '未提供认证令牌',
      code: 'TOKEN_MISSING'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      message: '无效的认证令牌格式',
      code: 'TOKEN_INVALID_FORMAT'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token验证失败:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: '认证令牌已过期，请重新登录',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: '无效的认证令牌',
        code: 'TOKEN_INVALID'
      });
    }
    
    return res.status(401).json({ 
      message: '认证失败',
      code: 'AUTH_ERROR'
    });
  }
};

// 管理员权限验证中间件
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: '未经授权的访问',
        code: 'UNAUTHORIZED'
      });
    }

    const [users] = await db.query(
      'SELECT type FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0 || users[0].type !== 'admin') {
      return res.status(403).json({ 
        message: '需要管理员权限',
        code: 'ADMIN_REQUIRED'
      });
    }

    next();
  } catch (error) {
    console.error('验证管理员权限失败：', error);
    res.status(500).json({ 
      message: '服务器错误',
      code: 'SERVER_ERROR'
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin
}; 