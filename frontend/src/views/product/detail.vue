<template>
  <div class="product-detail">
    <!-- 产品基本信息区域 -->
    <section class="product-header">
      <div class="container">
        <div class="product-info">
          <div class="product-image">
            <img :src="getProductImage(product)" :alt="product?.name">
          </div>
          <div class="product-content">
            <div class="category">{{ product?.category }}</div>
            <h1>{{ product?.name }}</h1>
            <p class="description">{{ product?.description }}</p>
            <div class="tags">
              <el-tag
                v-for="tag in getProductTags(product)"
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="specs-grid">
              <div class="spec-item">
                <div class="label">CPU</div>
                <div class="value">{{ product?.cpu }}</div>
              </div>
              <div class="spec-item">
                <div class="label">内存</div>
                <div class="value">{{ product?.memory }}</div>
              </div>
              <div class="spec-item">
                <div class="label">存储</div>
                <div class="value">{{ product?.storage }}GB</div>
              </div>
              <div class="spec-item">
                <div class="label">存储类型</div>
                <div class="value">{{ product?.storage_type?.toUpperCase() }}</div>
              </div>
            </div>
            <div class="price-section">
              <div class="price">
                <span class="amount">¥{{ product?.price }}</span>
                <span class="unit">/天</span>
              </div>
              <el-button 
                type="primary" 
                size="large" 
                @click="handleOrder"
                :disabled="product?.status !== 'available'"
              >
                {{ product?.status === 'available' ? '立即订购' : '暂时无法订购' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 详细信息标签页 -->
    <section class="product-tabs">
      <div class="container">
        <el-tabs>
          <!-- 配置详情 -->
          <el-tab-pane label="配置详情">
            <div class="specs-detail">
              <!-- CPU 详情 -->
              <div class="spec-section">
                <h3>CPU 配置</h3>
                <div class="spec-content" v-if="product">
                  <div class="spec-item">
                    <span class="label">核心数</span>
                    <span class="value">{{ getDetailedCpu(product.cpu).cores }}核</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">线程数</span>
                    <span class="value">{{ getDetailedCpu(product.cpu).threads }}线程</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">主频范围</span>
                    <span class="value">{{ getDetailedCpu(product.cpu).frequency }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">三级缓存</span>
                    <span class="value">{{ getDetailedCpu(product.cpu).cache }}</span>
                  </div>
                </div>
              </div>

              <!-- 内存详情 -->
              <div class="spec-section">
                <h3>内存配置</h3>
                <div class="spec-content" v-if="product">
                  <div class="spec-item">
                    <span class="label">容量</span>
                    <span class="value">{{ getDetailedMemory(product.memory).size }}GB</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">类型</span>
                    <span class="value">{{ getDetailedMemory(product.memory).type }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">频率</span>
                    <span class="value">{{ getDetailedMemory(product.memory).frequency }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">通道</span>
                    <span class="value">{{ getDetailedMemory(product.memory).channels }}</span>
                  </div>
                </div>
              </div>

              <!-- 存储详情 -->
              <div class="spec-section">
                <h3>存储配置</h3>
                <div class="spec-content" v-if="product">
                  <div class="spec-item">
                    <span class="label">容量</span>
                    <span class="value">{{ getDetailedStorage(product.storage, product.storage_type).capacity }}GB</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">类型</span>
                    <span class="value">{{ getDetailedStorage(product.storage, product.storage_type).type }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">接口</span>
                    <span class="value">{{ getDetailedStorage(product.storage, product.storage_type).speed }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">IOPS</span>
                    <span class="value">{{ getDetailedStorage(product.storage, product.storage_type).iops }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 适用场景 -->
          <el-tab-pane label="适用场景">
            <div class="usage-scenarios">
              <div class="scenario">
                <h3>{{ getUsageTitle(product?.usage_type) }}</h3>
                <p>{{ getUsageDescription(product?.usage_type) }}</p>
                <ul class="features">
                  <li v-for="(feature, index) in getUsageFeatures(product?.usage_type)" 
                      :key="index">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </el-tab-pane>

          <!-- 用户评价 -->
          <el-tab-pane label="用户评价">
            <div class="reviews">
              <div class="review-stats">
                <div class="rating">
                  <span class="score">4.8</span>
                  <el-rate v-model="averageRating" disabled show-score />
                </div>
                <div class="total">共 126 条评价</div>
              </div>
              
              <!-- 评价列表 -->
              <div class="review-list">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <span class="username">{{ review.username }}</span>
                    <el-rate v-model="review.rating" disabled />
                    <span class="time">{{ review.time }}</span>
                  </div>
                  <div class="review-content">{{ review.content }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const averageRating = ref(4.8)
const loading = ref(false)

// 模拟评价数据
const reviews = ref([
  {
    id: 1,
    username: '用户123456',
    rating: 5,
    time: '2024-01-15',
    content: '性能非常好，AI训练速度提升明显，客服响应也很及时。'
  },
  {
    id: 2,
    username: '用户789012',
    rating: 4,
    time: '2024-01-14',
    content: '总体来说很不错，就是价格稍微有点小贵。'
  },
  {
    id: 3,
    username: '用户345678',
    rating: 5,
    time: '2024-01-13',
    content: '非常适合我们的深度学习项目，已经续费使用了。'
  }
])

// 获取产品详情
const fetchProductDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (!id) {
      throw new Error('产品ID不能为空')
    }
    console.log('开始获取产品详情, ID:', id)
    const res = await getProductDetail(id)
    console.log('获取到的产品详情响应:', res)

    if (res && res.code === 200 && res.data) {
      const data = res.data
      product.value = {
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        cpu: data.cpu?.toString() || '0',
        memory: data.memory?.toString() || '0',
        storage: data.storage?.toString() || '0',
        price: parseFloat(data.price || 0).toFixed(2),
        status: data.status || 'unavailable',
        category: data.category || '',
        storage_type: data.storage_type || 'ssd',
        usage_type: data.usage_type || 'general',
        image_url: data.image_url || `https://picsum.photos/800/600?random=${data.id}`,
        tags: Array.isArray(data.tags) ? data.tags : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      console.log('处理后的产品数据:', product.value)
    } else {
      throw new Error(res?.message || '产品不存在或已下架')
    }
  } catch (error) {
    console.error('获取产品详情失败:', error)
    ElMessage.error(error.message || '获取产品详情失败，请稍后重试')
    router.push('/products')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('产品详情页面已挂载')
  fetchProductDetail()
})

// 获取产品图片
const getProductImage = (product) => {
  if (!product) return ''
  return product.image_url || `https://picsum.photos/800/600?random=${product.id}`
}

// 获取产品标签
const getProductTags = (product) => {
  if (!product || !product.tags) return []
  return Array.isArray(product.tags) ? product.tags : []
}

// 获取详细CPU信息
const getDetailedCpu = (cpu) => {
  const cores = parseInt(cpu)
  return {
    cores,
    threads: cores * 2,
    frequency: '2.5GHz-3.8GHz',
    cache: '16MB L3'
  }
}

// 获取详细内存信息
const getDetailedMemory = (memory) => {
  const size = parseInt(memory)
  return {
    size,
    type: 'DDR4',
    frequency: '3200MHz',
    channels: size >= 32 ? '四通道' : '双通道'
  }
}

// 获取详细存储信息
const getDetailedStorage = (storage, type) => {
  return {
    capacity: storage,
    type: type?.toUpperCase() || 'SSD',
    speed: type?.toLowerCase() === 'nvme' ? 'PCIe 4.0 x4' : 'SATA 6Gb/s',
    iops: type?.toLowerCase() === 'nvme' ? '1,000,000' : '100,000'
  }
}

// 获取预装软件信息
const getPreinstalledSoftware = (usageType) => {
  const software = {
    ai: 'CUDA 11.4, cuDNN 8.2, PyTorch, TensorFlow',
    scientific: 'Intel MKL, OpenMPI, GCC',
    bigdata: 'Hadoop, Spark, Hive',
    render: 'Blender, V-Ray, OctaneRender'
  }
  return software[usageType] || '基础开发环境'
}

// 获取使用场景标题
const getUsageTitle = (usageType) => {
  const titles = {
    ai: 'AI训练和深度学习',
    scientific: '科学计算和仿真',
    bigdata: '大数据分析和处理',
    render: '3D渲染和视频处理'
  }
  return titles[usageType] || '通用计算'
}

// 获取使用场景描述
const getUsageDescription = (usageType) => {
  const descriptions = {
    ai: '专为深度学习和AI训练优化的高性能计算节点，配备顶级GPU加速器。',
    scientific: '面向科学计算和数值模拟的计算节点，提供高精度浮点运算支持。',
    bigdata: '针对大规模数据处理和分析的节点，具备优化的存储和内存配置。',
    render: '专业的渲染农场节点，优化的GPU性能和存储配置，适合3D渲染和视频处理任务。'
  }
  return descriptions[usageType] || '通用计算场景，适合各类开发和测试环境。'
}

// 获取使用场景特点
const getUsageFeatures = (usageType) => {
  const features = {
    ai: [
      '支持主流深度学习框架',
      '配备高性能GPU加速器',
      '优化的CUDA环境',
      '大内存配置适合大模型训练'
    ],
    scientific: [
      '高性能CPU适合并行计算',
      '优化的数值计算库',
      '支持MPI分布式计算',
      '高带宽内存配置'
    ],
    bigdata: [
      '大容量内存配置',
      '高速NVMe存储',
      '优化的网络性能',
      '支持分布式计算框架'
    ],
    render: [
      '专业GPU渲染加速',
      '大容量显存',
      '支持主流渲染引擎',
      '优化的IO性能'
    ]
  }
  return features[usageType] || ['通用计算性能', '稳定可靠', '性价比高']
}

// 处理订购
const handleOrder = () => {
  if (!product.value || product.value.status !== 'available') {
    ElMessage.warning('该产品当前无法订购')
    return
  }
  
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }
  
  router.push({
    path: '/order/confirm',
    query: { productId: product.value.id }
  }).catch(err => {
    console.error('路由跳转失败:', err)
    ElMessage.error('页面跳转失败')
  })
}
</script>

<style lang="scss" scoped>
.product-detail {
  min-height: 100vh;
  background-color: var(--background-color);
}

.product-header {
  padding: 60px 0;
  background: #fff;
  
  .product-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;

    .product-image {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .product-content {
      h1 {
        font-size: 32px;
        margin-bottom: 16px;
        color: var(--text-color);
      }

      .description {
        font-size: 16px;
        color: var(--text-color-secondary);
        margin-bottom: 32px;
        line-height: 1.6;
      }

      .category {
        display: inline-block;
        background: var(--primary-color);
        color: #fff;
        padding: 4px 12px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 14px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 24px;
      }

      .specs-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 32px;

        .spec-item {
          background: var(--background-color);
          padding: 16px;
          border-radius: 8px;

          .label {
            color: var(--text-color-secondary);
            margin-bottom: 8px;
            font-size: 14px;
          }

          .value {
            color: var(--text-color);
            font-size: 16px;
            font-weight: 500;
          }
        }
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 24px;

        .price {
          .amount {
            font-size: 36px;
            color: var(--primary-color);
            font-weight: bold;
          }

          .unit {
            font-size: 16px;
            color: var(--text-color-secondary);
          }
        }
      }
    }
  }
}

.product-tabs {
  padding: 40px 0;

  :deep(.el-tabs__nav-wrap) {
    &::after {
      height: 1px;
    }
  }

  .specs-detail {
    padding: 20px;

    .spec-section {
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        font-size: 18px;
        margin-bottom: 20px;
        color: var(--text-color);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 10px;
      }

      .spec-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .spec-item {
          display: flex;
          align-items: center;
          
          .label {
            color: var(--text-color-secondary);
            margin-right: 10px;
            min-width: 80px;
          }

          .value {
            color: var(--text-color);
            font-weight: 500;
          }
        }
      }
    }
  }

  .usage-scenarios {
    padding: 24px 0;

    .scenario {
      h3 {
        font-size: 20px;
        margin-bottom: 16px;
        color: var(--text-color);
      }

      p {
        color: var(--text-color-secondary);
        line-height: 1.6;
        margin-bottom: 24px;
      }

      .features {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        li {
          position: relative;
          padding-left: 24px;
          color: var(--text-color);

          &::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--primary-color);
          }
        }
      }
    }
  }

  .reviews {
    padding: 24px 0;

    .review-stats {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;

      .rating {
        display: flex;
        align-items: center;
        gap: 16px;

        .score {
          font-size: 36px;
          font-weight: bold;
          color: var(--primary-color);
        }
      }

      .total {
        color: var(--text-color-secondary);
      }
    }

    .review-list {
      .review-item {
        padding: 24px 0;
        border-bottom: 1px solid var(--border-color);

        &:last-child {
          border-bottom: none;
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;

          .username {
            font-weight: 500;
          }

          .time {
            color: var(--text-color-secondary);
            font-size: 14px;
          }
        }

        .review-content {
          color: var(--text-color);
          line-height: 1.6;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .product-header .product-info {
    grid-template-columns: 1fr;
  }

  .usage-scenarios .scenario .features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-header {
    padding: 40px 0;

    .product-content {
      h1 {
        font-size: 24px;
      }

      .specs-grid {
        grid-template-columns: 1fr;
      }
    }
  }

  .specs-detail .spec-section .spec-content {
    grid-template-columns: 1fr;
  }
}
</style> 