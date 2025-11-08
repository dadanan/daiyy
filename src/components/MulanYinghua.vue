<script setup lang="ts">
// 模拟数据 - 最新研究
const latestResearch = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200?text=Calculator',
    title: '2024财年奢侈品销售持续强劲复苏,全产品领域销售额实现双位数增长',
    date: '2004年01月06日'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200?text=Laptop+Charts',
    title: '劳斯莱斯中国副首席执行官drios拜访中国南山',
    date: '2004年01月05日'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200?text=Document+Charts',
    title: '2023年内地新股发行将维持现行的速度;香港市场将于美国加息见顶及资金重新部署时反弹',
    date: '2004年01月04日'
  }
]

// 模拟数据 - 行业解决方案
const industrySolutions = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200?text=Business+Man',
    title: '日前,2023年度德勤朝阳高科技高成长20强(简称"朝阳20强")暨明日之星颁奖活动在京举办',
    date: '2004年01月03日'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200?text=Meeting',
    title: '德動中国首席执行官曾顺福出席《财富》全球论坛,展望中国经济前景,畅谈中国市场新机遇',
    date: '2004年01月02日'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200?text=Presentation',
    title: '团结引领————2023年德勤亚太地区高管峰会在香港成功举办',
    date: '2004年01月01日'
  }
]

// 模拟数据 - 动态
const trends = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200?text=Money+Document',
    title: '技术先进型服务企业税收优惠政策要点与重要风险提示浦东现代服务业促进会专场圆满结束',
    date: '2003年12月30日'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200?text=Speaker',
    title: '德動中国首席执行官曾顺福出席《财富》全球论坛,展望中国经济前景,畅谈中国市场新机遇',
    date: '2003年12月29日'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200?text=Group+Meeting',
    title: '获"2023乡村人才振兴优秀案例"殊荣',
    date: '2003年12月28日'
  }
]
</script>

<template>
  <div class="mulan-yinghua">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="top-bar-content">
        <div class="red-bar"></div>
        <span class="contact-info">联系方式: 021-32147612</span>
      </div>
    </div>

    <!-- Header -->
    <header class="main-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <div class="logo-shape">E</div>
          </div>
          <div class="logo-text">
            <div class="company-name">木兰英华</div>
            <div class="company-name-en">MULANYINGHUA</div>
          </div>
        </div>
        <nav class="main-nav">
          <a href="#" class="nav-link">首页</a>
          <a href="#" class="nav-link">研究</a>
          <a href="#" class="nav-link">服务</a>
          <a href="#" class="nav-link">行业</a>
          <a href="#" class="nav-link">动态</a>
          <a href="#" class="nav-link">关于我们</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-subtitle">十年税务咨询落地经验、广泛的税务沟通网络</div>
        <h1 class="hero-title">
          木兰英华 <span class="highlight">企业家的税务智囊</span>
        </h1>
        <p class="hero-description">
          为企业提供涉税合规管理、税务危机应对和涉税规划咨询等服务
        </p>
        <div class="hero-cta">
          <div class="cta-icon">+</div>
        </div>
      </div>
    </section>

    <!-- Latest Research Section -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">LATEST RESEARCH</h2>
        <div class="section-subtitle">最新研究</div>
        <div class="section-separator"></div>
      </div>
      <div class="content-grid">
        <div v-for="item in latestResearch" :key="item.id" class="content-card">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <div class="card-date">Date: {{ item.date }}</div>
            <p class="card-description">
              {{ item.title.substring(0, 80) }}...
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Industry Solutions Section -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">INDUSTRY SOLUTIONS</h2>
        <div class="section-subtitle">行业解决方案</div>
        <div class="section-separator"></div>
      </div>
      <div class="content-grid">
        <div v-for="item in industrySolutions" :key="item.id" class="content-card">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <div class="card-date">Date: {{ item.date }}</div>
            <p class="card-description">
              {{ item.title.substring(0, 80) }}...
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Trends Section -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">TRENDS</h2>
        <div class="section-subtitle">木兰英华动态</div>
        <div class="section-separator"></div>
      </div>
      <div class="content-grid">
        <div v-for="item in trends" :key="item.id" class="content-card">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <div class="card-date">Date: {{ item.date }}</div>
            <p class="card-description">
              {{ item.title.substring(0, 80) }}...
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-column">
          <h4 class="footer-title">网站地图</h4>
          <ul class="footer-links">
            <li><a href="#">首页</a></li>
            <li><a href="#">研究</a></li>
            <li><a href="#">服务</a></li>
            <li><a href="#">行业</a></li>
            <li><a href="#">动态</a></li>
            <li><a href="#">关于我们</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">官方媒体</h4>
          <div class="qr-codes">
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">官方公众号</div>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">官方视频号</div>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">小红书</div>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">抖音</div>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">官方客服微信1</div>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">QR</div>
              <div class="qr-label">官方客服微信2</div>
            </div>
          </div>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">服务</h4>
          <ul class="footer-links">
            <li><a href="#">利务合规</a></li>
            <li><a href="#">税务风险应对</a></li>
            <li><a href="#">税务规划</a></li>
            <li><a href="#">专业税务顾问</a></li>
            <li><a href="#">利务签证</a></li>
            <li><a href="#">税务代理</a></li>
            <li><a href="#">职务尽职调查</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">行业</h4>
          <ul class="footer-links">
            <li><a href="#">地产建筑</a></li>
            <li><a href="#">先进制造</a></li>
            <li><a href="#">生命科学</a></li>
            <li><a href="#">新消费</a></li>
            <li><a href="#">松舞基金</a></li>
            <li><a href="#">资产管理</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#">公司简介</a></li>
            <li><a href="#">经营理念</a></li>
            <li><a href="#">核心價始</a></li>
            <li><a href="#">核心团队</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <span>木兰英华机务、事务所(上海)有限公司 | 免责条款 | 隐私政策|</span>
          <span>2018-2020 Mulanyh.com 沪ICP备13004179号-1</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.mulan-yinghua {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* Top Bar */
.top-bar {
  background-color: #1a1a1a;
  padding: 8px 0;
}

.top-bar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}

