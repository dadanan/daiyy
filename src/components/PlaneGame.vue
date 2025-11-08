<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 游戏状态
const gameState = ref<'menu' | 'playing' | 'paused' | 'gameover'>('menu')
const score = ref(0)
const lives = ref(3)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 游戏对象
interface Position {
  x: number
  y: number
}

interface Player extends Position {
  width: number
  height: number
  speed: number
}

interface Enemy extends Position {
  width: number
  height: number
  speed: number
}

interface Bullet extends Position {
  width: number
  height: number
  speed: number
}

const player = ref<Player>({
  x: 0,
  y: 0,
  width: 40,
  height: 40,
  speed: 5
})

const enemies = ref<Enemy[]>([])
const bullets = ref<Bullet[]>([])

// 控制状态
const keys = ref<{ [key: string]: boolean }>({})
const mousePos = ref<Position>({ x: 0, y: 0 })

// 游戏循环
let animationFrameId: number | null = null
let enemySpawnTimer = 0
let bulletCooldown = 0

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

// 初始化游戏
const initGame = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 初始化玩家位置
  player.value.x = CANVAS_WIDTH / 2 - player.value.width / 2
  player.value.y = CANVAS_HEIGHT - player.value.height - 20

  // 清空数组
  enemies.value = []
  bullets.value = []
  score.value = 0
  lives.value = 3
  enemySpawnTimer = 0
  bulletCooldown = 0
}

// 绘制玩家
const drawPlayer = (ctx: CanvasRenderingContext2D) => {
  const p = player.value
  ctx.fillStyle = '#42b883'
  ctx.beginPath()
  ctx.moveTo(p.x + p.width / 2, p.y)
  ctx.lineTo(p.x, p.y + p.height)
  ctx.lineTo(p.x + p.width / 4, p.y + p.height * 0.7)
  ctx.lineTo(p.x + p.width * 0.75, p.y + p.height * 0.7)
  ctx.lineTo(p.x + p.width, p.y + p.height)
  ctx.closePath()
  ctx.fill()
  
  // 绘制引擎光效
  ctx.fillStyle = '#ff6b6b'
  ctx.fillRect(p.x + p.width * 0.3, p.y + p.height * 0.7, p.width * 0.4, p.height * 0.3)
}

// 绘制敌机
const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
  ctx.fillStyle = '#f56565'
  ctx.beginPath()
  ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height)
  ctx.lineTo(enemy.x, enemy.y)
  ctx.lineTo(enemy.x + enemy.width / 4, enemy.y + enemy.height * 0.3)
  ctx.lineTo(enemy.x + enemy.width * 0.75, enemy.y + enemy.height * 0.3)
  ctx.lineTo(enemy.x + enemy.width, enemy.y)
  ctx.closePath()
  ctx.fill()
}

// 绘制子弹
const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
  ctx.fillStyle = '#ffd93d'
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
}

// 碰撞检测
const checkCollision = (rect1: Position & { width: number; height: number }, 
                       rect2: Position & { width: number; height: number }): boolean => {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y
}

// 更新游戏逻辑
const update = () => {
  if (gameState.value !== 'playing') return

  const canvas = canvasRef.value
  if (!canvas) return

  // 更新玩家位置（键盘控制）
  if (keys.value['ArrowLeft'] || keys.value['a'] || keys.value['A']) {
    player.value.x = Math.max(0, player.value.x - player.value.speed)
  }
  if (keys.value['ArrowRight'] || keys.value['d'] || keys.value['D']) {
    player.value.x = Math.min(CANVAS_WIDTH - player.value.width, player.value.x + player.value.speed)
  }
  if (keys.value['ArrowUp'] || keys.value['w'] || keys.value['W']) {
    player.value.y = Math.max(0, player.value.y - player.value.speed)
  }
  if (keys.value['ArrowDown'] || keys.value['s'] || keys.value['S']) {
    player.value.y = Math.min(CANVAS_HEIGHT - player.value.height, player.value.y + player.value.speed)
  }

  // 鼠标控制（平滑跟随）
  if (mousePos.value.x > 0 && mousePos.value.y > 0) {
    const dx = mousePos.value.x - (player.value.x + player.value.width / 2)
    const dy = mousePos.value.y - (player.value.y + player.value.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      player.value.x += (dx / distance) * player.value.speed * 0.5
      player.value.y += (dy / distance) * player.value.speed * 0.5
      player.value.x = Math.max(0, Math.min(CANVAS_WIDTH - player.value.width, player.value.x))
      player.value.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.value.height, player.value.y))
    }
  }

  // 自动射击
  bulletCooldown--
  if (bulletCooldown <= 0) {
    bullets.value.push({
      x: player.value.x + player.value.width / 2 - 3,
      y: player.value.y,
      width: 6,
      height: 15,
      speed: 8
    })
    bulletCooldown = 10
  }

  // 生成敌机
  enemySpawnTimer--
  if (enemySpawnTimer <= 0) {
    enemies.value.push({
      x: Math.random() * (CANVAS_WIDTH - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2 + Math.random() * 2 + Math.floor(score.value / 100) * 0.5
    })
    enemySpawnTimer = 60 - Math.floor(score.value / 50) * 5
    if (enemySpawnTimer < 20) enemySpawnTimer = 20
  }

  // 更新子弹
  bullets.value = bullets.value.filter(bullet => {
    bullet.y -= bullet.speed
    return bullet.y > -bullet.height
  })

  // 更新敌机
  enemies.value = enemies.value.filter(enemy => {
    enemy.y += enemy.speed
    return enemy.y < CANVAS_HEIGHT
  })

  // 子弹与敌机碰撞
  bullets.value = bullets.value.filter(bullet => {
    const hitEnemy = enemies.value.findIndex(enemy => checkCollision(bullet, enemy))
    if (hitEnemy !== -1) {
      enemies.value.splice(hitEnemy, 1)
      score.value += 10
      return false
    }
    return true
  })

  // 玩家与敌机碰撞
  const hitEnemy = enemies.value.find(enemy => checkCollision(player.value, enemy))
  if (hitEnemy) {
    const index = enemies.value.indexOf(hitEnemy)
    enemies.value.splice(index, 1)
    lives.value--
    if (lives.value <= 0) {
      gameState.value = 'gameover'
    }
  }
}

