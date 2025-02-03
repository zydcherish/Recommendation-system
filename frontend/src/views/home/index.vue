<template>
  <div class="home-page">
    <!-- 头部区域 -->
    <section class="hero-section">
      <div class="container">
        <h1>算力资源推荐</h1>
        <p>为您的业务提供最优质的计算资源</p>
      </div>
    </section>

    <!-- 热门资源区域 -->
    <section class="container">
      <HotResources />
    </section>
  </div>
</template>

<script setup>
import HotResources from '@/components/HotResources.vue'
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.hero-section {
  background: linear-gradient(135deg, #1c92d2 0%, #e8f6fe 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  p {
    font-size: 20px;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;

    h1 {
      font-size: 32px;
    }

    p {
      font-size: 18px;
    }
  }
}
</style>