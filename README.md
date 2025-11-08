# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## 新浪女性新闻功能

本项目包含一个获取和展示新浪女性新闻的功能模块。

### API配置说明

本项目使用天聚数行API（接口189 - 社会新闻接口）来获取女性相关新闻。

#### 配置步骤：

1. **注册天聚数行账号**
   - 访问 [天聚数行官网](https://www.tianapi.com/)
   - 注册并登录账号

2. **获取API密钥**
   - 登录后在用户中心获取您的API密钥（APIKey）

3. **配置API密钥**
   
   方式一：通过环境变量配置（推荐）
   - 在项目根目录创建 `.env` 文件
   - 添加以下内容：
     ```
     VITE_TIANAPI_KEY=您的API密钥
     ```
   
   方式二：直接在代码中配置
   - 编辑 `src/components/SinaWomenNews.vue`
   - 找到 `TIANAPI_KEY` 变量，替换为您的API密钥

#### API接口参数说明

- **接口地址**: `https://apis.tianapi.com/woman/index`
- **请求方式**: GET
- **请求参数**:
  - `key`: 您的API密钥（必填）
  - `num`: 返回新闻数量，默认10条（可选）

#### 功能特性

- ✅ 自动获取前10条女性相关新闻
- ✅ 展示新闻图片、标题和前两行详情
- ✅ 点击标题查看完整详情
- ✅ 如果API不可用，自动使用模拟数据
- ✅ 响应式设计，支持移动端和桌面端

#### 注意事项

- 天聚数行免费会员每天有100次API调用额度
- 如果未配置API密钥，系统会自动使用模拟数据
- API返回的数据会自动过滤，只显示包含"女性"或"女人"关键词的新闻
# daiyy
