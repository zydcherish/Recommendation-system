const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取资源列表
router.get('/', async (req, res) => {
  try {
    const { cpu, memory, storage_type, usage_type, keyword, category, type, status } = req.query;
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];

    if (cpu) {
      query += ' AND CAST(cpu AS SIGNED) = ?';
      params.push(parseInt(cpu));
    }
    if (memory) {
      query += ' AND CAST(memory AS SIGNED) = ?';
      params.push(parseInt(memory));
    }
    if (storage_type) {
      query += ' AND storage_type = ?';
      params.push(storage_type);
    }
    if (usage_type) {
      query += ' AND usage_type = ?';
      params.push(usage_type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (keyword) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const likeParam = `%${keyword}%`;
      params.push(likeParam, likeParam);
    }

    console.log('执行查询:', query);
    console.log('查询参数:', params);

    const [resources] = await db.query(query, params);
    
    if (!resources || !Array.isArray(resources)) {
      throw new Error('查询结果格式错误');
    }

    // 格式化返回的数据
    const formattedResources = resources.map(resource => ({
      ...resource,
      cpu: parseInt(resource.cpu) || resource.cpu,
      memory: parseInt(resource.memory) || resource.memory,
      storage: parseInt(resource.storage) || resource.storage,
      price: parseFloat(resource.price) || resource.price
    }));

    res.json({ 
      code: 200, 
      data: formattedResources,
      total: formattedResources.length
    });
  } catch (error) {
    console.error('获取资源列表失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '获取资源列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取热门资源
router.get('/hot', async (req, res) => {
  try {
    console.log('获取热门资源');
    const query = `
      SELECT * FROM resources 
      WHERE status = 'available' 
      ORDER BY RAND() 
      LIMIT 3
    `;
    
    const [resources] = await db.query(query);
    
    if (!resources || !Array.isArray(resources)) {
      throw new Error('查询结果格式错误');
    }

    // 格式化数据
    const formattedResources = resources.map(resource => ({
      ...resource,
      cpu: parseInt(resource.cpu) || resource.cpu,
      memory: parseInt(resource.memory) || resource.memory,
      storage: parseInt(resource.storage) || resource.storage,
      price: parseFloat(resource.price) || resource.price
    }));
    
    console.log('热门资源查询结果:', formattedResources);
    
    res.json({ 
      code: 200, 
      data: formattedResources,
      total: formattedResources.length
    });
  } catch (error) {
    console.error('获取热门资源失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '获取热门资源失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取资源详情
router.get('/:id', async (req, res) => {
  try {
    const [resources] = await db.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    
    if (!resources || !Array.isArray(resources)) {
      throw new Error('查询结果格式错误');
    }
    
    if (resources.length > 0) {
      // 格式化数据
      const resource = {
        ...resources[0],
        cpu: parseInt(resources[0].cpu) || resources[0].cpu,
        memory: parseInt(resources[0].memory) || resources[0].memory,
        storage: parseInt(resources[0].storage) || resources[0].storage,
        price: parseFloat(resources[0].price) || resources[0].price
      };
      
      res.json({ code: 200, data: resource });
    } else {
      res.status(404).json({ code: 404, message: '资源不存在' });
    }
  } catch (error) {
    console.error('获取资源详情失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '获取资源详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;