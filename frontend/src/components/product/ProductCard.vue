<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-image">
      <img :src="productImage" :alt="product.name">
      <div class="product-tags">
        <el-tag v-if="product.usage_type" size="small" :type="getTagType(product.usage_type)">
          {{ getUsageTypeText(product.usage_type) }}
        </el-tag>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-specs">
        <div class="spec-item">
          <el-icon><CPU /></el-icon>
          <span>CPU: {{ product.cpu }}</span>
        </div>
        <div class="spec-item">
          <el-icon><Monitor /></el-icon>
          <span>内存: {{ product.memory }}</span>
        </div>
        <div class="spec-item">
          <el-icon><DataLine /></el-icon>
          <span>存储: {{ product.storage }}GB</span>
        </div>
      </div>
      <div class="product-footer">
        <div class="product-price">
          <span class="price-amount">¥{{ product.price }}</span>
          <span class="price-unit">/天</span>
        </div>
        <el-button type="primary" size="small" @click.stop="$emit('view-details')">
          查看详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CPU, Monitor, DataLine } from '@element-plus/icons-vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'view-details'])

const productImage = computed(() => {
  // 使用在线占位图片服务
  return `https://picsum.photos/400/300?random=${props.product.id}`
})

const getTagType = (type) => {
  const types = {
    ai: 'danger',
    scientific: 'primary',
    bigdata: 'warning',
    render: 'success'
  }
  return types[type] || 'info'
}

const getUsageTypeText = (type) => {
  const texts = {
    ai: 'AI训练',
    scientific: '科学计算',
    bigdata: '大数据',
    render: '渲染'
  }
  return texts[type] || type
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }

  .product-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-tags {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;
    }
  }

  .product-info {
    padding: 20px;

    .product-title {
      font-size: 18px;
      margin: 0 0 10px;
      color: var(--text-color);
    }

    .product-description {
      font-size: 14px;
      color: var(--text-color-secondary);
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-specs {
      margin-bottom: 20px;

      .spec-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: var(--text-color-secondary);

        .el-icon {
          font-size: 16px;
        }
      }
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .product-price {
        .price-amount {
          font-size: 24px;
          font-weight: bold;
          color: var(--primary-color);
        }

        .price-unit {
          font-size: 14px;
          color: var(--text-color-secondary);
        }
      }
    }
  }
}
</style> 