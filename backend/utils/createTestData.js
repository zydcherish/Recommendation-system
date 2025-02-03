require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function createTestData() {
  try {
    // 创建测试用户
    const users = [
      {
        username: 'testuser1',
        password: await bcrypt.hash('123456', 10),
        email: 'test1@example.com',
        phone: '13800138001'
      },
      {
        username: 'testuser2',
        password: await bcrypt.hash('123456', 10),
        email: 'test2@example.com',
        phone: '13800138002'
      }
    ];

    // 插入用户数据
    for (const user of users) {
      await db.execute(
        'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
        [user.username, user.password, user.email, user.phone]
      );
    }

    // 创建测试资源
    const resources = [
      {
        name: '基础服务器',
        type: 'basic',
        cpu: '2核',
        memory: '4GB',
        storage: '100GB',
        price: 99.99
      },
      {
        name: '高级服务器',
        type: 'premium',
        cpu: '4核',
        memory: '8GB',
        storage: '200GB',
        price: 199.99
      }
    ];

    // 插入资源数据
    for (const resource of resources) {
      await db.execute(
        'INSERT INTO resources (name, type, cpu, memory, storage, price) VALUES (?, ?, ?, ?, ?, ?)',
        [resource.name, resource.type, resource.cpu, resource.memory, resource.storage, resource.price]
      );
    }

    // 创建测试订单
    const orders = [
      {
        user_id: 1,
        resource_id: 1,
        status: '未支付',
        quantity: 1,
        total_price: 99.99
      },
      {
        user_id: 1,
        resource_id: 2,
        status: '已支付',
        quantity: 1,
        total_price: 199.99
      },
      {
        user_id: 2,
        resource_id: 1,
        status: '已取消',
        quantity: 1,
        total_price: 99.99
      }
    ];

    // 插入订单数据
    for (const order of orders) {
      await db.execute(
        'INSERT INTO orders (user_id, resource_id, status, quantity, total_price) VALUES (?, ?, ?, ?, ?)',
        [order.user_id, order.resource_id, order.status, order.quantity, order.total_price]
      );
    }

    console.log('测试数据创建成功！');
  } catch (error) {
    console.error('创建测试数据失败：', error);
    console.error('错误详情：', error.message);
  } finally {
    process.exit();
  }
}

createTestData(); 