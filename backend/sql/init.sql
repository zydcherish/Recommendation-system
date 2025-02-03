-- 创建数据库
CREATE DATABASE IF NOT EXISTS arithmetic_recommendation;
USE arithmetic_recommendation;

-- 创建资源表
CREATE TABLE IF NOT EXISTS resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cpu INT NOT NULL,
  memory INT NOT NULL,
  storage INT NOT NULL,
  storage_type ENUM('ssd', 'hdd', 'nvme') DEFAULT 'ssd',
  usage_type ENUM('ai', 'scientific', 'bigdata', 'render') DEFAULT 'scientific',
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'unavailable') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入一些测试数据
INSERT INTO resources (name, description, cpu, memory, storage, storage_type, usage_type, price) VALUES
('基础计算型', '适合一般计算任务', 2, 4, 100, 'ssd', 'scientific', 9.9),
('标准计算型', '适合日常科学计算', 4, 8, 200, 'ssd', 'scientific', 19.9),
('高性能计算型', '适合大规模科学计算', 8, 16, 500, 'nvme', 'scientific', 39.9),
('AI训练型', '适合深度学习训练', 8, 32, 1000, 'nvme', 'ai', 59.9),
('大数据分析型', '适合大数据处理', 16, 64, 2000, 'nvme', 'bigdata', 99.9),
('渲染计算型', '适合3D渲染', 32, 128, 4000, 'nvme', 'render', 199.9); 