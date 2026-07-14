<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><UserFilled /></el-icon>
          <span class="font-medium">新增教师</span>
        </div>
      </template>

      <TeacherForm ref="teacherFormRef" />

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
import { UserFilled } from '@element-plus/icons-vue'
import TeacherForm from './components/teacher-form.vue'
import { addTeacher as addApi } from '@/api/teacher'
import checkResponse from '@/utils/checkResponse'

const router = useRouter()
const teacherFormRef = shallowRef<InstanceType<typeof TeacherForm>>()
const submitting = ref(false)

async function handleSubmit() {
  if (!teacherFormRef.value) return
  try {
    await teacherFormRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const data = teacherFormRef.value.getFormData()
    const response = await addApi({
      name: data.name,
      employeeNo: data.employeeNo,
      departmentId: data.departmentId ?? null,
      teacherType: data.teacherType ?? null,
      title: data.title ?? null,
      phone: data.phone || null,
    })
    checkResponse(response.data)
    ElMessage.success('新增教师成功')
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