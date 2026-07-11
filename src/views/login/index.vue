<template>
  <div class="min-h-screen flex flex-col text-gray-800 bg-[#f5f7fa]">
    
    <div class="flex flex-1">
      <!-- 左侧：宣传图区域 -->
      <div class="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <!-- 
          1. bg-gradient-to-br: 从右上(blue)到左下(purple)的渐变 
          2. after: 加一层半透明白色遮罩，让文字更易读，同时增加质感 
        -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600"></div>
        <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <!-- 内容区：居中显示 -->
        <div class="relative z-10 text-center px-12">
          <!-- Logo 占位 -->
          <!-- TODO: logo? -->
          <div class="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-6"></div>
          
          <h1 class="text-4xl font-bold text-white mb-3 tracking-wide">教学过程管理系统</h1>
          <p class="text-blue-100 mb-10 text-sm">覆盖教学计划、课堂互动、成绩评估的全流程协作平台</p>
          
          <div class="space-y-3 text-left text-sm text-white/90">
            <div class="flex items-center"><span class="mr-2">✓</span> 课程与教学计划一站管理</div>
            <div class="flex items-center"><span class="mr-2">✓</span> 课堂过程数据实时沉淀</div>
            <div class="flex items-center"><span class="mr-2">✓</span> 教师 / 学生 / 管理员多端协作</div>
          </div>
        </div>
      </div>

      <!-- 右侧：表单区域 -->
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#f5f7fa]">
        <LoginForm class="w-full max-w-md" />
      </div>
    </div>
    <Footer class="mt-auto pt-1 pb-1" />
  </div>
</template>

<script lang="ts" setup>
import Footer from '@/components/footer/index.vue'
import LoginForm from './components/login-form.vue'
</script>