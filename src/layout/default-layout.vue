<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 顶部导航栏 -->
    <TopBar />

    <!-- 中间区域：左侧菜单 + 右侧内容 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧导航菜单 -->
      <Menu />

      <!-- 右侧主内容区 -->
      <PageLayout>
        <router-view />
      </PageLayout>
    </div>

    <!-- 底部页脚 -->
    <Footer class="pt-1 pb-1"/>
  </div>
</template>

<script lang="ts" setup>
import TopBar from '@/components/top-bar/index.vue'
import Menu from '@/components/menu/index.vue'
import Footer from '@/components/footer/index.vue'
import PageLayout from './page-layout.vue'
</script>