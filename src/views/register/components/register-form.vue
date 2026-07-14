<template>
  <div class="w-full max-w-380px">
    <header class="mb-32px">
      <h2 class="text-26px font-semibold m-0 mb-8px c-[--text-h]">学生注册</h2>
      <p class="text-14px c-[--text]">使用学号和姓名匹配档案后设置登录密码</p>
    </header>

    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      size="large"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="学号" prop="studentNo">
        <el-input
          v-model="formModel.studentNo"
          placeholder="请输入学号"
          clearable
          :prefix-icon="User"
        />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="formModel.name"
          placeholder="请输入姓名（须与档案一致）"
          clearable
          :prefix-icon="Postcard"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formModel.password"
          type="password"
          placeholder="请设置密码（至少 6 位）"
          show-password
          clearable
          :prefix-icon="Lock"
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="formModel.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
          clearable
          :prefix-icon="Lock"
        />
      </el-form-item>

      <el-button
        type="primary"
        size="large"
        class="w-full tracking-4px text-16px"
        :loading="loading"
        native-type="submit"
      >
        注 册
      </el-button>
    </el-form>

    <footer class="mt-28px text-center text-14px c-[--text]">
      <span>已有账号？</span>
      <el-link type="primary" :underline="false" @click="goLogin">返回登录</el-link>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock, Postcard } from '@element-plus/icons-vue'
import { register as registerApi } from '@/api/auth'
import checkResponse from '@/utils/checkResponse'
import useLoading from '@/hooks/loading'

const { loading, setLoading } = useLoading()
const router = useRouter()
const formRef = shallowRef<FormInstance>()

const formModel = reactive({
  studentNo: '',
  name: '',
  password: '',
  confirmPassword: '',
})

const rules: FormRules = {
  studentNo: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{12}$/, message: '学号应为 12 位数字', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { max: 32, message: '姓名长度不能超过 32 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== formModel.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function handleSubmit() {
  if (loading.value) return
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  setLoading(true)
  try {
    const response = await registerApi({
      studentNo: formModel.studentNo,
      name: formModel.name,
      password: formModel.password,
    })
    const data = checkResponse(response.data)
    ElMessage.success(`注册成功，欢迎 ${data.user.name}！请使用学号登录。`)
    router.push({ name: 'login' })
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '注册失败，请重试')
  } finally {
    setLoading(false)
  }
}

function goLogin() {
  router.push({ name: 'login' })
}
</script>