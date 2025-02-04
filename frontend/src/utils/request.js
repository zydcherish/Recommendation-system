import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 从环境变量获取baseURL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log('发送请求:', config.url)
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('收到响应:', response.config.url, response.data)
    const res = response.data
    
    // 如果返回的状态码不是200,说明接口有问题,抛出错误
    if (res.code !== 200) {
      const errMsg = res.message || '系统错误'
      console.warn('接口返回错误:', errMsg, res)
      ElMessage.error(errMsg)
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      return Promise.reject(new Error(errMsg))
    }
    return res
  },
  error => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    })
    
    const errMsg = error.response?.data?.message || error.message || '请求失败'
    ElMessage.error(errMsg)
    return Promise.reject(error)
  }
)

export default service