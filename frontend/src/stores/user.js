import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getUserInfo, register as registerApi } from '@/api/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const userType = ref(localStorage.getItem('userType') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userType.value === 'admin')

  async function login(data) {
    try {
      const res = await loginApi(data)
      if (res.data) {
        token.value = res.data.token
        userType.value = res.data.user.type
        userInfo.value = res.data.user
        
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userType', res.data.user.type)
        
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      ElMessage.error(error.response?.data?.message || '登录失败')
      return false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await logoutApi()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = ''
      userType.value = ''
      userInfo.value = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
    }
  }

  async function fetchUserInfo() {
    if (token.value) {
      try {
        const res = await getUserInfo()
        if (res.data) {
          userInfo.value = res.data
        }
      } catch (error) {
        console.error('Fetch user info error:', error)
        if (error.response?.status === 401) {
          logout()
        }
      }
    }
  }

  async function register(data) {
    try {
      const res = await registerApi(data)
      
      if (res.data) {
        // 注册成功，但不保存登录状态
        // 用户需要重新登录
        return res.data
      }
      throw new Error('注册失败，请稍后重试')
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  return {
    token,
    userInfo,
    userType,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    fetchUserInfo,
    register
  }
}) 