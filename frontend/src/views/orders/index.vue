<template>
  <div class="orders-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>我的订单</h1>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <template v-else>
        <!-- 订单筛选 -->
        <div class="filter-section">
          <el-radio-group v-model="filterStatus" @change="handleFilterChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="未支付">待支付</el-radio-button>
            <el-radio-button label="已支付">已支付</el-radio-button>
            <el-radio-button label="已取消">已取消</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 订单列表 -->
        <div class="orders-list" v-if="orders.length > 0">
          <div 
            v-for="order in orders" 
            :key="order.id" 
            class="order-card"
          >
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">订单号：{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.created_at) }}</span>
              </div>
              <div class="order-status" :class="order.status">
                {{ order.status }}
              </div>
            </div>

            <div class="order-content">
              <div class="resource-info">
                <h3>{{ order.resource_name }}</h3>
                <div class="specs">
                  <span class="spec-item">CPU: {{ order.cpu }}核</span>
                  <span class="spec-item">内存: {{ order.memory }}GB</span>
                  <span class="spec-item">存储: {{ order.storage }}GB</span>
                </div>
                <div class="duration">使用时长：{{ order.duration }}天</div>
              </div>
              
              <div class="price-actions">
                <div class="price">
                  <span class="amount">¥{{ order.total_price }}</span>
                </div>
                <div class="actions">
                  <template v-if="order.status === '未支付'">
                    <el-button 
                      type="primary" 
                      @click="goToPayment(order.id)"
                    >
                      去支付
                    </el-button>
                    <el-button 
                      @click="handleCancel(order.id)"
                    >
                      取消订单
                    </el-button>
                  </template>
                  <el-button 
                    v-else-if="order.status === '已支付'"
                    type="success" 
                    plain
                  >
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty 
          v-else 
          description="暂无订单"
        >
          <el-button type="primary" @click="$router.push('/products')">
            去选购
          </el-button>
        </el-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserOrders, cancelOrder } from '@/api/orders'

const router = useRouter()
const orders = ref([])
const loading = ref(false)
const filterStatus = ref('')

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    const res = await getUserOrders(params)
    orders.value = res.data
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error(error.message || '获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理筛选变化
const handleFilterChange = () => {
  fetchOrders()
}

// 跳转到支付页面
const goToPayment = (orderId) => {
  router.push(`/payment/${orderId}`)
}

// 取消订单
const handleCancel = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cancelOrder(orderId)
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error(error.message || '取消订单失败')
    }
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.orders-page {
  padding: 40px 0;
  min-height: 100vh;
  background-color: var(--background-color);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .page-header {
    margin-bottom: 30px;

    h1 {
      font-size: 28px;
      color: var(--text-color);
    }
  }

  .loading-container {
    padding: 40px;
    background: #fff;
    border-radius: 8px;
  }

  .filter-section {
    margin-bottom: 24px;
  }

  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .order-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background-color: #f8f9fa;
      border-bottom: 1px solid var(--border-color);

      .order-info {
        display: flex;
        gap: 24px;
        color: var(--text-color-secondary);

        .order-id {
          font-family: monospace;
        }
      }

      .order-status {
        font-weight: 500;

        &.未支付 {
          color: #e6a23c;
        }

        &.已支付 {
          color: #67c23a;
        }

        &.已取消 {
          color: #909399;
        }
      }
    }

    .order-content {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;

      .resource-info {
        flex: 1;

        h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: var(--text-color);
        }

        .specs {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
          color: var(--text-color-secondary);
        }

        .duration {
          color: var(--text-color-secondary);
        }
      }

      .price-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;

        .price {
          .amount {
            font-size: 24px;
            color: var(--primary-color);
            font-weight: bold;
          }
        }

        .actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .orders-page {
    .order-card {
      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .order-content {
        flex-direction: column;
        align-items: stretch;

        .price-actions {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style> 