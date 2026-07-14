<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改教室借用申请</span>
          <span v-if="requestId" class="text-xs text-gray-400">
            ID: {{ requestId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <ClassroomRequestForm
          ref="formRef"
          :initial-data="initialData"
          :disabled-fields="isApproved ? ['classroomId'] : []"
        />

        <div class="flex gap-3 pl-25">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            保存修改
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { EditPen, Loading } from '@element-plus/icons-vue'
import ClassroomRequestForm from './components/classroom-request-form.vue'
import type { ClassroomRequestFormData } from './components/classroom-request-form.vue'
import {
  getClassroomRequestDetail as getDetailApi,
  patchClassroomRequest as patchApi,
} from '@/api/classroomRequest'
import checkResponse from '@/utils/checkResponse'
import type { WorkflowStatus } from '@/api/types'

const route = useRoute()
const router = useRouter()

const formRef = shallowRef<InstanceType<typeof ClassroomRequestForm>>()
const loading = ref(false)
const submitting = ref(false)

const requestId = computed(() => route.params.id as string | undefined)
const currentStatus = ref<WorkflowStatus | undefined>(undefined)
const isApproved = computed(() => currentStatus.value === 'APPROVED' || currentStatus.value === 'COMPLETED')

const initialData = ref<Partial<ClassroomRequestFormData>>({})

async function fetchDetail() {
  if (!requestId.value) return
  loading.value = true
  try {
    const response = await getDetailApi(Number(requestId.value))
    const data = checkResponse(response.data)
    currentStatus.value = data.status
    initialData.value = {
      classroomId: data.classroomId,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取申请详情失败')
  } finally {
    loading.value = false
  }
}

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
    const response = await patchApi(Number(requestId.value), {
      classroomId: data.classroomId,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
    })
    checkResponse(response.data)
    ElMessage.success('修改成功')
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

onMounted(() => {
  fetchDetail()
})
</script>