const axios = require('axios');

async function testAdminLogin() {
  try {
    // 测试成功登录
    console.log('\n测试1: 正确的用户名和密码');
    const response = await axios.post('http://localhost:3000/api/auth/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log('成功响应:', response.data);

    // 测试错误密码
    console.log('\n测试2: 错误的密码');
    try {
      await axios.post('http://localhost:3000/api/auth/admin/login', {
        username: 'admin',
        password: 'wrong_password'
      });
    } catch (error) {
      console.log('预期的错误响应:', error.response.data);
    }

    // 测试空输入
    console.log('\n测试3: 空的用户名/密码');
    try {
      await axios.post('http://localhost:3000/api/auth/admin/login', {
        username: '',
        password: ''
      });
    } catch (error) {
      console.log('预期的错误响应:', error.response.data);
    }

  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testAdminLogin(); 