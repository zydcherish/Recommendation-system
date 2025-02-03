CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type ENUM('basic', 'standard', 'premium') NOT NULL,
  cpu VARCHAR(20) NOT NULL,
  memory VARCHAR(20) NOT NULL,
  storage_type ENUM('ssd', 'hdd', 'nvme') NOT NULL,
  storage_size VARCHAR(20) NOT NULL,
  usage_type ENUM('ai', 'scientific', 'bigdata', 'render') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('available', 'sold_out') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO products (name, type, cpu, memory, storage_type, storage_size, usage_type, price, description) VALUES
('基础计算型 S1', 'basic', '2', '4', 'ssd', '100GB', 'scientific', 1.5, '入门级计算服务器，适合小型科学计算'),
('标准计算型 M1', 'standard', '4', '8', 'ssd', '200GB', 'scientific', 2.5, '标准计算服务器，适合常规科学计算'),
('高性能计算型 H1', 'premium', '8', '16', 'nvme', '500GB', 'scientific', 4.5, '高性能计算服务器，适合大规模科学计算'),
('AI训练型 A1', 'standard', '8', '32', 'ssd', '1TB', 'ai', 5.5, '专为AI训练优化的服务器配置'),
('大数据分析型 D1', 'premium', '16', '64', 'nvme', '2TB', 'bigdata', 8.5, '适合大规模数据分析的高性能服务器'),
('渲染计算型 R1', 'premium', '32', '64', 'nvme', '1TB', 'render', 9.5, '专业3D渲染和视频处理服务器'); 