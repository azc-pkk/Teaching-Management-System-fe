<template>
  <div class="p-6 lg:p-8 max-w-5xl mx-auto">
    <!-- 顶部横幅 -->
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
             text-white shadow-lg shadow-violet-900/20 mb-8"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.1),transparent_40%)]" />
      <div class="relative z-10 px-8 py-10 lg:py-14">
        <h1 class="text-3xl lg:text-4xl font-bold tracking-wide mb-3">
          电子科技大学
        </h1>
        <p class="text-base lg:text-lg text-white/85 leading-relaxed max-w-2xl">
          教学过程管理系统 · 覆盖教学计划、课堂互动、成绩评估的全流程协作平台
        </p>
      </div>
    </section>

    <!-- 学校简介卡片 -->
    <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 lg:p-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <el-icon :size="22" class="text-indigo-600"><School /></el-icon>
        学校简介
      </h2>
      <div class="text-sm lg:text-base text-gray-600 leading-7 space-y-4">
        <p>
          电子科技大学（University of Electronic Science and Technology of China，简称"电子科大"或" UESTC"）坐落于四川省成都市，是中华人民共和国教育部直属高等学校，为教育部、工业和信息化部、四川省和成都市共建，是国家"双一流"、"985 工程优势学科创新平台"、"2011 计划"、"111 计划"建设单位。
        </p>
        <p>
          学校原名成都电讯工程学院，成立于 1956 年 9 月，是在周恩来总理的亲自部署下，由交通大学（现上海交通大学、西安交通大学）、南京工学院（现东南大学）、华南工学院（现华南理工大学）的电讯工程有关专业合并创建而成。1960 年被中共中央列为全国重点高等学校，1961 年被中共中央确定为七所国防工业院校之一，1988 年更名为电子科技大学。1997 年被确定为国家首批"211 工程"建设的重点大学。
        </p>
        <p>
          学校以电子信息科学技术为核心，以工为主，理工渗透，理、工、管、文、医协调发展，是一所完整覆盖整个电子类学科，以电子信息科学技术为核心，以工为主，理工渗透的多科性研究型大学。
        </p>
      </div>
    </section>

    <!-- 三张特色卡片 -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div
        v-for="card in featureCards"
        :key="card.title"
        class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 transition-all
               hover:shadow-md hover:-translate-y-0.5"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          :class="card.bgClass"
        >
          <el-icon :size="24" :class="card.iconClass">
            <component :is="card.icon" />
          </el-icon>
        </div>
        <h3 class="text-base font-semibold text-gray-800 mb-2">{{ card.title }}</h3>
        <p class="text-sm text-gray-500 leading-6">{{ card.desc }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import {
  School,
  Reading,
  Trophy,
  OfficeBuilding,
} from '@element-plus/icons-vue'

interface FeatureCard {
  title: string
  desc: string
  icon: Component
  bgClass: string
  iconClass: string
}

const featureCards: FeatureCard[] = [
  {
    title: '学科建设',
    desc: '以电子信息科学技术为核心，理工渗透，多学科协调发展，完整覆盖整个电子类学科。',
    icon: Reading,
    bgClass: 'bg-indigo-50',
    iconClass: 'text-indigo-600',
  },
  {
    title: '科研实力',
    desc: '建有国家级科研平台多个，在电子信息领域科研实力雄厚，承担国家重大科研项目。',
    icon: Trophy,
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-600',
  },
  {
    title: '校园风貌',
    desc: '坐落于成都市，校园环境优美，设施完善，是学习与生活的理想之地。',
    icon: OfficeBuilding,
    bgClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
  },
]

interface Stat {
  label: string
  value: string
}
</script>