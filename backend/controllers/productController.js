const db = require('../utils/db');

// 获取产品列表
const getProducts = async (req, res) => {
  try {
    const { 
      keyword = '', 
      cpu = '', 
      memory = '', 
      storage = '', 
      storage_type = '',
      usage_type = '',
      page = 1, 
      pageSize = 12 
    } = req.query

    let query = 'SELECT * FROM resources WHERE status = "available"'
    const params = []

    // 构建查询条件
    if (keyword) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    if (cpu) {
      query += ' AND cpu = ?'
      params.push(cpu)
    }

    if (memory) {
      query += ' AND memory = ?'
      params.push(memory)
    }

    if (storage) {
      query += ' AND storage = ?'
      params.push(storage)
    }

    if (storage_type) {
      query += ' AND storage_type = ?'
      params.push(storage_type)
    }

    if (usage_type) {
      query += ' AND usage_type = ?'
      params.push(usage_type)
    }

    // 计算总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM (${query}) as t`,
      params
    )
    const total = countResult[0].total

    // 分页
    const offset = (page - 1) * pageSize
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(pageSize), offset)

    // 获取数据
    const [products] = await db.query(query, params)

    // 处理标签
    products.forEach(product => {
      product.tag = getProductTag(product)
    })

    res.json({
      items: products,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    })
  } catch (error) {
    console.error('获取产品列表失败:', error)
    res.status(500).json({ message: '获取产品列表失败' })
  }
};

// 获取产品详情
const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params
    const [products] = await db.query(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    )

    if (products.length === 0) {
      return res.status(404).json({ message: '产品不存在' })
    }

    const product = products[0]
    product.tag = getProductTag(product)

    res.json(product)
  } catch (error) {
    console.error('获取产品详情失败:', error)
    res.status(500).json({ message: '获取产品详情失败' })
  }
};

// 获取产品标签
const getProductTag = (product) => {
  if (product.type === 'high_performance') {
    return '高性能'
  } else if (product.type === 'standard') {
    return '标准型'
  } else if (parseFloat(product.price) < 3) {
    return '经济型'
  }
  return null
};

module.exports = {
  getProducts,
  getProductDetail
}; 