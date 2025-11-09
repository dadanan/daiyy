<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 高德地图API Key
// 获取方式：https://console.amap.com/dev/key/app
// 也可以通过环境变量 VITE_AMAP_KEY 配置
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || 'fa157015fdcf4eccbdbd2efeeca7782b'

// 高德地图安全密钥（securityJsCode）
// 获取方式：https://console.amap.com/dev/key/app
// 也可以通过环境变量 VITE_AMAP_SECURITY_KEY 配置
const AMAP_SECURITY_KEY = import.meta.env.VITE_AMAP_SECURITY_KEY || '8686a2a765a1f930d70c71601a71fb0c'

// 标记信息接口
interface MarkerInfo {
  id: number
  address: string
  lng: number
  lat: number
  marker: any
  color: string
}

const mapContainer = ref<HTMLDivElement | null>(null)
const addressInput = ref('')
const map = ref<any>(null)
const markers = ref<MarkerInfo[]>([])
const geocoder = ref<any>(null)
const selectedMarkerId = ref<number | null>(null)
let markerIdCounter = 0 // 自增计数器，确保ID唯一

// 标记颜色列表
const markerColors = [
  '#42b883', '#f56565', '#4299e1', '#ed8936', '#9f7aea',
  '#38b2ac', '#e53e3e', '#3182ce', '#d69e2e', '#805ad5'
]

// 声明全局AMap类型
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig?: {
      securityJsCode?: string
      serviceHost?: string
    }
  }
}

// 初始化地图
const initMap = () => {
  if (!window.AMap) {
    console.error('高德地图API未加载，请检查script标签')
    return
  }

  if (!mapContainer.value) return

  // 创建地图实例
  map.value = new window.AMap.Map(mapContainer.value, {
    zoom: 10, // 初始缩放级别
    center: [116.397428, 39.90923], // 初始中心点（北京天安门）
    viewMode: '3D', // 3D视图
  })

  // 加载地理编码插件
  window.AMap.plugin('AMap.Geocoder', () => {
    // 创建地理编码实例
    geocoder.value = new window.AMap.Geocoder({
      city: '全国', // 城市设为全国，可搜索全国地址
    })
  })
}

// 添加标记
const addMarker = (lng: number, lat: number, address: string) => {
  if (!map.value) return

  markerIdCounter++ // 自增计数器，确保ID唯一
  const markerId = markerIdCounter
  const color = markerColors[(markerId - 1) % markerColors.length]

  // 创建漏斗形状（地图标记）图标 SVG - 更大的尺寸
  const iconSize = 64
  const iconViewBox = 64
  const centerX = iconViewBox / 2
  const topY = 6
  const bottomY = iconViewBox - 2
  const topWidth = 40  // 顶部宽度
  const bottomWidth = 8  // 底部宽度
  
  // 漏斗形状：上宽下窄的倒三角形（标准漏斗样式）
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconViewBox} ${iconViewBox}">
    <!-- 漏斗主体（倒梯形/倒三角形） -->
    <path d="M ${centerX - topWidth/2} ${topY}
             L ${centerX + topWidth/2} ${topY}
             L ${centerX + bottomWidth/2} ${bottomY}
             L ${centerX - bottomWidth/2} ${bottomY} Z" 
          fill="${color}" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- 顶部圆形开口 -->
    <ellipse cx="${centerX}" cy="${topY}" rx="${topWidth/2 - 2}" ry="4" fill="${color}" stroke="white" stroke-width="2"/>
    <!-- 数字文本 -->
    <text x="${centerX}" y="${(topY + bottomY)/2 + 6}" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${markerId}</text>
  </svg>`
  const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`

  // 创建自定义图标 - 增大尺寸
  const icon = new window.AMap.Icon({
    size: new window.AMap.Size(iconSize, iconSize),
    image: svgDataUri,
    imageSize: new window.AMap.Size(iconSize, iconSize),
    imageOffset: new window.AMap.Pixel(0, -bottomWidth/2) // 调整锚点位置，使漏斗底部指向位置
  })

  // 创建标记
  const marker = new window.AMap.Marker({
    position: [lng, lat],
    title: address,
    map: map.value,
    icon: icon,
    zIndex: 100 + markerId,
  })

  // 创建信息窗体
  const infoWindow = new window.AMap.InfoWindow({
    content: `<div style="padding: 10px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: ${color};">📍 标记 ${markerId}</div>
      <div style="font-weight: bold; font-size: 14px; color: #333;">${address}</div>
    </div>`,
    offset: new window.AMap.Pixel(0, -30),
  })

  // 点击标记显示信息窗体并高亮
  marker.on('click', () => {
    selectedMarkerId.value = markerId
    infoWindow.open(map.value, marker.getPosition())
    // 定位到标记
    map.value.setCenter([lng, lat])
    map.value.setZoom(15)
  })

  // 保存标记信息
  const markerInfo: MarkerInfo = {
    id: markerId,
    address,
    lng,
    lat,
    marker,
    color,
  }

  markers.value.push(markerInfo)

  // 将地图中心移动到新标记位置
  map.value.setCenter([lng, lat])
  map.value.setZoom(15)
}