.red-bar {
  width: 4px;
  height: 20px;
  background-color: #dc2626;
}

.contact-info {
  color: #ffffff;
  font-size: 12px;
}

/* Header */
.main-header {
  background-color: #2d2d2d;
  padding: 15px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background-color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-shape {
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.company-name {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
}

.company-name-en {
  color: #999999;
  font-size: 12px;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #dc2626;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 600px;
  background-image: url('https://via.placeholder.com/1920x600?text=Business+Background');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #ffffff;
  max-width: 900px;
  padding: 0 20px;
}

.hero-subtitle {
  font-size: 18px;
  margin-bottom: 20px;
  color: #ffffff;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 30px;
  line-height: 1.3;
}

.highlight {
  color: #dc2626;
}

.hero-description {
  font-size: 18px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-cta {
  display: flex;
  justify-content: center;
}

.cta-icon {
  width: 50px;
  height: 50px;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s;
}

.cta-icon:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Content Sections */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
}

.section-header {
  margin-bottom: 50px;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.section-subtitle {
  font-size: 18px;
  color: #666666;
  margin-bottom: 15px;
}

.section-separator {
  width: 60px;
  height: 2px;
  background-color: #dc2626;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.content-card {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  transition: box-shadow 0.3s;
}

.content-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 10px;
  line-height: 1.5;
}

.card-date {
  font-size: 12px;
  color: #999999;
  margin-bottom: 15px;
}

.card-description {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
}

/* Footer */
.main-footer {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 60px 0 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  padding: 0 20px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #dc2626;
}

.qr-codes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  border: 1px solid #444444;
}

.qr-label {
  font-size: 12px;
  color: #cccccc;
  text-align: center;
}

.footer-bottom {
  border-top: 1px solid #333333;
  padding-top: 20px;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999999;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-nav {
    gap: 15px;
    flex-wrap: wrap;
  }

  .nav-link {
    font-size: 14px;
  }

  .hero-title {
    font-size: 32px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
