<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><Plus /></el-icon>
          <span class="font-medium">新建教室借用申请</span>
        </div>
      </template>

      <ClassroomRequestForm ref="formRef" />

      <div class="flex gap-3 pl-25">
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import ClassroomRequestForm from './components/classroom-request-form.vue'
import { addClassroomRequest as addApi } from '@/api/classroomRequest'
import { useAuthStore } from '@/store'
import checkResponse from '@/utils/checkResponse'

const router = useRouter()
const authStore = useAuthStore()
const formRef = shallowRef<InstanceType<typeof ClassroomRequestForm>>()
const submitting = ref(false)

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const data = formRef.value.getFormData()
    const response = await addApi({
      applicantId: authStore.userId,
      classroomId: data.classroomId!,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
    })
    checkResponse(response.data)
    ElMessage.success('提交申请成功')
    router.back()
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '提交失败')
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.back()
}
</script>