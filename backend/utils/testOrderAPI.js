const axios = require('axios');
const API_URL = 'http://localhost:3000/api';
let userToken = '';

async function testOrderAPIs() {
  try {
    // 1. 用户登录获取token
    console.log('\n1. 用户登录');
    const loginResponse = await axios.post(`${API_URL}/auth/user/login`, {
      username: 'testuser1',
      password: '123456'
    });
    userToken = loginResponse.data.token;
    console.log('登录成功，获取到token');

    const config = {
      headers: { Authorization: `Bearer ${userToken}` }
    };

    // 2. 创建订单
    console.log('\n2. 创建订单');
    const createOrderResponse = await axios.post(
      `${API_URL}/orders`,
      {
        resourceId: 1,
        quantity: 1
      },
      config
    );
    console.log('订单创建响应:', createOrderResponse.data);
    const orderId = createOrderResponse.data.order.id;

    // 3. 获取订单列表
    console.log('\n3. 获取订单列表');
    const ordersResponse = await axios.get(
      `${API_URL}/orders`,
      config
    );
    console.log('订单列表:', ordersResponse.data);

    // 4. 获取订单详情
    console.log('\n4. 获取订单详情');
    const orderDetailResponse = await axios.get(
      `${API_URL}/orders/${orderId}`,
      config
    );
    console.log('订单详情:', orderDetailResponse.data);

    // 5. 支付订单
    console.log('\n5. 支付订单');
    const payResponse = await axios.post(
      `${API_URL}/orders/${orderId}/pay`,
      {},
      config
    );
    console.log('支付响应:', payResponse.data);

    // 6. 尝试取消已支付的订单（应该失败）
    console.log('\n6. 尝试取消已支付的订单');
    try {
      await axios.post(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        config
      );
    } catch (error) {
      console.log('预期的错误响应:', error.response.data);
    }

    // 7. 创建新订单并取消
    console.log('\n7. 创建新订单并取消');
    const newOrderResponse = await axios.post(
      `${API_URL}/orders`,
      {
        resourceId: 1,
        quantity: 1
      },
      config
    );
    const newOrderId = newOrderResponse.data.order.id;

    const cancelResponse = await axios.post(
      `${API_URL}/orders/${newOrderId}/cancel`,
      {},
      config
    );
    console.log('取消订单响应:', cancelResponse.data);

  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testOrderAPIs(); 