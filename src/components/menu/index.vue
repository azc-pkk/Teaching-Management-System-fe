<template>
  <aside
    class="shrink-0 bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-200 ease-out"
    :class="collapsed ? 'w-16' : 'w-56'"
  >
    <!-- 折叠按钮 -->
    <div
      class="flex items-center cursor-pointer transition-colors border-b border-gray-100
             text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/40"
      :class="collapsed ? 'justify-center h-12' : 'justify-between h-12 px-5'"
      @click="collapsed = !collapsed"
    >
      <el-icon :size="18" class="transition-transform hover:scale-110">
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
      <span v-if="!collapsed" class="text-xs text-slate-400 select-none">收起菜单</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeIndex"
      :default-openeds="openMenus"
      :collapse="collapsed"
      :collapse-transition="false"
      class="flex-1 border-r-0! pt-1.5 side-menu
             [--el-menu-bg-color:transparent]
             [--el-menu-hover-bg-color:rgb(242_245_252)]
             [--el-menu-text-color:rgb(51_65_85)]
             [--el-menu-active-color:rgb(67_56_202)]
             [--el-menu-item-height:46px]
             [--el-menu-sub-item-height:42px]
             [--el-menu-item-font-size:14px]"
      @select="handleSelect"
    >
      <template v-for="mod in menuRoutes" :key="mod.path">
        <!-- 无可见子路由 → 单项 -->
        <el-menu-item
          v-if="getVisibleChildren(mod).length === 0"
          :index="resolvePath(mod.path, '')"
        >
          <el-icon v-if="meta(mod)?.icon">
            <component :is="meta(mod)!.icon" />
          </el-icon>
          <span>{{ meta(mod)?.menuTitle }}</span>
        </el-menu-item>

        <!-- 有子路由 → 子菜单 -->
        <el-sub-menu v-else :index="mod.path">
          <template #title>
            <el-icon v-if="meta(mod)?.icon">
              <component :is="meta(mod)!.icon" />
            </el-icon>
            <span>{{ meta(mod)?.menuTitle }}</span>
          </template>
          <el-menu-item
            v-for="child in getVisibleChildren(mod)"
            :key="resolvePath(mod.path, child.path)"
            :index="resolvePath(mod.path, child.path)"
          >
            <el-icon v-if="childMeta(child)?.icon">
              <component :is="childMeta(child)!.icon" />
            </el-icon>
            <span>{{ childMeta(child)?.menuTitle }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
import { appRoutes } from '@/router/routes'

interface MenuMeta {
  menuTitle?: string
  icon?: Component
  hideInMenu?: boolean
  order?: number
}

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)

const activeIndex = computed(() => route.path)

const openMenus = computed(() => {
  const path = route.path
  const result: string[] = []
  for (const r of appRoutes) {
    const full = resolvePath(r.path, '')
    if (path === full || path.startsWith(r.path + '/')) {
      result.push(r.path)
    }
  }
  return result
})

const menuRoutes = computed(() =>
  appRoutes
    .filter((r) => r.meta?.hideInMenu !== true && r.meta?.menuTitle)
    .sort((a, b) => {
      const ao = (a.meta as MenuMeta | undefined)?.order ?? Number.MAX_SAFE_INTEGER
      const bo = (b.meta as MenuMeta | undefined)?.order ?? Number.MAX_SAFE_INTEGER
      return ao - bo
    }),
)

function meta(r: RouteRecordNormalized): MenuMeta | undefined {
  return r.meta as MenuMeta | undefined
}

function childMeta(r: RouteRecordRaw): MenuMeta | undefined {
  return r.meta as MenuMeta | undefined
}

function isVisibleChild(child: RouteRecordRaw): boolean {
  const m = child.meta
  if (!m) return false
  if (m.hideInMenu === true) return false
  if (!m.menuTitle) return false
  return true
}

function getVisibleChildren(route: RouteRecordNormalized): RouteRecordRaw[] {
  if (!route.children) return []
  return route.children
    .filter(isVisibleChild)
    .sort((a, b) => {
      const ao = (a.meta as MenuMeta | undefined)?.order ?? Number.MAX_SAFE_INTEGER
      const bo = (b.meta as MenuMeta | undefined)?.order ?? Number.MAX_SAFE_INTEGER
      return ao - bo
    })
}

function resolvePath(parentPath: string, childPath: string): string {
  if (childPath.startsWith('/')) return childPath
  if (childPath === '') return parentPath
  return `${parentPath.replace(/\/$/, '')}/${childPath}`
}

function handleSelect(_index: string, indexPath: string[]) {
  const path = indexPath[indexPath.length - 1]
  router.push(path)
}
</script>

<style scoped>
.side-menu :deep(.el-menu-item),
.side-menu :deep(.el-sub-menu__title) {
  margin: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  color: rgb(51 65 85);
  transition: background-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
}

.side-menu :deep(.el-menu-item:hover),
.side-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgb(242 245 252) !important;
  color: rgb(67 56 202) !important;
}

.side-menu :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  background-color: rgb(238 242 255) !important;
  color: rgb(67 56 202) !important;
  font-weight: 600;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgb(99 102 241 / 0.14) 0%, rgb(139 92 246 / 0.08) 100%) !important;
  color: rgb(67 56 202) !important;
  font-weight: 700;
  position: relative;
  box-shadow: inset 0 0 0 1px rgb(165 180 252 / 0.5);
}

.side-menu :deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  box-shadow: 0 0 8px rgb(99 102 241 / 0.5);
}

.side-menu :deep(.el-menu--inline) {
  background-color: rgb(248 250 252);
  border-radius: 0 0 10px 10px;
  margin: 0 8px 4px;
  padding: 4px 0;
  box-shadow: inset 2px 0 0 rgb(99 102 241 / 0.08);
}

.side-menu :deep(.el-menu--inline .el-menu-item) {
  margin: 2px 8px;
  height: 38px !important;
  line-height: 38px !important;
  font-size: 13px;
  font-weight: 400;
  border-radius: 8px;
  color: rgb(71 85 105);
}

.side-menu :deep(.el-menu--inline .el-menu-item:hover) {
  background-color: rgb(242 245 252) !important;
  color: rgb(67 56 202) !important;
}

.side-menu :deep(.el-menu--inline .el-menu-item.is-active) {
  color: rgb(67 56 202) !important;
  font-weight: 600;
  background: linear-gradient(135deg, rgb(99 102 241 / 0.10), rgb(139 92 246 / 0.06)) !important;
  box-shadow: inset 0 0 0 1px rgb(165 180 252 / 0.4);
}

.side-menu :deep(.el-menu--inline .el-menu-item.is-active::before) {
  left: 4px;
  width: 3px;
  height: 50%;
  border-radius: 4px;
  background: linear-gradient(to bottom, #818cf8, #a78bfa);
  box-shadow: none;
}

.side-menu :deep([class-prefix=Menu__popup]) {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.side-menu :deep(.el-popper) {
  border-radius: 10px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.side-menu :deep(.el-icon) {
  font-size: 18px;
}

.side-menu :deep(.el-sub-menu__title .el-icon) {
  margin-right: 8px;
}

.side-menu :deep(.el-menu-item .el-icon) {
  margin-right: 8px;
}
</style>