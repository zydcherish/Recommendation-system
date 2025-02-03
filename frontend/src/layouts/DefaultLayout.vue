<template>
  <div class="layout-default" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <header class="header">
      <div class="container">
        <nav class="nav flex justify-between items-center">
          <router-link to="/" class="logo">
            <h1>算力资源推荐</h1>
          </router-link>
          <div class="nav-links">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/products" class="nav-link">全部产品</router-link>
            <router-link to="/about" class="nav-link">关于我们</router-link>
            <template v-if="!userStore.isLoggedIn">
              <router-link to="/auth/login" class="nav-link">登录</router-link>
              <router-link to="/auth/register" class="nav-link">注册</router-link>
            </template>
            <template v-else>
              <el-dropdown @command="handleCommand">
                <span class="user-menu">
                  {{ userStore.userInfo.username }}
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="userStore.isAdmin" command="admin">管理控制台</el-dropdown-item>
                    <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                    <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content flex justify-between">
          <div class="footer-section">
            <h3>关于我们</h3>
            <p>我们致力于为用户提供最优质的算力资源推荐服务，让每个用户都能找到最适合的计算资源。</p>
          </div>
          <div class="footer-section">
            <h3>快速链接</h3>
            <router-link to="/">首页</router-link>
            <router-link to="/products">产品</router-link>
            <router-link to="/about">关于</router-link>
          </div>
          <div class="footer-section">
            <h3>联系我们</h3>
            <p>邮箱：contact@example.com</p>
            <p>电话：400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 算力资源推荐系统. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const transitionName = ref('')

// 页面路由顺序
const routeOrder = ['/', '/products', '/about']

// 触摸相关变量
let touchStartX = 0
let touchEndX = 0
const minSwipeDistance = 100 // 最小滑动距离

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].clientX
  const swipeDistance = touchEndX - touchStartX

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    const currentIndex = routeOrder.indexOf(route.path)
    
    if (swipeDistance > 0 && currentIndex > 0) {
      // 向右滑动，去前一个页面
      transitionName.value = 'slide-right'
      router.push(routeOrder[currentIndex - 1])
    } else if (swipeDistance < 0 && currentIndex < routeOrder.length - 1) {
      // 向左滑动，去后一个页面
      transitionName.value = 'slide-left'
      router.push(routeOrder[currentIndex + 1])
    }
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'admin':
      router.push('/admin')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
  }

  .nav {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      h1 {
        font-size: 24px;
        color: var(--primary-color);
        margin: 0;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;

      .nav-link, .user-menu {
        color: var(--text-color);
        font-size: 16px;
        transition: all 0.3s;
        padding: 8px 12px;
        border-radius: 4px;
        text-decoration: none;
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;

        &:hover, &.router-link-active {
          color: var(--primary-color);
          background-color: var(--el-color-primary-light-9);
        }
      }

      .user-menu {
        cursor: pointer;
        gap: 4px;
        outline: none;
      }

      :deep(.el-dropdown) {
        outline: none;
        height: 40px;
        display: flex;
        align-items: center;
        
        &:focus-visible {
          outline: none;
          box-shadow: none;
        }
      }

      :deep(.el-dropdown-menu) {
        padding: 8px 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .el-dropdown-menu__item {
          padding: 8px 20px;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-color);

          &:hover {
            background-color: var(--el-color-primary-light-9);
            color: var(--primary-color);
          }

          &:active {
            background-color: var(--el-color-primary-light-8);
          }
        }
      }
    }
  }
}

.main {
  flex: 1;
  margin-top: 64px;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
}

.footer {
  background: #2c3e50;
  color: #fff;
  padding: 60px 0 20px;

  .footer-content {
    margin-bottom: 40px;
  }

  .footer-section {
    flex: 1;
    margin-right: 40px;

    h3 {
      font-size: 18px;
      margin-bottom: 20px;
    }

    a {
      display: block;
      color: #fff;
      margin-bottom: 10px;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 20px;
    text-align: center;
    
    p {
      opacity: 0.8;
    }
  }
}

// 添加过渡动画样式
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style> 