<template>
  <div class="about-page">
    <!-- 页面标题区域 -->
    <section class="page-header">
      <div class="container">
        <h1>关于我们</h1>
        <p>致力于为您提供最优质的算力资源服务</p>
      </div>
    </section>

    <!-- 公司介绍 -->
    <section class="company-intro">
      <div class="container">
        <div class="section-content">
          <h2>公司介绍</h2>
          <p>我们是一家专注于算力资源服务的科技公司，致力于为企业和个人用户提供高质量、可靠的计算资源解决方案。通过先进的资源调度系统和智能推荐算法，我们帮助用户找到最适合其需求的算力资源，实现效率提升和成本优化。</p>
          <div class="stats">
            <div class="stat-item">
              <div class="number">1000+</div>
              <div class="label">服务客户</div>
            </div>
            <div class="stat-item">
              <div class="number">99.9%</div>
              <div class="label">服务可用性</div>
            </div>
            <div class="stat-item">
              <div class="number">24/7</div>
              <div class="label">技术支持</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务特色 -->
    <section class="features">
      <div class="container">
        <h2>服务特色</h2>
        <div class="features-grid">
          <div class="feature-card">
            <el-icon class="icon"><Monitor /></el-icon>
            <h3>智能推荐</h3>
            <p>基于深度学习的智能算法，为您推荐最适合的算力资源配置</p>
          </div>
          <div class="feature-card">
            <el-icon class="icon"><Connection /></el-icon>
            <h3>弹性伸缩</h3>
            <p>根据业务需求灵活调整资源配置，按需付费</p>
          </div>
          <div class="feature-card">
            <el-icon class="icon"><DataLine /></el-icon>
            <h3>性能监控</h3>
            <p>实时监控资源使用情况，提供详细的性能分析报告</p>
          </div>
          <div class="feature-card">
            <el-icon class="icon"><Service /></el-icon>
            <h3>专业支持</h3>
            <p>专业的技术团队7*24小时在线支持</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队愿景 -->
    <section class="vision">
      <div class="container">
        <div class="section-content">
          <h2>团队愿景</h2>
          <p>我们的愿景是成为全球领先的算力资源服务提供商，通过技术创新和优质服务，帮助更多企业和个人用户实现数字化转型，推动科技进步与产业升级。</p>
          <div class="vision-points">
            <div class="point">
              <h3>创新</h3>
              <p>持续技术创新，引领行业发展</p>
            </div>
            <div class="point">
              <h3>品质</h3>
              <p>追求卓越品质，提供稳定可靠的服务</p>
            </div>
            <div class="point">
              <h3>共赢</h3>
              <p>与客户共同成长，实现价值共创</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact">
      <div class="container">
        <h2>联系我们</h2>
        <div class="contact-info">
          <div class="info-item">
            <el-icon><Location /></el-icon>
            <span>地址：北京市海淀区科技园区</span>
          </div>
          <div class="info-item">
            <el-icon><Phone /></el-icon>
            <span>电话：400-123-4567</span>
          </div>
          <div class="info-item">
            <el-icon><Message /></el-icon>
            <span>邮箱：contact@example.com</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Monitor, Connection, DataLine, Service, Location, Phone, Message } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
    opacity: 0.9;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 80px 0;

  h2 {
    font-size: 36px;
    text-align: center;
    margin-bottom: 40px;
    color: var(--text-color);
  }
}

.company-intro {
  background: #fff;

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;

    p {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-color-secondary);
      margin-bottom: 40px;
    }
  }

  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 60px;

    .stat-item {
      text-align: center;

      .number {
        font-size: 48px;
        font-weight: bold;
        color: var(--primary-color);
        margin-bottom: 10px;
      }

      .label {
        font-size: 18px;
        color: var(--text-color-secondary);
      }
    }
  }
}

.features {
  background-color: var(--background-color);

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }

  .feature-card {
    background: #fff;
    padding: 40px 30px;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .icon {
      font-size: 48px;
      color: var(--primary-color);
      margin-bottom: 20px;
    }

    h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: var(--text-color);
    }

    p {
      color: var(--text-color-secondary);
      line-height: 1.6;
    }
  }
}

.vision {
  background: #fff;

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;

    p {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-color-secondary);
      margin-bottom: 40px;
    }
  }

  .vision-points {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 40px;

    .point {
      text-align: center;
      padding: 30px;
      background: var(--background-color);
      border-radius: 8px;

      h3 {
        font-size: 24px;
        margin-bottom: 15px;
        color: var(--text-color);
      }

      p {
        color: var(--text-color-secondary);
        margin: 0;
      }
    }
  }
}

.contact {
  background-color: var(--background-color);

  .contact-info {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 18px;
      color: var(--text-color);

      &:last-child {
        margin-bottom: 0;
      }

      .el-icon {
        font-size: 24px;
        color: var(--primary-color);
        margin-right: 15px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .features .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 0;

    h1 {
      font-size: 36px;
    }

    p {
      font-size: 18px;
    }
  }

  section {
    padding: 60px 0;

    h2 {
      font-size: 30px;
    }
  }

  .features .features-grid {
    grid-template-columns: 1fr;
  }

  .vision .vision-points {
    grid-template-columns: 1fr;
  }

  .company-intro .stats {
    flex-direction: column;
    gap: 30px;
  }
}
</style> 