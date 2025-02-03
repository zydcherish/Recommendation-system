const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接并验证表结构
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');

    // 验证必要的表是否存在
    const tables = ['users', 'resources', 'orders'];
    for (const table of tables) {
      const [result] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
      if (result.length === 0) {
        console.error(`错误: ${table} 表不存在`);
        process.exit(1);
      }
    }

    // 验证 resources 表结构
    const [columns] = await connection.execute('SHOW COLUMNS FROM resources');
    console.log('Resources表结构:', columns.map(col => col.Field));

    // 检查是否有数据
    const [counts] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users) as userCount,
        (SELECT COUNT(*) FROM resources) as resourceCount,
        (SELECT COUNT(*) FROM orders) as orderCount
    `);
    console.log('数据统计:', counts[0]);

    connection.release();
  } catch (err) {
    console.error('数据库连接或验证失败:', err);
    process.exit(1);
  }
};

// 添加错误处理
pool.on('error', (err) => {
  console.error('数据库池错误:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('数据库连接丢失');
  }
});

testConnection();

module.exports = pool; 