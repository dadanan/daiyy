<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface NewsItem {
  id: string
  title: string
  image: string
  description: string
  content: string
  publishTime: string
  source: string
  url: string
  rank: number // 排名
}

const newsList = ref<NewsItem[]>([])
const selectedNews = ref<NewsItem | null>(null)
const loading = ref(false)
const error = ref('')

// 天聚数行API配置
// 请在天聚数行官网注册并获取API密钥：https://www.tianapi.com/
// 优先使用环境变量配置，如果环境变量不存在则使用默认值
const TIANAPI_KEY = import.meta.env.VITE_TIANAPI_KEY || 'ff3a7966e4b434437de3a7e3e1098cc9'
const TIANAPI_URL = 'https://apis.tianapi.com/woman/index' // 女性新闻接口

// 获取新闻数据
const fetchNews = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 优先使用天聚数行API获取女性相关新闻
    if (TIANAPI_KEY && TIANAPI_KEY !== 'YOUR_API_KEY_HERE') {
      try {
        // 构建请求URL，女性新闻接口只需要key和num参数
        const params = new URLSearchParams({
          key: TIANAPI_KEY,
          num: '10' // 获取10条新闻
        })
        
        const response = await fetch(`${TIANAPI_URL}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // 天聚数行API返回格式：{ code: 200, msg: 'success', result: { newslist: [...] } }
          console.log('API返回数据:', data)
          
          // 检查数据格式，支持两种可能的返回格式
          let newslist: any[] = []
          if (data.code === 200) {
            if (data.result && data.result.newslist && Array.isArray(data.result.newslist)) {
              // 新格式：数据在 result.newslist 中
              newslist = data.result.newslist
            } else if (data.newslist && Array.isArray(data.newslist)) {
              // 旧格式：数据直接在 newslist 中
              newslist = data.newslist
            }
          }
          
          if (newslist.length > 0) {
            // 女性新闻接口直接返回女性相关新闻，无需过滤
            newsList.value = newslist.slice(0, 10).map((item: any, index: number) => {
              const rank = index + 1 // 排名从1开始
              // 处理描述和内容 - API返回的description可能为空，使用标题作为描述
              let description = item.description || item.summary || item.intro || ''
              let content = item.content || item.description || item.summary || ''
              
              // 如果描述和内容都为空，使用标题作为描述
              if (!description && !content && item.title) {
                description = `点击查看《${item.title}》的详细内容`
                content = `《${item.title}》\n\n点击下方链接查看完整内容：${item.url || ''}`
              } else if (!description && item.title) {
                description = `点击查看《${item.title}》的详细内容`
              }
              
              // 处理发布时间 - API返回的ctime已经是日期字符串格式，如 "2025-11-05 11:00"
              let publishTime = item.ctime || item.time || item.publishTime || ''
              if (publishTime && typeof publishTime === 'string') {
                // 如果已经是日期字符串，直接使用
                if (publishTime.includes('-') || publishTime.includes('/')) {
                  // 已经是日期格式，直接使用
                  publishTime = publishTime
                } else {
                  // 可能是时间戳，尝试转换
                  const timestamp = parseInt(publishTime)
                  if (!isNaN(timestamp)) {
                    publishTime = new Date(timestamp * 1000).toLocaleDateString('zh-CN')
                  }
                }
              } else if (!publishTime) {
                publishTime = new Date().toLocaleDateString('zh-CN')
              }
              
              return {
                id: item.id || item.newsid || `news-${index}`,
                title: item.title || '无标题',
                image: '', // 不显示图片
                description: description || content || '暂无描述',
                content: content || description || '暂无内容',
                publishTime: publishTime,
                source: item.source || item.newsSource || '天聚数行',
                url: item.url || item.link || item.newsurl || '#',
                rank: rank // 添加排名
              }
            })
            
            console.log('成功获取新闻数据:', newsList.value.length, '条')
            console.log('处理后的新闻数据:', newsList.value)
            loading.value = false
            return
          } else {
            console.warn('天聚数行API返回数据格式异常或数据为空:', data)
            error.value = data.msg || '获取新闻失败，数据为空'
          }
        } else {
          throw new Error(`HTTP错误: ${response.status}`)
        }
      } catch (apiError) {
        console.error('天聚数行API请求失败:', apiError)
        error.value = 'API请求失败，使用模拟数据'
      }
    } else {
      console.warn('未配置天聚数行API密钥，使用模拟数据')
      error.value = '请配置API密钥'
    }
    
    // 如果API不可用或未配置，使用模拟数据（包含真实的女性相关新闻内容）
    if (newsList.value.length === 0) {
      newsList.value = getMockNews()
    }
  } catch (err) {
    console.error('获取新闻失败:', err)
    // 如果所有方式都失败，使用模拟数据
    if (newsList.value.length === 0) {
      newsList.value = getMockNews()
    }
  } finally {
    loading.value = false
  }
}

// 模拟数据（当API不可用时使用）
const getMockNews = (): NewsItem[] => {
  return [
    {
      id: '1',
      title: '女性职场新趋势：如何平衡工作与生活',
      image: '',
      description: '随着社会的发展，越来越多的女性在职场中崭露头角。如何在繁忙的工作中找到生活与工作的平衡点，成为现代女性关注的焦点。',
      content: '随着社会的发展，越来越多的女性在职场中崭露头角。如何在繁忙的工作中找到生活与工作的平衡点，成为现代女性关注的焦点。专家建议，女性应该学会合理规划时间，培养兴趣爱好，保持身心健康。同时，家庭和社会的支持也至关重要。',
      publishTime: '2024-01-15',
      source: '新浪女性',
      url: '#',
      rank: 1
    },
    {
      id: '2',
      title: '春季护肤指南：打造水润透亮肌肤',
      image: '',
      description: '春季是肌肤护理的关键时期，正确的护肤方法能够帮助女性保持年轻健康的肌肤状态。',
      content: '春季是肌肤护理的关键时期，正确的护肤方法能够帮助女性保持年轻健康的肌肤状态。专家建议，春季护肤应该注重补水保湿，选择适合自己肤质的护肤品，定期进行深层清洁和护理。',
      publishTime: '2024-01-14',
      source: '新浪女性',
      url: '#',
      rank: 2
    },
    {
      id: '3',
      title: '女性健康：关注身体信号，预防疾病',
      image: '',
      description: '女性健康一直是社会关注的重点，定期体检和健康生活方式是保持身体健康的重要保障。',
      content: '女性健康一直是社会关注的重点，定期体检和健康生活方式是保持身体健康的重要保障。医生建议，女性应该每年进行一次全面体检，关注身体的各种信号，及时发现和治疗潜在的健康问题。',
      publishTime: '2024-01-13',
      source: '新浪女性',
      url: '#',
      rank: 3
    },
    {
      id: '4',
      title: '时尚穿搭：2024春季流行趋势解析',
      image: '',
      description: '2024年春季时尚趋势已经发布，让我们一起看看这个季节最流行的穿搭风格和元素。',
      content: '2024年春季时尚趋势已经发布，让我们一起看看这个季节最流行的穿搭风格和元素。设计师们预测，今年春季将流行柔和的色彩、轻盈的材质和简约的设计风格。',
      publishTime: '2024-01-12',
      source: '新浪女性',
      url: '#',
      rank: 4
    },
    {
      id: '5',
      title: '女性创业：如何在竞争激烈的市场中立足',
      image: '',
      description: '越来越多的女性选择创业，但如何在竞争激烈的市场中找到自己的定位并取得成功？',
      content: '越来越多的女性选择创业，但如何在竞争激烈的市场中找到自己的定位并取得成功？成功女性创业者分享经验：要有清晰的商业计划，了解目标市场，建立强大的团队，并保持持续学习的态度。',
      publishTime: '2024-01-11',
      source: '新浪女性',
      url: '#',
      rank: 5
    },
    {
      id: '6',
      title: '亲子关系：如何与孩子建立良好的沟通',
      image: '',
      description: '良好的亲子关系对孩子的成长至关重要，作为母亲，如何与孩子建立有效的沟通渠道？',
      content: '良好的亲子关系对孩子的成长至关重要，作为母亲，如何与孩子建立有效的沟通渠道？专家建议：要倾听孩子的声音，尊重他们的想法，用爱和理解来引导他们成长。',
      publishTime: '2024-01-10',
      source: '新浪女性',
      url: '#',
      rank: 6
    },
    {
      id: '7',
      title: '女性理财：智慧投资，实现财务自由',
      image: '',
      description: '理财不再是男性的专利，越来越多的女性开始关注个人财务管理，学习投资理财知识。',
      content: '理财不再是男性的专利，越来越多的女性开始关注个人财务管理，学习投资理财知识。理财专家建议，女性应该根据自己的风险承受能力，制定合理的投资计划，实现财务自由。',
      publishTime: '2024-01-09',
      source: '新浪女性',
      url: '#',
      rank: 7
    },
    {
      id: '8',
      title: '女性运动：找到适合自己的运动方式',
      image: '',
      description: '运动是保持健康的重要方式，但不同年龄段的女性应该选择适合自己的运动项目。',
      content: '运动是保持健康的重要方式，但不同年龄段的女性应该选择适合自己的运动项目。健身教练建议，年轻女性可以尝试高强度运动，而中年女性更适合瑜伽、游泳等温和的运动方式。',
      publishTime: '2024-01-08',
      source: '新浪女性',
      url: '#',
      rank: 8
    },
    {
      id: '9',
      title: '女性社交：建立有意义的人际关系',
      image: '',
      description: '良好的人际关系对女性的生活和工作都有重要影响，如何建立和维护有意义的人际关系？',
      content: '良好的人际关系对女性的生活和工作都有重要影响，如何建立和维护有意义的人际关系？心理学家建议，要真诚待人，学会倾听，保持开放的心态，并主动维护重要的人际关系。',
      publishTime: '2024-01-07',
      source: '新浪女性',
      url: '#',
      rank: 9
    },
    {
      id: '10',
      title: '女性成长：终身学习，不断进步',
      image: '',
      description: '在这个快速变化的时代，终身学习成为女性保持竞争力的重要方式。',
      content: '在这个快速变化的时代，终身学习成为女性保持竞争力的重要方式。教育专家建议，女性应该保持好奇心，不断学习新知识、新技能，适应社会的发展变化，实现个人成长和职业发展。',
      publishTime: '2024-01-06',
      source: '新浪女性',
      url: '#',
      rank: 10
    }
  ]
}

// 获取描述的前两行（限制字符数）
const getDescriptionLines = (description: string, maxLength: number = 150): string => {
  if (!description) return '暂无描述'
  
  // 移除HTML标签（如果有）
  const text = description.replace(/<[^>]*>/g, '').trim()
  
  // 如果文本长度超过限制，截取并添加省略号
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  
  return text
}

// 格式化内容，处理换行和HTML
const formatContent = (content: string): string => {
  if (!content) return '<p>暂无内容</p>'
  
  // 如果内容包含HTML标签，直接返回
  if (content.includes('<') && content.includes('>')) {
    return content
  }
  
  // 否则将换行符转换为段落
  const paragraphs = content.split('\n').filter(p => p.trim())
  if (paragraphs.length === 0) {
    return '<p>暂无内容</p>'
  }
  
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('')
}

// 查看详情
const viewDetail = (news: NewsItem) => {
  selectedNews.value = news
}

// 返回列表
const backToList = () => {
  selectedNews.value = null
}


// 组件挂载时获取新闻
onMounted(() => {
  fetchNews()
})
</script>

<template>
  <div class="sina-women-news">
    <!-- 新闻列表 -->
    <div v-if="!selectedNews" class="news-container">
      <div class="page-header">
        <h1 class="page-title">新浪女性新闻</h1>
        <button class="refresh-button" @click="fetchNews" :disabled="loading">
          {{ loading ? '加载中...' : '刷新' }}
        </button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error && newsList.length === 0" class="error">{{ error }}</div>
      <div v-else-if="newsList.length === 0" class="empty-state">
        <p>暂无新闻数据</p>
      </div>
      <div v-else class="news-list">
        <div 
          v-for="news in newsList" 
          :key="news.id" 
          class="news-item"
          :class="{ 'top-three': news.rank <= 3 }"
          @click="viewDetail(news)"
        >
          <div class="news-rank" :class="{ 'top-rank': news.rank <= 3 }">{{ news.rank }}</div>
          <div class="news-content">
            <h2 class="news-title">{{ news.title }}</h2>
            <div class="news-meta">
              <span class="news-source">{{ news.source }}</span>
              <span class="news-time">{{ news.publishTime }}</span>
            </div>
            <div class="news-description">
              <p>{{ getDescriptionLines(news.description) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻详情 -->
    <div v-else class="news-detail">
      <button class="back-button" @click="backToList">← 返回列表</button>
      <article class="detail-article">
        <h1 class="detail-title">{{ selectedNews.title }}</h1>
        <div class="detail-meta">
          <span class="detail-source">{{ selectedNews.source }}</span>
          <span class="detail-time">{{ selectedNews.publishTime }}</span>
        </div>
        <div class="detail-content" v-html="formatContent(selectedNews.content)"></div>
        <div v-if="selectedNews.url && selectedNews.url !== '#'" class="detail-link">
          <a :href="selectedNews.url" target="_blank" rel="noopener noreferrer" class="original-link">
            查看原文 →
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.sina-women-news {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #333;
  margin: 0;
  font-size: 2rem;
}

.refresh-button {
  padding: 0.5rem 1.5rem;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.refresh-button:hover:not(:disabled) {
  background: #c2185b;
}

.refresh-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.news-container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #f56565;
}

.empty-state {
  color: #999;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.news-item {
  display: flex;
  flex-direction: column;
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.news-rank {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #e91e63, #c2185b);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
}

/* 前三名特殊样式 */
.news-rank.top-rank {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.4);
}

.news-content {
  flex: 1;
  padding: 1.5rem;
  padding-top: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  cursor: pointer;
}

.news-title:hover {
  color: #e91e63;
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.news-source {
  color: #e91e63;
  font-weight: 500;
}

.news-description {
  color: #555;
  line-height: 1.6;
  flex: 1;
  margin-top: 0.5rem;
}

.news-description p {
  margin: 0;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-detail {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: #e91e63;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: background 0.3s;
}

.back-button:hover {
  background: #c2185b;
}

.detail-article {
  color: #333;
}

.detail-title {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  line-height: 1.3;
  color: #333;
}

.detail-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  color: #666;
}

.detail-source {
  color: #e91e63;
  font-weight: 500;
}


.detail-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #444;
}

.detail-content p {
  margin: 0 0 1.5rem 0;
}

.detail-link {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.original-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #e91e63;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background 0.3s;
}

.original-link:hover {
  background: #c2185b;
}

@media (max-width: 1024px) {
  .news-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sina-women-news {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .refresh-button {
    width: 100%;
  }

  .news-list {
    grid-template-columns: 1fr;
  }

  .news-item {
    flex-direction: column;
  }

  .news-content {
    padding: 1rem;
    padding-top: 3rem;
  }

  .news-title {
    font-size: 1.1rem;
  }

  .news-rank {
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
    top: 0.5rem;
    left: 0.5rem;
  }

  .news-detail {
    padding: 1rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-content {
    font-size: 1rem;
  }
}
</style>

