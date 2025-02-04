const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取资源列表
router.get('/', async (req, res) => {
  try {
    const {
      keyword,
      cpu,
      memory,
      storage,
      storage_type,
      usage_type,
      category,
      page = 1,
      pageSize = 12
    } = req.query;

    let query = 'SELECT * FROM resources WHERE status = "available"';
    const params = [];

    if (keyword) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ? OR tags LIKE ?)';
      const likeParam = `%${keyword}%`;
      params.push(likeParam, likeParam, likeParam, likeParam);
    }

    if (cpu) {
      query += ' AND cpu = ?';
      params.push(`${cpu}核`);
    }

    if (memory) {
      query += ' AND memory = ?';
      params.push(`${memory}GB`);
    }

    if (storage) {
      query += ' AND storage = ?';
      params.push(`${storage}GB`);
    }

    if (storage_type) {
      query += ' AND storage_type = ?';
      params.push(storage_type);
    }

    if (usage_type) {
      query += ' AND usage_type = ?';
      params.push(usage_type);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // 获取总数
    const [countResult] = await db.query(
      query.replace('SELECT *', 'SELECT COUNT(*) as total'),
      params
    );
    const total = countResult[0].total;

    // 添加分页
    const offset = (page - 1) * pageSize;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), offset);

    const [resources] = await db.query(query, params);

    // 处理返回的数据
    const formattedResources = resources.map(resource => ({
      ...resource,
      cpu: resource.cpu.replace('核', ''),
      memory: resource.memory.replace('GB', ''),
      storage: resource.storage.replace('GB', ''),
      tags: resource.tags ? resource.tags.split(',') : []
    }));

    res.json({
      code: 200,
      data: formattedResources,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('获取资源列表失败:', error);
    res.status(500).json({ 
      code: 500,
      message: '获取资源列表失败',
      error: error.message
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
      id: resource.id,
      name: resource.name,
      description: resource.description,
      cpu: resource.cpu ? resource.cpu.replace('核', '') : '0',
      memory: resource.memory ? resource.memory.replace('GB', '') : '0',
      storage: resource.storage ? resource.storage.replace('GB', '') : '0',
      price: resource.price || 0,
      imageUrl: resource.image_url,
      status: resource.status,
      tags: resource.tags ? resource.tags.split(',') : []
    }));
    
    console.log('热门资源查询结果:', formattedResources);
    
    res.json({ 
      code: 200, 
      data: formattedResources
    });
  } catch (error) {
    console.error('获取热门资源失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '获取热门资源失败',
      error: error.message
    });
  }
});

// 获取资源详情
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      console.warn('无效的资源ID:', req.params.id);
      return res.status(400).json({
        code: 400,
        message: '无效的资源ID'
      });
    }

    console.log('获取资源详情, ID:', id);
    
    // 构建查询语句
    const query = `
      SELECT * FROM resources 
      WHERE id = ? 
      AND status = 'available'
    `;
    console.log('执行查询:', query.replace(/\s+/g, ' '), [id]);

    const [resources] = await db.query(query, [id]);
    console.log('查询结果:', JSON.stringify(resources, null, 2));

    if (!resources || resources.length === 0) {
      console.warn('资源不存在或已下架, ID:', id);
      return res.status(404).json({
        code: 404,
        message: '资源不存在或已下架'
      });
    }

    // 处理返回的数据
    const resource = resources[0];
    console.log('原始资源数据:', JSON.stringify(resource, null, 2));

    // 确保所有字段都有正确的格式和默认值
    const formattedResource = {
      id: resource.id,
      name: resource.name || '',
      description: resource.description || '',
      cpu: resource.cpu ? resource.cpu.replace('核', '') : '0',
      memory: resource.memory ? resource.memory.replace('GB', '') : '0',
      storage: resource.storage ? resource.storage.replace('GB', '') : '0',
      price: parseFloat(resource.price || 0).toFixed(2),
      image_url: resource.image_url || `https://picsum.photos/800/600?random=${resource.id}`,
      status: resource.status || 'unavailable',
      category: resource.category || '通用型',
      storage_type: resource.storage_type || 'ssd',
      usage_type: resource.usage_type || 'general',
      type: resource.type || 'basic',
      tags: resource.tags ? resource.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      created_at: resource.created_at,
      updated_at: resource.updated_at
    };

    console.log('格式化后的资源数据:', JSON.stringify(formattedResource, null, 2));
    
    res.json({
      code: 200,
      data: formattedResource,
      message: 'success'
    });
  } catch (error) {
    console.error('获取资源详情失败:', error);
    console.error('错误堆栈:', error.stack);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      code: statusCode,
      message: error.message || '获取资源详情失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;