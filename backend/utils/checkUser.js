require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function checkUser() {
  try {
    const [users] = await db.execute('SELECT id, username, email, phone FROM users');
    console.log('当前用户列表：', users);
  } catch (error) {
    console.error('查询失败：', error);
  } finally {
    process.exit();
  }
}

checkUser(); 