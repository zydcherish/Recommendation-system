const mysql = require('mysql2');
require('dotenv').config();

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
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

testConnection();

module.exports = promisePool;