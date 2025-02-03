require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function resetTestUser() {
  try {
    // 删除已存在的测试用户
    await db.execute('DELETE FROM users WHERE username = ?', ['testuser1']);

    // 创建新的测试用户
    const password = await bcrypt.hash('123456', 10);
    await db.execute(
      'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
      ['testuser1', password, 'test1@example.com', '13800138001']
    );

    console.log('测试用户重置成功');
  } catch (error) {
    console.error('重置失败：', error);
  } finally {
    process.exit();
  }
}

resetTestUser(); 