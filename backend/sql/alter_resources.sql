-- 添加存储类型字段
ALTER TABLE resources
ADD COLUMN storage_type ENUM('ssd', 'hdd', 'nvme') DEFAULT 'ssd' AFTER storage;

-- 添加使用场景字段
ALTER TABLE resources
ADD COLUMN usage_type ENUM('ai', 'scientific', 'bigdata', 'render') DEFAULT 'scientific' AFTER storage_type;

-- 更新现有数据
UPDATE resources 
SET storage_type = 'ssd',
    usage_type = CASE
      WHEN category = 'AI' THEN 'ai'
      WHEN category = '科学计算' THEN 'scientific'
      WHEN category = '大数据' THEN 'bigdata'
      ELSE 'scientific'
    END
WHERE storage_type IS NULL; 