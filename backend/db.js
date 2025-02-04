const mysql = require('mysql2');
require('dotenv').config();

// 打印数据库配置(不包含敏感信息)
console.log('数据库配置:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'arithmetic_recommendation'
});

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'arithmetic_recommendation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 将连接池转换为 Promise 形式
const promisePool = pool.promise();

// 测试数据库连接
async function testConnection() {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('数据库连接成功');

    // 验证 resources 表是否存在
    const [tables] = await promisePool.query('SHOW TABLES LIKE "resources"');
    if (tables.length === 0) {
      throw new Error('resources 表不存在！');
    }

    // 验证表结构
    const [columns] = await promisePool.query('SHOW COLUMNS FROM resources');
    console.log('Resources 表结构验证成功:', columns.map(col => col.Field));

    // 检查是否有数据
    const [counts] = await promisePool.query('SELECT COUNT(*) as count FROM resources');
    console.log('Resources 表数据量:', counts[0].count);

    return true;
  } catch (error) {
    console.error('数据库连接或验证失败:', error);
    throw error;
  }
}

// 添加连接错误处理
pool.on('error', (err) => {
  console.error('数据库连接池错误:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('数据库连接丢失');
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('数据库连接数过多');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('数据库连接被拒绝');
  }
});

// 立即验证数据库
testConnection().catch(error => {
  console.error('数据库初始化失败:', error);
  process.exit(1);
});

module.exports = promisePool;
module.exports = promisePool;
