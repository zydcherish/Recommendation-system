require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function testConnection() {
  try {
    // 查看所有表
    const [tables] = await db.execute('SHOW TABLES');
    console.log('数据库中的表：');
    tables.forEach(table => {
      console.log(Object.values(table)[0]);
    });

    // 对每个表查询结构
    for (let table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await db.execute(`DESCRIBE ${tableName}`);
      console.log(`\n${tableName} 表结构：`);
      console.log(columns);
    }
    
  } catch (error) {
    console.error('查询失败：', error);
    console.error('错误详情：', error.message);
  } finally {
    process.exit();
  }
}

testConnection(); 