// 渲染游戏
const render = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制星空背景
  ctx.fillStyle = '#fff'
  for (let i = 0; i < 50; i++) {
    const x = (i * 37) % CANVAS_WIDTH
    const y = (i * 53 + Date.now() * 0.1) % CANVAS_HEIGHT
    ctx.fillRect(x, y, 2, 2)
  }

  if (gameState.value === 'playing' || gameState.value === 'paused') {
    // 绘制游戏对象
    drawPlayer(ctx)
    enemies.value.forEach(enemy => drawEnemy(ctx, enemy))
    bullets.value.forEach(bullet => drawBullet(ctx, bullet))

    // 绘制UI
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial'
    ctx.fillText(`分数: ${score.value}`, 10, 30)
    ctx.fillText(`生命: ${lives.value}`, 10, 60)

    if (gameState.value === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#fff'
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('暂停', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.textAlign = 'left'
    }
  } else if (gameState.value === 'menu') {
    ctx.fillStyle = '#fff'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('打飞机游戏', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)
    ctx.font = '24px Arial'
    ctx.fillText('点击开始游戏', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    ctx.fillText('使用方向键或WASD移动', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60)
    ctx.fillText('鼠标也可以控制', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100)
    ctx.textAlign = 'left'
  } else if (gameState.value === 'gameover') {
    ctx.fillStyle = '#fff'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)
    ctx.font = '24px Arial'
    ctx.fillText(`最终分数: ${score.value}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    ctx.fillText('点击重新开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60)
    ctx.textAlign = 'left'
  }
}

// 游戏主循环
const gameLoop = () => {
  update()
  render()
  animationFrameId = requestAnimationFrame(gameLoop)
}

// 开始游戏
const startGame = () => {
  gameState.value = 'playing'
  initGame()
  if (animationFrameId === null) {
    gameLoop()
  }
}

// 暂停/继续游戏
const togglePause = () => {
  if (gameState.value === 'playing') {
    gameState.value = 'paused'
  } else if (gameState.value === 'paused') {
    gameState.value = 'playing'
  }
}

// 重新开始
const restartGame = () => {
  if (gameState.value === 'gameover' || gameState.value === 'menu') {
    startGame()
  }
}

// 键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  keys.value[e.key] = true
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    if (gameState.value === 'menu' || gameState.value === 'gameover') {
      restartGame()
    } else if (gameState.value === 'playing' || gameState.value === 'paused') {
      togglePause()
    }
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  keys.value[e.key] = false
}

// 鼠标事件
const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mousePos.value.x = e.clientX - rect.left
  mousePos.value.y = e.clientY - rect.top
}

const handleClick = () => {
  if (gameState.value === 'menu' || gameState.value === 'gameover') {
    restartGame()
  } else if (gameState.value === 'playing' || gameState.value === 'paused') {
    togglePause()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  if (canvasRef.value) {
    canvasRef.value.addEventListener('mousemove', handleMouseMove)
    canvasRef.value.addEventListener('click', handleClick)
  }
  render()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
    canvasRef.value.removeEventListener('click', handleClick)
  }
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="game-container">
    <canvas
      ref="canvasRef"
      :width="800"
      :height="600"
      class="game-canvas"
    ></canvas>
    <div class="game-controls">
      <button v-if="gameState === 'menu'" @click="startGame" class="game-btn">
        开始游戏
      </button>
      <button v-if="gameState === 'playing'" @click="togglePause" class="game-btn">
        暂停
      </button>
      <button v-if="gameState === 'paused'" @click="togglePause" class="game-btn">
        继续
      </button>
      <button v-if="gameState === 'gameover'" @click="restartGame" class="game-btn">
        重新开始
      </button>
    </div>
    <div class="game-instructions">
      <p><strong>操作说明：</strong></p>
      <p>方向键或 WASD：移动飞机</p>
      <p>鼠标：控制飞机移动</p>
      <p>空格键：暂停/继续</p>
      <p>自动射击，消灭敌机获得分数！</p>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.game-canvas {
  border: 3px solid #42b883;
  border-radius: 8px;
  background: #1a1a2e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: crosshair;
}

.game-controls {
  display: flex;
  gap: 1rem;
}

.game-btn {
  padding: 0.75rem 2rem;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #42b883, #35a372);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.3);
}

.game-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.game-btn:active {
  transform: translateY(0);
}

.game-instructions {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  max-width: 600px;
}

.game-instructions p {
  margin: 0.5rem 0;
  font-size: 14px;
}

.game-instructions strong {
  color: #42b883;
}
</style>
