require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function createTestResources() {
  try {
    const resources = [
      {
        name: '基础计算型',
        type: 'basic',
        cpu: '2核',
        memory: '4GB',
        storage: '100GB',
        price: 99.99,
        category: '入门级',
        tags: 'basic,economical',
        status: 'available'
      },
      {
        name: '高性能计算型',
        type: 'performance',
        cpu: '8核',
        memory: '16GB',
        storage: '500GB',
        price: 299.99,
        category: '专业级',
        tags: 'high-performance,professional',
        status: 'available'
      }
    ];

    for (const resource of resources) {
      await db.execute(
        `INSERT INTO resources 
         (name, type, cpu, memory, storage, price, category, tags, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          resource.name,
          resource.type,
          resource.cpu,
          resource.memory,
          resource.storage,
          resource.price,
          resource.category,
          resource.tags,
          resource.status
        ]
      );
    }

    console.log('测试资源创建成功！');
  } catch (error) {
    console.error('创建测试资源失败：', error);
    console.error('错误详情：', error.message);
  } finally {
    process.exit();
  }
}

createTestResources(); 