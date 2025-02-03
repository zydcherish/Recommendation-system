import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Products from '../views/products/index.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/products/index.vue'),
        meta: { title: '全部产品' }
      },
      {
        path: 'product/:id',
        name: 'product-detail',
        component: () => import('@/views/product/detail.vue'),
        meta: { title: '产品详情' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于我们' }
      },
      {
        path: 'order/confirm',
        name: 'order-confirm',
        component: () => import('@/views/order/confirm.vue'),
        meta: { title: '确认订单', requiresAuth: true }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/dashboard.vue'),
        meta: { title: '管理控制台' }
      },
      {
        path: 'resources',
        name: 'admin-resources',
        component: () => import('@/views/admin/resources/index.vue'),
        meta: { title: '资源管理' }
      },
      {
        path: 'recommendations',
        name: 'admin-recommendations',
        component: () => import('@/views/admin/recommendations/index.vue'),
        meta: { title: '推荐管理' }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/users.vue'),
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/login.vue'),
        meta: { title: '登录' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/register.vue'),
        meta: { title: '注册' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 算力资源推荐系统` : '算力资源推荐系统'
  
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && userType !== 'admin') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router 