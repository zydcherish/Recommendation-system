const db = require('../config/database');

// 获取所有资源
const getAllResources = async (req, res) => {
  try {
    const [resources] = await db.execute('SELECT * FROM resources');
    res.json(resources);
  } catch (error) {
    console.error('获取资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个资源
const getResourceById = async (req, res) => {
  try {
    const [resources] = await db.execute(
      'SELECT * FROM resources WHERE id = ?',
      [req.params.id]
    );
    
    if (resources.length === 0) {
      return res.status(404).json({ message: '资源不存在' });
    }
    
    res.json(resources[0]);
  } catch (error) {
    console.error('获取资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建新资源
const createResource = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      cpu, 
      memory, 
      storage, 
      price,
      category,
      tags 
    } = req.body;

    // 验证必填字段
    if (!name || !type || !cpu || !memory || !storage || !price) {
      return res.status(400).json({ message: '请填写所有必需字段' });
    }

    const [result] = await db.execute(
      `INSERT INTO resources 
       (name, type, cpu, memory, storage, price, category, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, type, cpu, memory, storage, price, category, tags]
    );

    res.status(201).json({
      message: '资源创建成功',
      resourceId: result.insertId
    });
  } catch (error) {
    console.error('创建资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新资源
const updateResource = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      cpu, 
      memory, 
      storage, 
      price,
      category,
      tags,
      status 
    } = req.body;

    // 验证资源是否存在
    const [existing] = await db.execute(
      'SELECT id FROM resources WHERE id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: '资源不存在' });
    }

    await db.execute(
      `UPDATE resources 
       SET name = ?, type = ?, cpu = ?, memory = ?, 
           storage = ?, price = ?, category = ?, 
           tags = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, type, cpu, memory, storage, price, category, tags, status, req.params.id]
    );

    res.json({ message: '资源更新成功' });
  } catch (error) {
    console.error('更新资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除资源
const deleteResource = async (req, res) => {
  try {
    // 验证资源是否存在
    const [existing] = await db.execute(
      'SELECT id FROM resources WHERE id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: '资源不存在' });
    }

    await db.execute('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ message: '资源删除成功' });
  } catch (error) {
    console.error('删除资源失败：', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
}; 