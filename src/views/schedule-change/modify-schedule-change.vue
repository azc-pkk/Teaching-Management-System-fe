<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改调课申请</span>
          <span v-if="changeId" class="text-xs text-gray-400">
            ID: {{ changeId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <ScheduleChangeForm
          ref="formRef"
          :initial-data="initialData"
          :disabled-fields="isApproved ? ['teacherId'] : []"
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
import ScheduleChangeForm from './components/schedule-change-form.vue'
import type { ScheduleChangeFormData } from './components/schedule-change-form.vue'
import {
  getScheduleChangeDetail as getDetailApi,
  patchScheduleChange as patchApi,
} from '@/api/scheduleChange'
import checkResponse from '@/utils/checkResponse'
import type { WorkflowStatus } from '@/api/types'

const route = useRoute()
const router = useRouter()

const formRef = shallowRef<InstanceType<typeof ScheduleChangeForm>>()
const loading = ref(false)
const submitting = ref(false)

const changeId = computed(() => route.params.id as string | undefined)
const currentStatus = ref<WorkflowStatus | undefined>(undefined)
const isApproved = computed(() => currentStatus.value === 'APPROVED' || currentStatus.value === 'COMPLETED')

const initialData = ref<Partial<ScheduleChangeFormData>>({})

async function fetchDetail() {
  if (!changeId.value) return
  loading.value = true
  try {
    const response = await getDetailApi(Number(changeId.value))
    const data = checkResponse(response.data)
    currentStatus.value = data.status
    initialData.value = {
      teacherId: data.teacherId,
      courseId: data.courseId,
      classGroupId: data.classGroupId,
      hours: data.hours,
      reason: data.reason,
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取调课详情失败')
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
    const response = await patchApi(Number(changeId.value), {
      teacherId: data.teacherId,
      courseId: data.courseId,
      classGroupId: data.classGroupId,
      hours: data.hours,
      reason: data.reason,
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