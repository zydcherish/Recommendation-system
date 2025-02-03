const axios = require('axios');
const API_URL = 'http://localhost:3000/api';
let userToken = '';
let adminToken = '';

async function testRecommendAPIs() {
  try {
    // 1. 获取用户token
    console.log('\n1. 用户登录');
    const loginResponse = await axios.post(`${API_URL}/auth/user/login`, {
      username: 'testuser1',
      password: '123456'
    });
    userToken = loginResponse.data.token;

    const config = {
      headers: { Authorization: `Bearer ${userToken}` }
    };

    // 2. 测试新用户推荐
    console.log('\n2. 测试新用户推荐');
    const newUserRecommendations = await axios.get(
      `${API_URL}/recommend/new-user`
    );
    console.log('新用户推荐结果:', newUserRecommendations.data);

    // 3. 测试老用户推荐
    console.log('\n3. 测试老用户推荐');
    const oldUserRecommendations = await axios.get(
      `${API_URL}/recommend/user`,
      config
    );
    console.log('老用户推荐结果:', oldUserRecommendations.data);

    // 4. 测试热门资源
    console.log('\n4. 测试热门资源');
    const popularResources = await axios.get(
      `${API_URL}/recommend/popular`
    );
    console.log('热门资源:', popularResources.data);

    // 5. 测试资源搜索
    console.log('\n5. 测试资源搜索');
    const searchResults = await axios.get(
      `${API_URL}/recommend/search?keyword=服务器&minPrice=50&maxPrice=200`
    );
    console.log('搜索结果:', searchResults.data);

  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testRecommendAPIs(); 