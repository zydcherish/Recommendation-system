const db = require('../utils/db');
const jwt = require('jsonwebtoken');

// 搜索推荐产品
const searchProducts = async (req, res) => {
  try {
    console.log('开始处理推荐请求，参数:', req.query);
    const limit = parseInt(req.query.limit) || 3;

    const [products] = await db.query(`
      SELECT 
        id, 
        name, 
        type, 
        cpu, 
        memory, 
        storage, 
        price,
        description,
        category,
        tags,
        status,
        created_at,
        updated_at
      FROM resources 
      WHERE status = 'available'
      ORDER BY RAND()
      LIMIT ?
    `, [limit]);

    if (!products || !Array.isArray(products)) {
      console.warn('未找到产品数据');
      return res.json([]);
    }

    const formattedProducts = products.map(product => ({
      ...product,
      created_at: product.created_at ? new Date(product.created_at).toLocaleString() : null,
      updated_at: product.updated_at ? new Date(product.updated_at).toLocaleString() : null,
      tags: product.tags ? product.tags.split(',').filter(Boolean) : []
    }));

    console.log('查询结果:', formattedProducts);
    res.json(formattedProducts);

  } catch (error) {
    console.error('获取推荐产品失败：', error);
    res.status(500).json({ 
      message: '服务器错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 获取推荐产品
const getRecommendProducts = async (req, res) => {
  try {
    // 获取推荐产品列表
    const [products] = await db.query(`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.cpu,
        r.memory,
        r.storage,
        r.price,
        r.category,
        r.tags,
        r.type,
        r.status,
        r.created_at,
        r.updated_at,
        COALESCE(COUNT(o.id), 0) as order_count
      FROM resources r
      LEFT JOIN orders o ON r.id = o.resource_id
      WHERE r.status = 'available'
      GROUP BY 
        r.id, r.name, r.description, r.cpu, r.memory, r.storage, 
        r.price, r.category, r.tags, r.type, r.status, 
        r.created_at, r.updated_at
      ORDER BY order_count DESC, r.created_at DESC
      LIMIT 6
    `);

    // 格式化数据
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      cpu: product.cpu,
      memory: product.memory,
      storage: product.storage,
      price: product.price,
      category: product.category,
      tags: product.tags ? product.tags.split(',').filter(tag => tag.trim()) : [],
      type: product.type,
      status: product.status,
      created_at: product.created_at ? new Date(product.created_at).toLocaleString() : null,
      updated_at: product.updated_at ? new Date(product.updated_at).toLocaleString() : null
    }));

    console.log('推荐产品数据:', formattedProducts);
    res.json(formattedProducts);
    
  } catch (error) {
    console.error('获取推荐产品失败：', error);
    res.status(500).json({ 
      message: '服务器错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  searchProducts,
  getRecommendProducts
}; 