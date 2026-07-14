<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><Plus /></el-icon>
          <span class="font-medium">新增教室</span>
        </div>
      </template>

      <ClassroomForm ref="classroomFormRef" />

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
import ClassroomForm from './components/classroom-form.vue'
import { addClassroom as addApi } from '@/api/classroom'
import checkResponse from '@/utils/checkResponse'

const router = useRouter()
const classroomFormRef = shallowRef<InstanceType<typeof ClassroomForm>>()
const submitting = ref(false)

async function handleSubmit() {
  if (!classroomFormRef.value) return
  try {
    await classroomFormRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const data = classroomFormRef.value.getFormData()
    const response = await addApi({
      roomNo: data.roomNo,
      capacity: data.capacity,
      status: data.status,
      type: data.type ?? null,
      campus: data.campus ?? null,
      building: data.building ?? null,
      area: data.area ?? null,
    })
    checkResponse(response.data)
    ElMessage.success('新增教室成功')
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