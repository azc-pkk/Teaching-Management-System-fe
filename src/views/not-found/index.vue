<template>
  <div class="flex flex-1 items-center justify-center p-32px">
    <div class="text-center max-w-480px">
      <div
        class="text-80px font-bold leading-none mb-16px tracking--2px
               bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#2563eb]
               bg-clip-text text-transparent
               sm:text-120px"
      >
        404
      </div>
      <h1 class="text-28px font-semibold m-0 mb-12px c-[--text-h]">页面走丢了</h1>
      <p class="text-15px leading-1.6 c-[--text] m-0 mb-32px">
        抱歉，您访问的页面不存在或已被移除，请检查地址是否正确。
      </p>
      <div class="flex gap-12px justify-center flex-wrap">
        <el-button type="primary" size="large" class="mr-6px" @click="goHome">
          <el-icon class="mr-6px"><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" class="mr-6px" @click="goBack">
          <el-icon class="mr-6px"><Back /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HomeFilled, Back } from '@element-plus/icons-vue'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>