// 搜索地址并添加标记
const searchAndMarkAddress = () => {
  const address = addressInput.value.trim()
  if (!address) {
    alert('请输入地址')
    return
  }

  if (!geocoder.value) {
    alert('地理编码插件正在加载中，请稍候再试')
    return
  }

  // 地理编码
  geocoder.value.getLocation(address, (status: string, result: any) => {
    if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
      const geocode = result.geocodes[0]
      const { lng, lat } = geocode.location
      
      // 添加标记
      addMarker(lng, lat, address)
      
      // 清空输入框
      addressInput.value = ''
    } else {
      alert('地址解析失败，请检查地址是否正确')
    }
  })
}

// 处理回车键
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    searchAndMarkAddress()
  }
}

// 清除所有标记
const clearAllMarkers = () => {
  markers.value.forEach(markerInfo => {
    markerInfo.marker.setMap(null)
  })
  markers.value = []
  selectedMarkerId.value = null
  markerIdCounter = 0 // 重置计数器，下次添加标记时从1开始
}

// 定位到指定标记
const focusMarker = (markerInfo: MarkerInfo) => {
  if (!map.value) return
  
  selectedMarkerId.value = markerInfo.id
  map.value.setCenter([markerInfo.lng, markerInfo.lat])
  map.value.setZoom(15)
  
  // 打开信息窗体
  const infoWindow = new window.AMap.InfoWindow({
    content: `<div style="padding: 10px;">
      <div style="font-weight: bold; margin-bottom: 5px; color: ${markerInfo.color};">📍 标记 ${markerInfo.id}</div>
      <div style="font-weight: bold; font-size: 14px; color: #333;">${markerInfo.address}</div>
    </div>`,
    offset: new window.AMap.Pixel(0, -30),
  })
  infoWindow.open(map.value, [markerInfo.lng, markerInfo.lat])
}

// 删除指定标记
const deleteMarker = (markerInfo: MarkerInfo) => {
  markerInfo.marker.setMap(null)
  const index = markers.value.findIndex(m => m.id === markerInfo.id)
  if (index > -1) {
    markers.value.splice(index, 1)
  }
  if (selectedMarkerId.value === markerInfo.id) {
    selectedMarkerId.value = null
  }
}

// 加载高德地图API
const loadAmapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.AMap) {
      resolve()
      return
    }

    // 检查是否已经有script标签
    const existingScript = document.querySelector('script[src*="webapi.amap.com"]')
    if (existingScript) {
      // 如果script已存在，等待加载完成
      const checkInterval = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!window.AMap) {
          reject(new Error('高德地图API加载超时'))
        }
      }, 10000)
      return
    }

    // 根据高德地图文档要求，在加载JS API之前设置安全密钥
    // 参考：https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode
    if (!window._AMapSecurityConfig) {
      window._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY_KEY,
      }
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    
    script.onload = () => {
      resolve()
    }

    script.onerror = () => {
      reject(new Error('高德地图API加载失败，请检查API Key和安全密钥是否正确'))
    }

    document.head.appendChild(script)
  })
}

