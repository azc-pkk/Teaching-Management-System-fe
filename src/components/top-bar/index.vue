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

    <!-- 右侧：快捷操作 -->
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

      <!-- 用户头像 / 下拉菜单 -->
      <div class="relative group cursor-pointer">
        <div
          class="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/15 transition-colors"
        >
          <div
            class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ring-1 ring-white/25"
          >
            <span class="text-xs">管理</span>
          </div>
          <span class="text-sm">管理员</span>
          <el-icon class="text-xs transition-transform group-hover:rotate-180">
            <ArrowDown />
          </el-icon>
        </div>

        <!-- 下拉菜单 -->
        <ul
          class="absolute right-0 top-full mt-1 w-44 bg-white text-gray-700 rounded-lg shadow-xl shadow-gray-900/10 ring-1 ring-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all z-30 overflow-hidden"
        >
          <li class="flex items-center gap-2 px-4 py-2.5 hover:bg-indigo-50 transition-colors">
            <el-icon :size="15"><User /></el-icon>
            <span class="text-sm">个人信息</span>
          </li>
          <li class="flex items-center gap-2 px-4 py-2.5 hover:bg-indigo-50 transition-colors">
            <el-icon :size="15"><Setting /></el-icon>
            <span class="text-sm">个人设置</span>
          </li>
          <li class="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
            <el-icon :size="15"><SwitchButton /></el-icon>
            <span class="text-sm">退出登录</span>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import {
  School,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  HomeFilled,
  Message,
} from '@element-plus/icons-vue'

const navItems = [
  { name: '主页', icon: HomeFilled },
  { name: '邮件', icon: Message },
] satisfies { name: string; icon: any }[]
</script>