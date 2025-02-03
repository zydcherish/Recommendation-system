const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const resourceRoutes = require('./routes/resources');
const orderRoutes = require('./routes/orders');
const recommendRoutes = require('./routes/recommend');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger');

const app = express();

// CORS配置
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 中间件
app.use(bodyParser.json());
app.use(logger);

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// API路由
const apiRouter = express.Router();
apiRouter.use('/resources', resourceRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/recommend', recommendRoutes);
apiRouter.use('/users', userRoutes);

// 挂载API路由
app.use('/api', apiRouter);

// 404处理
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    code: 404,
    message: '未找到请求的资源',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', {
    message: err.message,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 设置服务器端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('支持的路由:');
  console.log('- /api/resources');
  console.log('- /api/auth');
  console.log('- /api/admin');
  console.log('- /api/orders');
  console.log('- /api/recommend');
  console.log('- /api/users');
});

module.exports = app;