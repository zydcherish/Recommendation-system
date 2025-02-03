<template>
  <div class="order-confirm">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>订单确认</h1>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <template v-else>
        <!-- 产品信息卡片 -->
        <div class="product-card">
          <h2>产品信息</h2>
          <div class="product-info">
            <div class="product-image">
              <img :src="getProductImage(product)" :alt="product?.name">
            </div>
            <div class="product-details">
              <h3>{{ product?.name }}</h3>
              <p class="description">{{ product?.description }}</p>
              <div class="specs">
                <div class="spec-item">
                  <span class="label">CPU:</span>
                  <span class="value">{{ product?.cpu }}核</span>
                </div>
                <div class="spec-item">
                  <span class="label">内存:</span>
                  <span class="value">{{ product?.memory }}GB</span>
                </div>
                <div class="spec-item">
                  <span class="label">存储:</span>
                  <span class="value">{{ product?.storage }}GB {{ product?.storage_type }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">用途:</span>
                  <span class="value">{{ getUsageTypeText(product?.usage_type) }}</span>
                </div>
              </div>
              <div class="price">
                <span class="amount">¥{{ product?.price }}</span>
                <span class="unit">/天</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单信息表单 -->
        <div class="order-form">
          <h2>订单信息</h2>
          <el-form 
            ref="formRef"
            :model="orderForm"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item 
              label="使用时长" 
              prop="duration"
              required
            >
              <el-input-number
                v-model="orderForm.duration"
                :min="1"
                :max="365"
                class="duration-input"
              />
              <span class="unit">天</span>
            </el-form-item>

            <el-form-item 
              label="联系人" 
              prop="contactName"
              required
            >
              <el-input
                v-model="orderForm.contactName"
                placeholder="请输入联系人姓名"
              />
            </el-form-item>

            <el-form-item 
              label="联系电话" 
              prop="contactPhone"
              required
            >
              <el-input
                v-model="orderForm.contactPhone"
                placeholder="请输入联系电话"
              />
            </el-form-item>

            <el-form-item 
              label="备注" 
              prop="remark"
            >
              <el-input
                v-model="orderForm.remark"
                type="textarea"
                placeholder="请输入备注信息（选填）"
                :rows="3"
              />
            </el-form-item>

            <!-- 订单金额 -->
            <div class="order-total">
              <div class="total-row">
                <span>单价：</span>
                <span class="price">¥{{ product?.price }}/天</span>
              </div>
              <div class="total-row">
                <span>时长：</span>
                <span>{{ orderForm.duration }}天</span>
              </div>
              <div class="total-row final">
                <span>总计：</span>
                <span class="total-price">¥{{ calculateTotal }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button @click="goBack">返回</el-button>
              <el-button 
                type="primary" 
                @click="submitOrder"
                :loading="submitting"
              >
                提交订单
              </el-button>
            </div>
          </el-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { createOrder } from '@/api/orders'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const product = ref(null)
const loading = ref(false)
const submitting = ref(false)

// 订单表单数据
const orderForm = ref({
  duration: 1,
  contactName: '',
  contactPhone: '',
  remark: ''
})

// 表单验证规则
const rules = {
  duration: [
    { required: true, message: '请选择使用时长', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '使用时长范围为1-365天', trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 计算总价
const calculateTotal = computed(() => {
  if (!product.value?.price || !orderForm.value.duration) return '0.00'
  return (parseFloat(product.value.price) * orderForm.value.duration).toFixed(2)
})

// 获取产品详情
const fetchProductDetail = async () => {
  loading.value = true
  try {
    console.log('开始获取产品详情, ID:', route.query.productId)
    const res = await getProductDetail(route.query.productId)
    console.log('获取到的产品详情响应:', res)

    if (res.data?.data) {
      product.value = {
        ...res.data.data,
        cpu: res.data.data.cpu?.toString() || '0',
        memory: res.data.data.memory?.toString() || '0',
        storage: res.data.data.storage?.toString() || '0',
        price: parseFloat(res.data.data.price || 0).toFixed(2)
      }
      console.log('处理后的产品数据:', product.value)
    } else {
      console.warn('未获取到产品数据:', res.data)
      ElMessage.error('产品不存在或已下架')
      router.push('/products')
    }
  } catch (error) {
    console.error('获取产品详情失败:', error)
    ElMessage.error('获取产品信息失败，请稍后重试')
    router.push('/products')
  } finally {
    loading.value = false
  }
}

// 获取产品图片
const getProductImage = (product) => {
  if (!product) return ''
  return product.imageUrl || `https://picsum.photos/400/300?random=${product.id}`
}

// 获取用途类型文本
const getUsageTypeText = (type) => {
  const types = {
    ai: 'AI训练',
    scientific: '科学计算',
    bigdata: '大数据分析',
    render: '渲染'
  }
  return types[type] || '通用计算'
}

// 提交订单
const submitOrder = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitting.value = true
    const orderData = {
      productId: product.value.id,
      duration: orderForm.value.duration,
      contactName: orderForm.value.contactName,
      contactPhone: orderForm.value.contactPhone,
      remark: orderForm.value.remark,
      totalAmount: calculateTotal.value
    }

    const res = await createOrder(orderData)
    if (res.data?.orderId) {
      ElMessage.success('订单提交成功')
      router.push(`/orders/${res.data.orderId}`)
    } else {
      ElMessage.error('订单提交失败，请重试')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error(error.message || '提交订单失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  if (!route.query.productId) {
    ElMessage.error('无效的产品信息')
    router.push('/products')
    return
  }
  fetchProductDetail()
})
</script>

<style lang="scss" scoped>
.order-confirm {
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

  .product-card {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;

    h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: var(--text-color);
    }

    .product-info {
      display: flex;
      gap: 24px;

      .product-image {
        width: 200px;
        height: 150px;
        border-radius: 4px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-details {
        flex: 1;

        h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: var(--text-color);
        }

        .description {
          color: var(--text-color-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .specs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;

          .spec-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .label {
              color: var(--text-color-secondary);
            }

            .value {
              color: var(--text-color);
              font-weight: 500;
            }
          }
        }

        .price {
          .amount {
            font-size: 24px;
            color: var(--primary-color);
            font-weight: bold;
          }

          .unit {
            color: var(--text-color-secondary);
            margin-left: 4px;
          }
        }
      }
    }
  }

  .order-form {
    background: #fff;
    padding: 24px;
    border-radius: 8px;

    h2 {
      font-size: 20px;
      margin-bottom: 24px;
      color: var(--text-color);
    }

    .duration-input {
      width: 160px;
      margin-right: 8px;
    }

    .unit {
      color: var(--text-color-secondary);
    }

    .order-total {
      margin: 24px 0;
      padding: 16px;
      background: var(--background-color);
      border-radius: 4px;

      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        color: var(--text-color-secondary);

        &.final {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          color: var(--text-color);
          font-weight: 500;

          .total-price {
            font-size: 24px;
            color: var(--primary-color);
          }
        }

        .price {
          color: var(--text-color);
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  }
}

@media (max-width: 768px) {
  .order-confirm {
    .product-card .product-info {
      flex-direction: column;

      .product-image {
        width: 100%;
        height: 200px;
      }
    }

    .product-details .specs {
      grid-template-columns: 1fr;
    }
  }
}
</style>