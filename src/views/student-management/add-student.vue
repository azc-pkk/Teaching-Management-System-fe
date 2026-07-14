<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><Plus /></el-icon>
          <span class="font-medium">新增学生</span>
        </div>
      </template>

      <StudentForm ref="studentFormRef" />

      <div class="flex gap-3 pl-25">
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
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
import StudentForm from './components/student-form.vue'
import { addStudent as addApi } from '@/api/student'
import checkResponse from '@/utils/checkResponse'

const router = useRouter()
const studentFormRef = shallowRef<InstanceType<typeof StudentForm>>()
const submitting = ref(false)

async function handleSubmit() {
  if (!studentFormRef.value) return
  try {
    await studentFormRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const data = studentFormRef.value.getFormData()
    const response = await addApi({
      studentNo: data.studentNo,
      name: data.name,
      grade: data.grade!,
      classGroupId: data.classGroupId!,
      status: data.status!,
      phone: data.phone || null,
    })
    checkResponse(response.data)
    ElMessage.success('新增学生成功')
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