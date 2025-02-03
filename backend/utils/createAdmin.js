require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function createAdminUser() {
  try {
    // 管理员账户信息
    const admin = {
      username: 'admin',
      password: 'admin123' // 这里设置初始密码
    };

    // 检查是否已存在
    const [existing] = await db.execute(
      'SELECT id FROM admins WHERE username = ?',
      [admin.username]
    );

    if (existing.length > 0) {
      console.log('管理员账户已存在！');
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    // 插入管理员用户
    await db.execute(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [admin.username, hashedPassword]
    );

    console.log('管理员账户创建成功！');
    console.log('用户名:', admin.username);
    console.log('密码:', admin.password);
  } catch (error) {
    console.error('创建管理员账户失败：', error);
    console.error('错误详情：', error.message);
  } finally {
    process.exit();
  }
}

createAdminUser(); 