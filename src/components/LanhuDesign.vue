<script setup lang="ts">
import { ref } from 'vue'

// 这里可以根据实际设计稿添加数据
const menuItems = ref([
  { name: '首页', link: '#' },
  { name: '产品', link: '#' },
  { name: '服务', link: '#' },
  { name: '关于', link: '#' },
  { name: '联系', link: '#' }
])

// 示例数据 - 根据实际设计稿修改
const features = ref([
  {
    id: 1,
    title: '特性标题 1',
    description: '这里是特性描述文字',
    icon: '✨'
  },
  {
    id: 2,
    title: '特性标题 2',
    description: '这里是特性描述文字',
    icon: '🚀'
  },
  {
    id: 3,
    title: '特性标题 3',
    description: '这里是特性描述文字',
    icon: '💡'
  }
])
</script>

<template>
  <div class="lanhu-design-page">
    <!-- Header -->
    <header class="main-header">
      <div class="header-container">
        <div class="logo">
          <div class="logo-icon">L</div>
          <span class="logo-text">Logo</span>
        </div>
        <nav class="main-nav">
          <a 
            v-for="item in menuItems" 
            :key="item.name" 
            :href="item.link" 
            class="nav-item"
          >
            {{ item.name }}
          </a>
        </nav>
        <button class="cta-button">开始使用</button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">欢迎来到我们的平台</h1>
          <p class="hero-subtitle">这里是副标题描述文字，可以根据设计稿修改</p>
          <div class="hero-actions">
            <button class="primary-button">立即开始</button>
            <button class="secondary-button">了解更多</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="placeholder-image">图片占位符</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.id" 
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="section-container">
        <div class="content-grid">
          <div class="content-item">
            <h3>内容标题 1</h3>
            <p>这里是内容描述文字，可以根据实际设计稿进行修改和调整。</p>
          </div>
          <div class="content-item">
            <h3>内容标题 2</h3>
            <p>这里是内容描述文字，可以根据实际设计稿进行修改和调整。</p>
          </div>
          <div class="content-item">
            <h3>内容标题 3</h3>
            <p>这里是内容描述文字，可以根据实际设计稿进行修改和调整。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-column">
          <h4>关于我们</h4>
          <ul>
            <li><a href="#">公司简介</a></li>
            <li><a href="#">团队介绍</a></li>
            <li><a href="#">联系方式</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>产品服务</h4>
          <ul>
            <li><a href="#">产品介绍</a></li>
            <li><a href="#">服务内容</a></li>
            <li><a href="#">价格方案</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>帮助支持</h4>
          <ul>
            <li><a href="#">使用文档</a></li>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">技术支持</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>关注我们</h4>
          <div class="social-links">
            <a href="#" class="social-link">微信</a>
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">邮箱</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 公司名称. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.lanhu-design-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* Header Styles */
.main-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.main-nav {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-item {
  color: #333333;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
  position: relative;
}

.nav-item:hover {
  color: #667eea;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #667eea;
  transition: width 0.3s;
}

.nav-item:hover::after {
  width: 100%;
}

.cta-button {
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Hero Section */
.hero-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin: 0;
}

.hero-subtitle {
  font-size: 20px;
  color: #666666;
  line-height: 1.6;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.primary-button {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  padding: 14px 32px;
  background: #ffffff;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #667eea;
  color: #ffffff;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Features Section */
.features-section {
  padding: 100px 24px;
  background-color: #ffffff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.feature-card {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.feature-description {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}

/* Content Section */
.content-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.content-item {
  padding: 40px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.content-item h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.content-item p {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}

/* Footer */
.main-footer {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 60px 24px 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #ffffff;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #667eea;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-link {
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.social-link:hover {
  color: #667eea;
}

.footer-bottom {
  border-top: 1px solid #333333;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: #999999;
  font-size: 14px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .features-grid,
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .features-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .footer-container {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
