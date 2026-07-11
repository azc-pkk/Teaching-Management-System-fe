<template>
  <aside
    class="shrink-0 bg-white border-r border-gray-200 flex flex-col
           h-full transition-all duration-200 ease-out"
    :class="collapsed ? 'w-16' : 'w-56'"
  >
    <!-- 折叠按钮 -->
    <div
      class="h-10 flex items-center justify-center border-b border-gray-100 cursor-pointer
             text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
      :class="collapsed ? 'px-0' : 'px-4'"
      @click="collapsed = !collapsed"
    >
      <el-icon :size="16" class="transition-transform" :class="{ 'rotate-180': collapsed }">
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeIndex"
      :collapse="collapsed"
      :collapse-transition="false"
      class="flex-1 border-r-0! menu-violet"
    >
      <el-sub-menu
        v-for="mod in modules"
        :key="mod.path"
        :index="mod.path"
      >
        <template #title>
          <el-icon><component :is="mod.icon" /></el-icon>
          <span>{{ mod.title }}</span>
        </template>

        <el-menu-item
          v-for="sub in mod.children"
          :key="sub.path"
          :index="sub.path"
          @click="handleSelect(sub.path)"
        >
          <el-icon><component :is="sub.icon" /></el-icon>
          <template #title>{{ sub.title }}</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import {
  Fold,
  Expand,
  User,
  List,
  UserFilled,
  Reading,
  Grid,
  TrendCharts,
  Memo,
} from '@element-plus/icons-vue'

interface MenuItem {
  path: string
  title: string
  icon: Component
}

interface MenuModule {
  path: string
  title: string
  icon: Component
  children: MenuItem[]
}

const modules: MenuModule[] = [
  {
    path: '/teacher',
    title: '教师管理',
    icon: UserFilled,
    children: [
      { path: '/teacher/list', title: '教师列表', icon: List },
      { path: '/teacher/groups', title: '教师分组', icon: Grid },
      { path: '/teacher/evaluation', title: '教师考核', icon: Memo },
    ],
  },
  {
    path: '/student',
    title: '学生管理',
    icon: Reading,
    children: [
      { path: '/student/list', title: '学生列表', icon: List },
      { path: '/student/groups', title: '学生分组', icon: User },
      { path: '/student/grades', title: '学生成绩', icon: TrendCharts },
    ],
  },
]

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)

const activeIndex = computed(() => route.path)

function handleSelect(path: string) {
  // TODO: 路由真实落地后，此处 push 到对应 path
  // 当前路由未注册，仅做交互演示
  if (router.hasRoute(path)) {
    router.push(path)
  }
}
</script>

<style lang="scss" scoped>
:deep(.menu-violet) {
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: rgb(238 242 255); /* indigo-50 */
  --el-menu-text-color: rgb(55 65 81); /* gray-700 */
  --el-menu-active-color: rgb(79 70 229); /* indigo-600 */
  --el-menu-item-height: 44px;
  --el-menu-sub-item-height: 42px;
}

:deep(.menu-violet .el-sub-menu__title:hover),
:deep(.menu-violet .el-menu-item:hover) {
  background-color: rgb(238 242 255) !important;
}

:deep(.menu-violet .el-menu-item.is-active) {
  background-color: rgb(238 242 255) !important;
  font-weight: 500;
}

:deep(.menu-violet .el-menu--inline) {
  background-color: rgb(249 250 251); /* gray-50 */
  border-radius: 0;
}
</style>