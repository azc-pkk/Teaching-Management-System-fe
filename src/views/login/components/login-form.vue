<template>
  <div class="w-full max-w-380px">
    <header class="mb-32px">
      <h2 class="text-26px font-semibold m-0 mb-8px c-[--text-h]">欢迎登录</h2>
      <p class="text-14px c-[--text]">请使用您的账号登录系统</p>
    </header>

    <el-form
      ref="formRef"
      :model="userInfo"
      :rules="rules"
      size="large"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="userInfo.username"
          placeholder="请输入用户名 / 工号 / 学号"
          clearable
          :prefix-icon="User"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="userInfo.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
          :prefix-icon="Lock"
        />
      </el-form-item>

      <div class="flex items-center justify-between mb-20px">
        <el-checkbox
          v-model="userConfig.remember"
        >记住我</el-checkbox>
        <el-link type="primary" :underline="false">忘记密码？</el-link>
      </div>

      <el-button
        type="primary"
        size="large"
        class="w-full tracking-4px text-16px"
        :loading="loading"
        native-type="submit"
      >
        登 录
      </el-button>
    </el-form>

    <footer class="mt-28px text-center text-14px c-[--text]">
      <span>还没有账号？</span>
      <el-link type="primary" :underline="false">联系管理员注册</el-link>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'
import useLoading from '@/hooks/loading'
import type { FormRules } from 'element-plus'
import { useAuthStore } from '@/store'
import { ElMessage } from 'element-plus'

const { loading, setLoading } = useLoading()
const authStore = useAuthStore()
const router = useRouter()

const userConfig = useStorage('user-config', {
  username: '',
  remember: false,
})

const userInfo = reactive({
  username: userConfig.value.username,
  password: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, message: '账号长度不能少于 3 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
}

const handleSubmit = async() => {
  if (loading.value) return;
  setLoading(true);
  try {
    await authStore.login(userInfo.username, userInfo.password);
    const { redirect, ...otherQuery } = router.currentRoute.value.query;
    router.push({
      name: (redirect as string) || 'dashboard-home',
      query: {
        ...otherQuery,
      }
    })
    ElMessage.success('登录成功');
    if (userConfig.value.remember) {
      userConfig.value.username = userInfo.username;
    } else {
      userConfig.value.username = '';
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请重试');
  } finally {
    setLoading(false);
  }
}

</script>