<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="welcome-text">
          <h1>欢迎使用</h1>
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
      
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <h2>账号登录</h2>
            <p>欢迎回来，请输入您的账号信息</p>
          </div>
          
          <el-form 
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
          >
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                :prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>

            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button"
                :loading="loading"
                @click="handleLogin"
                size="large"
              >
                登录
              </el-button>
            </el-form-item>

            <div class="form-footer">
              <span>还没有账号？</span>
              <router-link to="/auth/register" class="register-link">立即注册</router-link>
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
const loginFormRef = ref(null)
const rememberMe = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    const success = await userStore.login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    if (success) {
      ElMessage.success('登录成功')
      if (userStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-5) 100%);
  padding: 40px;
  
  .login-content {
    width: 1000px;
    height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
    
    .login-left {
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
    
    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      
      .login-box {
        width: 100%;
        max-width: 360px;
        
        .login-header {
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
        
        .login-form {
          .el-input {
            --el-input-height: 48px;
            
            :deep(.el-input__wrapper) {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
          }
          
          .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          
          .login-button {
            width: 100%;
            height: 48px;
            font-size: 16px;
            border-radius: 8px;
          }
          
          .form-footer {
            text-align: center;
            margin-top: 24px;
            color: var(--el-text-color-secondary);
            
            .register-link {
              color: var(--el-color-primary);
              margin-left: 8px;
              text-decoration: none;
              font-weight: 500;
              
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
@media screen and (max-width: 1024px) {
  .login-container {
    padding: 20px;
    
    .login-content {
      width: 100%;
      height: auto;
      flex-direction: column;
      
      .login-left {
        padding: 40px;
        
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
        
        .decoration-icons {
          margin: 30px 0;
          
          .icon-row {
            gap: 30px;
          }
        }
      }
      
      .login-right {
        padding: 40px 20px;
      }
    }
  }
}
</style> 