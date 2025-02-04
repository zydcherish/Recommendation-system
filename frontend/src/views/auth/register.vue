<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-left">
        <div class="welcome-text">
          <h1>欢迎加入</h1>
          <h2>算力资源推荐系统</h2>
          <p>智能推荐 · 按需购买 · 高效服务</p>
        </div>
        <div class="decoration-icons">
          <div class="icon-row">
            <el-icon size="48"><Monitor /></el-icon>
            <el-icon size="48"><Platform /></el-icon>
          </div>
          <div class="icon-row">
            <el-icon size="48"><DataAnalysis /></el-icon>
            <el-icon size="48"><Cpu /></el-icon>
          </div>
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-box">
          <div class="register-header">
            <h2>账号注册</h2>
            <p>创建您的账号，开启智能推荐之旅</p>
          </div>
          
          <el-form 
            ref="registerFormRef"
            :model="registerForm"
            :rules="rules"
            class="register-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                :prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                class="register-button"
                :loading="loading"
                @click="handleRegister"
                size="large"
              >
                注册
              </el-button>
            </el-form-item>

            <div class="form-footer">
              <span>已有账号？</span>
              <router-link to="/auth/login" class="login-link">立即登录</router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  User,
  Message,
  Lock,
  Monitor,
  Platform,
  DataAnalysis,
  Cpu
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const registerFormRef = ref(null)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    // 1. 表单验证
    await registerFormRef.value.validate()
    loading.value = true
    
    // 2. 调用注册API
    const result = await userStore.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    })

    // 3. 注册成功，显示消息并跳转到登录页
    ElMessage.success('注册成功')
    // 延迟跳转，确保消息显示完成
    setTimeout(() => {
      router.push('/auth/login')
    }, 1500)
  } catch (error) {
    // 4. 只在这里处理错误
    console.error('Registration error:', error)
    ElMessage.error(error.response?.data?.message || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-5) 100%);
  padding: 40px;
  
  .register-content {
    width: 1000px;
    height: 700px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
    
    .register-left {
      flex: 1;
      background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      
      .welcome-text {
        h1 {
          font-size: 36px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        
        h2 {
          font-size: 28px;
          margin-bottom: 24px;
          opacity: 0.9;
        }
        
        p {
          font-size: 18px;
          opacity: 0.8;
        }
      }
      
      .decoration-icons {
        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: center;
        margin-top: 40px;
        
        .icon-row {
          display: flex;
          gap: 40px;
          
          .el-icon {
            opacity: 0.8;
            transition: all 0.3s ease;
            
            &:hover {
              opacity: 1;
              transform: scale(1.1);
            }
          }
        }
      }
    }
    
    .register-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      
      .register-box {
        width: 100%;
        max-width: 360px;
        
        .register-header {
          text-align: center;
          margin-bottom: 40px;
          
          h2 {
            font-size: 28px;
            color: var(--el-text-color-primary);
            margin-bottom: 12px;
          }
          
          p {
            color: var(--el-text-color-secondary);
            font-size: 14px;
          }
        }
        
        .register-form {
          .el-input {
            --el-input-height: 48px;
            
            :deep(.el-input__wrapper) {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
          }
          
          .register-button {
            width: 100%;
            height: 48px;
            font-size: 16px;
            margin-top: 20px;
          }
          
          .form-footer {
            text-align: center;
            margin-top: 16px;
            color: var(--el-text-color-secondary);
            
            .login-link {
              color: var(--el-color-primary);
              margin-left: 8px;
              text-decoration: none;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .register-container {
    padding: 20px;
    
    .register-content {
      width: 100%;
      height: auto;
      flex-direction: column;
      
      .register-left {
        padding: 40px 20px;
        
        .welcome-text {
          text-align: center;
          
          h1 {
            font-size: 28px;
          }
          
          h2 {
            font-size: 24px;
          }
          
          p {
            font-size: 16px;
          }
        }
      }
      
      .register-right {
        padding: 40px 20px;
      }
    }
  }
}
</style> 