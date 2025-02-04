<template>
  <div class="hot-resources">
    <h2 class="section-title">热门算力资源</h2>
    <div class="resources-grid">
      <el-skeleton v-if="loading" :rows="3" animated />
      <template v-else>
        <div v-for="resource in hotResources" :key="resource.id" class="resource-card" @click="viewResource(resource)">
          <div class="resource-image">
            <img :src="getResourceImage(resource)" :alt="resource.name">
          </div>
          <div class="resource-info">
            <h3>{{ resource.name }}</h3>
            <p class="description">{{ resource.description }}</p>
            <div class="specs">
              <el-tag size="small">CPU: {{ resource.cpu }}核</el-tag>
              <el-tag size="small" type="success">内存: {{ resource.memory }}GB</el-tag>
              <el-tag size="small" type="warning">存储: {{ resource.storage }}GB</el-tag>
            </div>
            <div class="price">
              <span class="amount">¥{{ resource.price }}</span>
              <span class="unit">/天</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="view-more">
      <el-button type="primary" @click="viewAllResources">查看更多</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHotProducts } from '@/api/product'
import { ElMessage } from 'element-plus'

const router = useRouter()
const hotResources = ref([])
const loading = ref(false)

// 获取热门资源
const fetchHotResources = async () => {
  loading.value = true
  try {
    console.log('开始获取热门资源')
    const res = await getHotProducts()
    console.log('获取到的热门资源响应:', res)

    if (res?.code === 200 && Array.isArray(res.data)) {
      hotResources.value = res.data.map(resource => ({
        id: resource.id,
        name: resource.name || '',
        description: resource.description || '',
        cpu: resource.cpu?.toString().replace('核', '') || '0',
        memory: resource.memory?.toString().replace('GB', '') || '0',
        storage: resource.storage?.toString().replace('GB', '') || '0',
        price: parseFloat(resource.price || 0).toFixed(2),
        imageUrl: resource.image_url || `https://picsum.photos/400/300?random=${resource.id}`,
        status: resource.status || 'unavailable'
      }))
    } else {
      // 如果API暂时不可用，使用测试数据
      hotResources.value = [
        {
          id: 1,
          name: '高性能计算型 Pro',
          description: '强劲性能的专业级实例，适合高性能计算、中型数据库、企业级应用等场景。',
          cpu: '32',
          memory: '64',
          storage: '500',
          price: '299.00',
          imageUrl: 'https://picsum.photos/400/300?random=1',
          status: 'available'
        },
        {
          id: 2,
          name: '轻量云服务器 Basic',
          description: '经济实惠的入门级云服务器，适合个人网站、开发测试、学习环境等轻量级应用。',
          cpu: '4',
          memory: '8',
          storage: '100',
          price: '49.00',
          imageUrl: 'https://picsum.photos/400/300?random=2',
          status: 'available'
        },
        {
          id: 3,
          name: '企业级服务器 Enterprise',
          description: '企业级高规格实例，适合核心数据库、关键业务系统等场景。',
          cpu: '64',
          memory: '128',
          storage: '1000',
          price: '599.00',
          imageUrl: 'https://picsum.photos/400/300?random=3',
          status: 'available'
        }
      ]
    }
    console.log('处理后的热门资源数据:', hotResources.value)
  } catch (error) {
    console.error('获取热门资源失败:', error)
    // 使用测试数据作为后备方案
    hotResources.value = [
      {
        id: 1,
        name: '高性能计算型 Pro',
        description: '强劲性能的专业级实例，适合高性能计算、中型数据库、企业级应用等场景。',
        cpu: '32',
        memory: '64',
        storage: '500',
        price: '299.00',
        imageUrl: 'https://picsum.photos/400/300?random=1',
        status: 'available'
      },
      {
        id: 2,
        name: '轻量云服务器 Basic',
        description: '经济实惠的入门级云服务器，适合个人网站、开发测试、学习环境等轻量级应用。',
        cpu: '4',
        memory: '8',
        storage: '100',
        price: '49.00',
        imageUrl: 'https://picsum.photos/400/300?random=2',
        status: 'available'
      },
      {
        id: 3,
        name: '企业级服务器 Enterprise',
        description: '企业级高规格实例，适合核心数据库、关键业务系统等场景。',
        cpu: '64',
        memory: '128',
        storage: '1000',
        price: '599.00',
        imageUrl: 'https://picsum.photos/400/300?random=3',
        status: 'available'
      }
    ]
  } finally {
    loading.value = false
  }
}

// 获取资源图片
const getResourceImage = (resource) => {
  return resource.imageUrl || `https://picsum.photos/400/300?random=${resource.id}`
}

// 查看资源详情
const viewResource = (resource) => {
  router.push(`/product/${resource.id}`)
}

// 查看全部资源
const viewAllResources = () => {
  router.push('/products')
}

onMounted(() => {
  console.log('HotResources组件已挂载')
  fetchHotResources()
})
</script>

<style lang="scss" scoped>
.hot-resources {
  padding: 60px 0;

  .section-title {
    text-align: center;
    font-size: 32px;
    margin-bottom: 40px;
    color: var(--text-color);
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 40px;
    padding: 0 20px;
  }

  .resource-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .resource-image {
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .resource-info {
      padding: 20px;

      h3 {
        font-size: 18px;
        margin-bottom: 10px;
        color: var(--text-color);
      }

      .description {
        color: var(--text-color-secondary);
        margin-bottom: 15px;
        height: 40px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .specs {
        display: flex;
        gap: 8px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }

      .price {
        .amount {
          font-size: 24px;
          color: var(--primary-color);
          font-weight: bold;
        }

        .unit {
          color: var(--text-color-secondary);
        }
      }
    }
  }

  .view-more {
    text-align: center;
  }
}

@media (max-width: 1200px) {
  .hot-resources .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hot-resources {
    padding: 40px 0;

    .section-title {
      font-size: 24px;
      margin-bottom: 30px;
    }

    .resources-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 