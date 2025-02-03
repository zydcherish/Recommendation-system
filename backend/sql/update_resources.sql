-- 更新基础计算型实例
UPDATE resources 
SET name = '轻量云服务器 Basic',
    description = '经济实惠的入门级云服务器，麻雀虽小五脏俱全。适合个人网站、开发测试、学习环境等轻量级应用。性能稳定，价格实惠，是您进入云计算世界的最佳伙伴。'
WHERE id = 1;

-- 更新高性能计算型实例
UPDATE resources 
SET name = '高性能计算型 Pro',
    description = '强劲性能的专业级实例，像火箭一样快！配备高主频CPU和大容量内存，适合高性能计算、中型数据库、企业级应用等场景。让您的业务起飞！'
WHERE id = 2;

-- 更新基础服务器
UPDATE resources 
SET name = '云服务器 Standard',
    description = '均衡配置的标准型实例，性能与成本的完美平衡。适合中小型网站、应用服务器、开发环境等场景。稳定可靠，按需付费，助您业务稳步发展。'
WHERE id = 3;

-- 更新高级服务器
UPDATE resources 
SET name = '企业级服务器 Enterprise',
    description = '企业级高规格实例，为您的业务保驾护航。配备高性能硬件和企业级特性，适合核心数据库、关键业务系统等场景。像瑞士军刀一样，满足您的各种企业级需求！'
WHERE id = 4; 