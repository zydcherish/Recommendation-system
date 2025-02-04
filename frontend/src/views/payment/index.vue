<template>
  <div class="payment-page">
    <div class="container">
      <div class="payment-card">
        <!-- 倒计时提示 -->
        <div class="countdown-tip">
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              <span class="countdown-text">
                请在{{ countdownMinutes }}分{{ countdownSeconds.toString().padStart(2, '0') }}秒内完成支付
              </span>
            </template>
          </el-alert>
        </div>

        <!-- 订单信息 -->
        <div class="order-info">
          <h2>订单信息</h2>
          <div class="info-list">
            <div class="info-item">
              <span class="label">订单编号：</span>
              <span class="value">{{ orderDetail.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ formatDate(orderDetail.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">商品名称：</span>
              <span class="value">{{ orderDetail.resource_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">使用时长：</span>
              <span class="value">{{ orderDetail.duration }}天</span>
            </div>
            <div class="info-item">
              <span class="label">商品单价：</span>
              <span class="value">¥{{ orderDetail.price }}/天</span>
            </div>
            <div class="info-item">
              <span class="label">订单总价：</span>
              <span class="value price">¥{{ orderDetail.total_price }}</span>
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="resource-info">
          <h2>商品信息</h2>
          <div class="specs-list">
            <div class="spec-item">
              <span class="label">CPU：</span>
              <span class="value">{{ orderDetail.cpu }}</span>
            </div>
            <div class="spec-item">
              <span class="label">内存：</span>
              <span class="value">{{ orderDetail.memory }}</span>
            </div>
            <div class="spec-item">
              <span class="label">存储：</span>
              <span class="value">{{ orderDetail.storage }}</span>
            </div>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="user-info">
          <h2>用户信息</h2>
          <div class="info-list">
            <div class="info-item">
              <span class="label">联系人：</span>
              <span class="value">{{ orderDetail.contact_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ orderDetail.contact_phone }}</span>
            </div>
            <div class="info-item" v-if="orderDetail.remark">
              <span class="label">备注：</span>
              <span class="value">{{ orderDetail.remark }}</span>
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="payment-methods">
          <h2>选择支付方式</h2>
          <div class="methods-list">
            <div class="payment-options">
              <div 
                class="payment-option" 
                :class="{ active: paymentMethod === 'alipay' }"
                @click="paymentMethod = 'alipay'"
              >
                <img src="@/assets/images/alipay.svg" alt="支付宝" class="payment-icon">
                <span>支付宝</span>
              </div>
              <div 
                class="payment-option"
                :class="{ active: paymentMethod === 'wechat' }"
                @click="paymentMethod = 'wechat'"
              >
                <img src="@/assets/images/wechat.svg" alt="微信支付" class="payment-icon">
                <span>微信支付</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button @click="$router.back()">返回</el-button>
          <el-button 
            type="primary" 
            :loading="loading"
            @click="handlePayment"
          >
            立即支付
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, payOrder } from '@/api/orders'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const paymentMethod = ref('alipay')
const orderDetail = ref({})

// 倒计时相关
const countdownMinutes = ref(15)
const countdownSeconds = ref(0)
let countdownTimer = null

// 开始倒计时
const startCountdown = () => {
  const endTime = Date.now() + 15 * 60 * 1000 // 15分钟
  
  countdownTimer = setInterval(() => {
    const now = Date.now()
    const diff = endTime - now
    
    if (diff <= 0) {
      clearInterval(countdownTimer)
      ElMessage.warning('支付超时，请重新下单')
      router.push('/orders')
      return
    }
    
    countdownMinutes.value = Math.floor(diff / 1000 / 60)
    countdownSeconds.value = Math.floor((diff / 1000) % 60)
  }, 1000)
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    const orderId = route.params.id
    const res = await getOrderDetail(orderId)
    if (res?.code === 200 && res.data) {
      orderDetail.value = res.data
    } else {
      ElMessage.error('获取订单信息失败')
      router.push('/orders')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error(error.message || '获取订单信息失败')
    router.push('/orders')
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
    minute: '2-digit',
    second: '2-digit'
  })
}

// 处理支付
const handlePayment = async () => {
  try {
    loading.value = true
    const res = await payOrder({
      orderId: orderDetail.value.id,
      paymentMethod: paymentMethod.value
    })
    
    if (res?.code === 200) {
      ElMessage.success('支付成功')
      router.push('/orders')
    } else {
      throw new Error(res?.message || '支付失败')
    }
  } catch (error) {
    console.error('支付失败:', error)
    ElMessage.error(error.message || '支付失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!route.params.id) {
    ElMessage.error('无效的订单信息')
    router.push('/orders')
    return
  }
  fetchOrderDetail()
  startCountdown() // 启动倒计时
})
</script>

<style lang="scss" scoped>
.payment-page {
  padding: 40px 0;
  min-height: 100vh;
  background-color: var(--background-color);

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .payment-card {
    background: #fff;
    border-radius: 8px;
    padding: 32px;

    h2 {
      font-size: 20px;
      margin-bottom: 24px;
      color: var(--text-color);
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background-color: var(--primary-color);
        margin-right: 8px;
        border-radius: 2px;
      }
    }
  }

  .countdown-tip {
    margin-bottom: 32px;

    .countdown-text {
      font-size: 14px;
      
      .time {
        color: var(--el-color-danger);
        font-weight: bold;
        font-family: monospace;
        font-size: 16px;
        margin: 0 4px;
      }
    }
  }

  .order-info, .resource-info, .user-info {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border-color);

    .info-list, .specs-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-item, .spec-item {
      display: flex;
      align-items: center;

      .label {
        color: var(--text-color-secondary);
        margin-right: 8px;
        min-width: 80px;
      }

      .value {
        color: var(--text-color);
        
        &.price {
          color: var(--primary-color);
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }

  .payment-methods {
    margin-bottom: 32px;

    .payment-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 0 20px;
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      background-color: #fff;

      &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: var(--primary-color);
        background-color: var(--el-color-primary-light-9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .payment-icon {
        width: 32px;
        height: 32px;
      }

      span {
        font-size: 16px;
        color: var(--text-color);
        font-weight: 500;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .payment-page {
    .payment-card {
      padding: 20px;
    }

    .order-info, .resource-info, .user-info {
      .info-list, .specs-list {
        grid-template-columns: 1fr;
      }
    }

    .payment-methods {
      .payment-options {
        grid-template-columns: 1fr;
        padding: 0;
      }
    }
  }
}
</style> 