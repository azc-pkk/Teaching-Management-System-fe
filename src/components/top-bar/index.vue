<template>
  <header
    class="h-14 flex items-center justify-between px-6 backdrop-blur-md bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 text-white shadow-lg shadow-violet-900/30 relative z-20"
  >
    <!-- 左侧：Logo + 标题 -->
    <div class="flex items-center gap-3">
      <div
        class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-filter backdrop-blur-sm ring-1 ring-white/20"
      >
        <el-icon :size="20"><School /></el-icon>
      </div>
      <span class="text-base font-semibold tracking-wide">
        电子科技大学教学过程管理系统
      </span>
    </div>

    <!-- 右侧：用户信息 + 退出 -->
    <nav class="flex items-center gap-1 text-sm">
      <a
        v-for="item in navItems"
        :key="item.name"
        href="#"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-all"
      >
        <el-icon :size="15"><component :is="item.icon" /></el-icon>
        <span>{{ item.name }}</span>
      </a>

      <!-- 分隔线 -->
      <div class="w-px h-5 bg-white/20 mx-3"></div>

      <!-- 用户信息 -->
      <div class="flex items-center gap-2 text-white/90">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ring-1 ring-white/25">
          <span class="text-xs">{{ avatarText }}</span>
        </div>
        <div class="text-left leading-tight">
          <div class="text-sm font-medium">{{ authStore.displayName || '用户' }}</div>
          <div class="text-xs text-white/60">{{ authStore.userName }}</div>
        </div>
      </div>

      <!-- 退出按钮 -->
      <el-button
        text
        class="text-white/70! hover:text-white!"
        @click="handleLogout"
      >
        <el-icon :size="16"><SwitchButton /></el-icon>
      </el-button>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import {
  School,
  SwitchButton,
  Message,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const router = useRouter()

const avatarText = computed(() => {
  const name = authStore.displayName || '用户'
  return name.slice(0, 2)
})

const navItems = [
  { name: '邮件', icon: Message },
] satisfies { name: string; icon: any }[]

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '退出确认', { type: 'warning' })
    .then(() => {
      authStore.resetAuth()
      ElMessage.success('已退出登录')
      router.push({ name: 'login' })
    })
    .catch(() => {})
}

onMounted(() => {
  if (authStore.isLogin) {
    authStore.fetchUserProfile()
  }
})
</script>