require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const API_URL = 'http://localhost:3000/api';
let userToken = '';
let testUserId = '';

// 创建测试数据
async function createTestData() {
  try {
    // 清理已存在的测试用户
    await db.execute('DELETE FROM users WHERE username LIKE ?', ['testuser%']);

    // 创建测试用户
    const user = {
      username: 'testuser123',
      password: await bcrypt.hash('123456', 10),
      email: 'test123@example.com',
      phone: '13800138123'
    };

    // 插入用户数据
    const [result] = await db.execute(
      'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
      [user.username, user.password, user.email, user.phone]
    );

    console.log('测试用户创建成功！');
    console.log('用户名:', user.username);
    console.log('密码: 123456');
    console.log('邮箱:', user.email);
    
    return result.insertId;
  } catch (error) {
    console.error('创建测试数据失败：', error);
    throw error;
  }
}

// 测试用户相关接口
async function testUserAPIs() {
  try {
    // 0. 创建测试数据
    console.log('\n0. 创建测试数据');
    await createTestData();

    // 1. 测试用户注册
    console.log('\n1. 测试用户注册');
    const registerResponse = await axios.post(`${API_URL}/users/register`, {
      username: 'testuser456',
      password: '123456',
      email: 'test456@example.com',
      phone: '13800138456'
    });
    console.log('注册响应:', registerResponse.data);
    testUserId = registerResponse.data.userId;

    // 2. 测试用户登录
    console.log('\n2. 测试用户登录');
    const loginResponse = await axios.post(`${API_URL}/auth/user/login`, {
      username: 'testuser456',
      password: '123456'
    });
    console.log('登录响应:', loginResponse.data);
    userToken = loginResponse.data.token;

    // 设置请求头
    const config = {
      headers: { Authorization: `Bearer ${userToken}` }
    };

    // 3. 测试获取个人信息
    console.log('\n3. 测试获取个人信息');
    const profileResponse = await axios.get(
      `${API_URL}/users/profile`,
      config
    );
    console.log('个人信息:', profileResponse.data);

    // 4. 测试更新个人信息
    console.log('\n4. 测试更新个人信息');
    const updateResponse = await axios.put(
      `${API_URL}/users/profile`,
      {
        username: 'testuser456_updated',
        email: 'test456_updated@example.com'
      },
      config
    );
    console.log('更新响应:', updateResponse.data);

    // 5. 测试密码重置请求
    console.log('\n5. 测试密码重置请求');
    const resetResponse = await axios.post(`${API_URL}/users/password-reset`, {
      email: 'test456@example.com'
    });
    console.log('密码重置响应:', resetResponse.data);

    // 6. 测试更新密码
    console.log('\n6. 测试更新密码');
    const passwordUpdateResponse = await axios.put(
      `${API_URL}/users/profile`,
      {
        oldPassword: '123456',
        newPassword: 'newpassword123'
      },
      config
    );
    console.log('密码更新响应:', passwordUpdateResponse.data);

  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  } finally {
    process.exit();
  }
}

// 运行测试
testUserAPIs(); 