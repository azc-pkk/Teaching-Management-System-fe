<template>
  <div class="flex flex-1 items-center justify-center p-32px">
    <div class="text-center max-w-480px">
      <div
        class="text-80px font-bold leading-none mb-16px tracking--2px
               bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b]
               bg-clip-text text-transparent
               sm:text-120px"
      >
        403
      </div>
      <h1 class="text-28px font-semibold m-0 mb-12px c-[--text-h]">权限不足</h1>
      <p class="text-15px leading-1.6 c-[--text] m-0 mb-32px">
        抱歉，您没有访问此页面的权限。如需访问请联系管理员。
      </p>
      <div class="flex gap-12px justify-center flex-wrap">
        <el-button type="primary" size="large" class="gap-6px" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" class="gap-6px" @click="goBack">
          <el-icon><Back /></el-icon>
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