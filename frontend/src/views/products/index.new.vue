<template>
  <div class="products-page">
    <!-- 页面标题区域 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>算力资源服务</h1>
          <p>为您的业务提供最优质的算力支持</p>
        </div>
      </div>
    </section>

    <!-- 筛选和搜索区域 -->
    <section class="filter-section">
      <div class="container">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索产品名称、描述..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>

        <!-- 筛选标签组 -->
        <div class="filter-groups">
          <!-- CPU核心数 -->
          <div class="filter-group">
            <h3>CPU</h3>
            <div class="tags">
              <el-tag
                v-for="core in cpuCores"
                :key="core"
                :type="selectedCpu === core ? 'primary' : 'info'"
                effect="light"
                class="filter-tag"
                @click="handleCpuSelect(core)"
              >
                {{ core }}核
              </el-tag>
            </div>
          </div>

          <!-- 内存大小 -->
          <div class="filter-group">
            <h3>内存</h3>
            <div class="tags">
              <el-tag
                v-for="mem in memoryOptions"
                :key="mem"
                :type="selectedMemory === mem ? 'primary' : 'info'"
                effect="light"
                class="filter-tag"
                @click="handleMemorySelect(mem)"
              >
                {{ mem }}GB
              </el-tag>
            </div>
          </div>

          <!-- 存储类型 -->
          <div class="filter-group">
            <h3>存储类型</h3>
            <div class="tags">
              <el-tag
                v-for="type in storageTypes"
                :key="type"
                :type="selectedStorageType === type ? 'primary' : 'info'"
                effect="light"
                class="filter-tag"
                @click="handleStorageTypeSelect(type)"
              >
                {{ type }}
              </el-tag>
            </div>
          </div>

          <!-- 用途 -->
          <div class="filter-group">
            <h3>用途</h3>
            <div class="tags">
              <el-tag
                v-for="usage in usageTypes"
                :key="usage.value"
                :type="selectedUsage === usage.value ? 'primary' : 'info'"
                effect="light"
                class="filter-tag"
                @click="handleUsageSelect(usage.value)"
              >
                {{ usage.label }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 已选择的筛选条件 -->
        <div class="selected-filters" v-if="hasActiveFilters">
          <span class="label">已选择：</span>
          <el-tag
            v-if="selectedCpu"
            closable
            @close="handleCpuSelect(null)"
          >
            CPU: {{ selectedCpu }}核
          </el-tag>
          <el-tag
            v-if="selectedMemory"
            closable
            @close="handleMemorySelect(null)"
          >
            内存: {{ selectedMemory }}GB
          </el-tag>
          <el-tag
            v-if="selectedStorageType"
            closable
            @close="handleStorageTypeSelect(null)"
          >
            存储: {{ selectedStorageType }}
          </el-tag>
          <el-tag
            v-if="selectedUsage"
            closable
            @close="handleUsageSelect(null)"
          >
            用途: {{ getUsageLabel(selectedUsage) }}
          </el-tag>
          <el-button
            type="text"
            class="clear-all"
            @click="clearAllFilters"
          >
            清除全部
          </el-button>
        </div>
      </div>
    </section>

    <!-- 产品列表区域 -->
    <section class="products-list">
      <div class="container">
        <el-skeleton :rows="6" animated v-if="loading" />
        <template v-else>
          <div class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
              @click="viewProduct(product)"
            >
              <div class="product-image">
                <img :src="getProductImage(product)" :alt="product.name">
              </div>
              <div class="product-info">
                <div class="category-tag" v-if="product.category">
                  <el-tag size="small" type="info" effect="plain">{{ product.category }}</el-tag>
                </div>
                <h3>{{ product.name }}</h3>
                <p class="description">{{ product.description }}</p>
                <div class="specs">
                  <el-tag size="small">CPU: {{ product.cpu }}核</el-tag>
                  <el-tag size="small" type="success">内存: {{ product.memory }}GB</el-tag>
                  <el-tag size="small" type="warning">存储: {{ product.storage }}GB</el-tag>
                </div>
                <div class="tags" v-if="product.tags && product.tags.length > 0">
                  <el-tag
                    v-for="tag in product.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="price">
                  <span class="amount">¥{{ product.price }}</span>
                  <span class="unit">/天</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 无搜索结果提示 -->
          <div v-if="filteredProducts.length === 0" class="no-results">
            <el-empty description="没有找到匹配的产品" />
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getProducts } from '@/api/product'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')
const loading = ref(false)

// 筛选选项
const selectedCpu = ref(null)
const selectedMemory = ref(null)
const selectedStorageType = ref(null)
const selectedUsage = ref(null)

// 筛选选项数据
const cpuCores = [2, 4, 8, 16, 32]
const memoryOptions = [4, 8, 16, 32, 64]
const storageTypes = ['ssd', 'hdd', 'nvme'].map(type => type.toUpperCase())
const usageTypes = [
  { value: 'ai', label: 'AI训练' },
  { value: 'scientific', label: '科学计算' },
  { value: 'bigdata', label: '大数据分析' },
  { value: 'render', label: '渲染' }
]

