/*
 Navicat Premium Data Transfer

 Source Server         : 雾散时风起
 Source Server Type    : MySQL
 Source Server Version : 80033
 Source Host           : localhost:3306
 Source Schema         : arithmetic_recommendation

 Target Server Type    : MySQL
 Target Server Version : 80033
 File Encoding         : 65001

 Date: 01/02/2025 15:18:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for browsing_history
-- ----------------------------
DROP TABLE IF EXISTS `browsing_history`;
CREATE TABLE `browsing_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int NOT NULL,
  `timestamp` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `resource_id`(`resource_id`) USING BTREE,
  CONSTRAINT `browsing_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `browsing_history_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of browsing_history
-- ----------------------------

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int NOT NULL,
  `status` enum('未支付','已支付','已取消') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(10, 2) NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int NOT NULL DEFAULT 1 COMMENT '使用时长(天)',
  `start_time` datetime NULL DEFAULT NULL COMMENT '资源开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '资源结束时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '订单备注',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `resource_id`(`resource_id`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (4, 7, 1, '已支付', 1, 99.99, '2025-01-15 14:48:51', '2025-01-21 23:02:56', 1, NULL, NULL, NULL);
INSERT INTO `orders` VALUES (5, 7, 1, '已取消', 1, 99.99, '2025-01-15 14:50:00', '2025-01-21 23:02:56', 1, NULL, NULL, NULL);
INSERT INTO `orders` VALUES (6, 8, 3, '未支付', 1, 2399.76, '2025-01-30 15:06:15', '2025-01-30 15:06:15', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (7, 8, 3, '未支付', 1, 2399.76, '2025-01-30 15:11:31', '2025-01-30 15:11:31', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (8, 8, 3, '未支付', 1, 2399.76, '2025-01-30 15:14:51', '2025-01-30 15:14:51', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (9, 8, 4, '未支付', 1, 4799.76, '2025-01-30 15:27:16', '2025-01-30 15:27:16', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (10, 8, 4, '未支付', 1, 4799.76, '2025-01-30 15:29:03', '2025-01-30 15:29:03', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (11, 8, 4, '未支付', 1, 4799.76, '2025-01-30 16:08:48', '2025-01-30 16:08:48', 1, NULL, NULL, '');
INSERT INTO `orders` VALUES (12, 8, 4, '已支付', 1, 4799.76, '2025-01-30 20:17:32', '2025-01-30 20:17:48', 1, NULL, NULL, '');

-- ----------------------------
-- Table structure for recommendations
-- ----------------------------
DROP TABLE IF EXISTS `recommendations`;
CREATE TABLE `recommendations`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int NOT NULL,
  `recommendation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `resource_id`(`resource_id`) USING BTREE,
  CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of recommendations
-- ----------------------------

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '资源描述',
  `cpu` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `memory` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `storage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `storage_type` enum('ssd','hdd','nvme') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'ssd',
  `usage_type` enum('ai','scientific','bigdata','render') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'scientific',
  `price` decimal(10, 2) NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('available','unavailable') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'available',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES (1, '基础计算型', '基础计算型实例，适合小型开发测试环境，提供稳定的计算性能', '2核', '4GB', '100GB', 'ssd', 'scientific', 99.99, '入门级', 'basic,economical', '2025-01-14 23:06:59', '2025-01-22 00:46:21', 'basic', 'available');
INSERT INTO `resources` VALUES (2, '高性能计算型', '高性能计算型实例，适合开发和生产环境，提供强劲的计算能力', '8核', '16GB', '500GB', 'ssd', 'scientific', 299.99, '专业级', 'high-performance,professional', '2025-01-14 23:06:59', '2025-01-22 00:46:21', 'performance', 'available');
INSERT INTO `resources` VALUES (3, '基础服务器', '基础服务器型实例，适合小型应用部署，性价比高', '2核', '4GB', '100GB', 'ssd', 'scientific', 99.99, '入门级', NULL, '2025-01-15 10:25:11', '2025-01-22 23:45:50', 'basic', 'available');
INSERT INTO `resources` VALUES (4, '高级服务器', '高级服务器型实例，适合中大型应用和数据库，性能强劲', '4核', '8GB', '200GB', 'ssd', 'scientific', 199.99, '专业级', NULL, '2025-01-15 10:25:11', '2025-01-22 23:45:53', 'premium', 'available');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `registration_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$aVD2MBkq0WDgSRCBU7fvfuqpC6lCAvMs40e37NHwGCEfy6wBmwLSC', 'zyd665544@qq.com', '13947405544', 'admin', '2025-01-14 15:47:40', '2025-01-31 18:21:29', 'active');
INSERT INTO `users` VALUES (5, 'testuser123', '$2a$10$zZrMC.1TyugU8vAAQyxUz..YcUYY6Mn4RIYaOELabNs/l8/PRn9HK', 'test123@example.com', '13800138123', 'user', '2025-01-15 11:32:54', NULL, 'active');
INSERT INTO `users` VALUES (6, 'testuser1_updated', '$2a$10$N9eYnuD.ars/4LFG5PCRnO4SF6xHvAQFtZQGhS0uDzJuFmWrS21KG', 'test1_updated@example.com', '13800138002', 'user', '2025-01-15 12:06:49', '2025-01-15 12:07:50', 'active');
INSERT INTO `users` VALUES (7, 'testuser1', '$2a$10$fQFUaT4c3V8PbIwo9MThteBH73qIImPtCszIGqWaO0BKNf.dEVnCS', 'test1@example.com', '13800138001', 'user', '2025-01-15 14:15:18', '2025-01-15 14:48:15', 'active');
INSERT INTO `users` VALUES (8, '小明', '$2a$10$ZOoGTIlPlb5nyA133lC4A.UfNhs1FDVImm8imSYAlhxFH0mVolHGu', 'zyd111@qq.com', '15148579585', 'user', '2025-01-16 10:48:05', '2025-01-31 17:55:23', 'active');
INSERT INTO `users` VALUES (9, '小红', '$2a$10$o0K./udGzu31SoWrHycFu.fXkB1emfO5n01B8sBeK/bFuR1067UDS', 'zyd222@qq.com', '15148579555', 'user', '2025-01-16 14:09:10', '2025-01-21 15:57:38', 'active');

SET FOREIGN_KEY_CHECKS = 1;
