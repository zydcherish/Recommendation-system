<template>
  <div class="hot-resources">
    <h2 class="section-title">热门算力资源</h2>
    <div class="resources-grid">
      <el-skeleton-item v-if="loading" v-for="i in 3" :key="i" />
      <div v-else v-for="resource in hotResources" :key="resource.id" class="resource-card" @click="viewResource(resource)">
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
    console.log('请求URL:', `${import.meta.env.VITE_API_URL}/resources/hot`)
    
    const res = await getHotProducts()
    console.log('获取到的热门资源响应:', res)

    if (res.data?.data && Array.isArray(res.data.data)) {
      hotResources.value = res.data.data.map(resource => ({
        ...resource,
        cpu: resource.cpu?.toString() || '0',
        memory: resource.memory?.toString() || '0',
        storage: resource.storage?.toString() || '0',
        price: parseFloat(resource.price || 0).toFixed(2)
      }))
      console.log('处理后的热门资源数据:', hotResources.value)
    } else {
      console.warn('未获取到热门资源数据:', res.data)
      hotResources.value = []
      ElMessage.warning('暂无热门资源')
    }
  } catch (error) {
    console.error('获取热门资源失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })
    
    const errorMessage = error.response?.data?.message || error.message || '获取热门资源失败'
    ElMessage.error(errorMessage)
    hotResources.value = []
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
  .resources-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr !important;
  }

  .hot-resources {
    padding: 40px 0;

    .section-title {
      font-size: 24px;
      margin-bottom: 30px;
    }
  }
}
</style> 