// 产品数据
const products = ref([])

// 获取产品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      cpu: selectedCpu.value,
      memory: selectedMemory.value,
      storage_type: selectedStorageType.value,
      usage_type: selectedUsage.value,
      keyword: searchQuery.value
    }
    console.log('请求参数:', params)
    const res = await getProducts(params)
    console.log('获取到的产品数据:', res)
    
    if (res?.code === 200 && Array.isArray(res.data)) {
      products.value = res.data.map(product => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        cpu: product.cpu?.toString() || '0',
        memory: product.memory?.toString() || '0',
        storage: product.storage?.toString() || '0',
        price: parseFloat(product.price || 0).toFixed(2),
        status: product.status || 'unavailable',
        category: product.category || '',
        storage_type: product.storage_type || 'ssd',
        usage_type: product.usage_type || 'general',
        image_url: product.image_url || `https://picsum.photos/400/300?random=${product.id}`,
        tags: Array.isArray(product.tags) ? product.tags : []
      }))
      console.log('处理后的产品数据:', products.value)
    } else {
      console.warn('未获取到产品数据:', res)
      products.value = []
      ElMessage.warning('暂无产品数据')
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    ElMessage.error(error.message || '获取产品列表失败')
    products.value = []
  } finally {
    loading.value = false
  }
}

// 计算筛选后的产品列表
const filteredProducts = computed(() => {
  return products.value
})

// 获取产品图片
const getProductImage = (product) => {
  return product.image_url || `https://picsum.photos/400/300?random=${product.id}`
}

// 获取产品标签
const getProductTags = (product) => {
  return product.tags || []
}

// 获取用途标签文本
const getUsageLabel = (value) => {
  const usage = usageTypes.find(type => type.value === value)
  return usage ? usage.label : value
}

// 处理搜索
const handleSearch = () => {
  fetchProducts()
}

// 处理CPU选择
const handleCpuSelect = (value) => {
  selectedCpu.value = value
  fetchProducts()
}

// 处理内存选择
const handleMemorySelect = (value) => {
  selectedMemory.value = value
  fetchProducts()
}

// 处理存储类型选择
const handleStorageTypeSelect = (value) => {
  selectedStorageType.value = value
  fetchProducts()
}

// 处理用途选择
const handleUsageSelect = (value) => {
  selectedUsage.value = value
  fetchProducts()
}

// 清除所有筛选条件
const clearAllFilters = () => {
  selectedCpu.value = null
  selectedMemory.value = null
  selectedStorageType.value = null
  selectedUsage.value = null
  searchQuery.value = ''
  fetchProducts()
}

// 查看产品详情
const viewProduct = (product) => {
  if (!product || !product.id) {
    ElMessage.warning('无效的产品信息')
    return
  }
  console.log('查看产品详情:', product)
  router.push({
    name: 'product-detail',
    params: { id: product.id.toString() }
  }).catch(err => {
    console.error('路由跳转失败:', err)
    ElMessage.error('页面跳转失败')
  })
}

// 判断是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return selectedCpu.value || selectedMemory.value || 
         selectedStorageType.value || selectedUsage.value
})

onMounted(() => {
  console.log('产品列表页面已挂载')
  fetchProducts()
})
</script>

<style lang="scss" scoped>
.products-page {
  min-height: 100vh;
  background-color: var(--background-color);
  position: relative;
  z-index: 1;
}

.page-header {
  background: linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%);
  color: #fff;
  padding: 60px 0;
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;

  .header-content {
    position: relative;
    z-index: 2;
  }

  h1 {
    font-size: 36px;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    opacity: 0.9;
  }
}

.filter-section {
  background: #fff;
  padding: 40px 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  z-index: 2;

  .search-box {
    max-width: 600px;
    margin: 0 auto 40px;
  }

  .filter-groups {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .filter-group {
    h3 {
      font-size: 16px;
      margin-bottom: 12px;
      color: var(--text-color);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .filter-tag {
      cursor: pointer;
      user-select: none;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .selected-filters {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .label {
      color: var(--text-color-secondary);
    }

    .clear-all {
      margin-left: auto;
    }
  }
}

.products-list {
  padding: 60px 0;

  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  .product-card {
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

    .product-image {
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .product-info {
      padding: 20px;

      .category-tag {
        margin-bottom: 12px;
      }

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

      .tags {
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

  .no-results {
    padding: 40px 0;
    text-align: center;
  }
}

@media (max-width: 1200px) {
  .products-list .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 16px;
    }
  }

  .filter-section {
    padding: 20px 0;

    .search-box {
      margin-bottom: 20px;
    }
  }

  .products-list {
    padding: 20px 0;

    .products-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
}
</style> 