onMounted(async () => {
  loadAmapScript()
    .then(() => {
      initMap()
    })
    .catch((error) => {
      console.error('地图初始化失败:', error)
      alert('地图加载失败，请检查网络连接和API Key配置')
    })
})

onUnmounted(() => {
  // 清理标记
  if (markers.value.length > 0) {
    clearAllMarkers()
  }
  
  // 销毁地图
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<template>
  <div class="amap-container">
    <!-- 左侧：地图区域 -->
    <div class="left-panel">
      <div class="map-wrapper">
        <div ref="mapContainer" class="map-container"></div>
      </div>
      
      <div class="input-section">
        <div class="input-group">
          <input
            v-model="addressInput"
            type="text"
            placeholder="请输入地址（例如：北京市天安门广场）"
            class="address-input"
            @keypress="handleKeyPress"
          />
          <button @click="searchAndMarkAddress" class="search-btn">
            标记位置
          </button>
          <button @click="clearAllMarkers" class="clear-btn" v-if="markers.length > 0">
            清除全部
          </button>
        </div>
        <div class="tips">
          <p>💡 提示：输入地址后按回车或点击"标记位置"按钮，即可在地图上标记该位置</p>
        </div>
      </div>
    </div>

    <!-- 右侧：地址列表 -->
    <div class="right-panel">
      <div class="address-list-header">
        <h3>标记列表</h3>
        <span class="marker-count" v-if="markers.length > 0">{{ markers.length }} 个位置</span>
      </div>
      
      <div class="address-list" v-if="markers.length > 0">
        <div
          v-for="markerInfo in markers"
          :key="markerInfo.id"
          class="address-item"
          :class="{ active: selectedMarkerId === markerInfo.id }"
          @click="focusMarker(markerInfo)"
        >
          <div class="marker-indicator" :style="{ backgroundColor: markerInfo.color }">
            {{ markerInfo.id }}
          </div>
          <div class="address-content">
            <div class="address-text">{{ markerInfo.address }}</div>
            <div class="address-coords">
              经度: {{ markerInfo.lng.toFixed(6) }} | 纬度: {{ markerInfo.lat.toFixed(6) }}
            </div>
          </div>
          <button class="delete-btn" @click.stop="deleteMarker(markerInfo)" title="删除">
            ×
          </button>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <p>📍 暂无标记</p>
        <p class="empty-hint">上方为已标记的位置列表</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.amap-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.map-wrapper {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.map-container {
  width: 100%;
  height: 100%;
}

.input-section {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.address-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.address-input:focus {
  outline: none;
  border-color: #42b883;
}

.search-btn,
.clear-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn {
  background-color: #42b883;
  color: white;
}

.search-btn:hover {
  background-color: #35a372;
}

.clear-btn {
  background-color: #f56565;
  color: white;
}

.clear-btn:hover {
  background-color: #e53e3e;
}

.tips {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.tips p {
  margin: 5px 0;
}

/* 右侧面板 */
.right-panel {
  width: 400px;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.address-list-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.address-list-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.marker-count {
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.address-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.address-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f9f9f9;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  gap: 12px;
}

.address-item:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.address-item.active {
  background: #e8f5e9;
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.2);
}

.marker-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.address-content {
  flex: 1;
  min-width: 0;
}

.address-text {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  word-break: break-word;
}

.address-coords {
  font-size: 12px;
  color: #666;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f56565;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  background: #e53e3e;
  transform: scale(1.1);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  padding: 40px;
  text-align: center;
}

.empty-state p {
  margin: 8px 0;
  font-size: 16px;
}

.empty-hint {
  font-size: 14px;
  color: #bbb;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .amap-container {
    flex-direction: column;
  }

  .right-panel {
    width: 100%;
    max-height: 40vh;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }

  .address-input,
  .search-btn,
  .clear-btn {
    width: 100%;
  }

  .right-panel {
    max-height: 30vh;
  }

  .address-item {
    padding: 10px;
  }

  .address-text {
    font-size: 14px;
  }
}
</style>
