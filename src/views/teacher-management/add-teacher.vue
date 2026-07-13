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
    // TODO: 调用后端新增教师接口
    // await createTeacher({
    //   ...data,
    //   phone: data.phone || undefined,
    // })
    console.log('[add-teacher] payload:', data)
    ElMessage.success('新增教师成功（待实现）')
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