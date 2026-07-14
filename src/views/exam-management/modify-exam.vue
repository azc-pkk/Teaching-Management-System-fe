<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改考试安排</span>
          <span v-if="examId" class="text-xs text-gray-400">
            ID: {{ examId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <ExamForm
          ref="formRef"
          :initial-data="initialData"
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
import ExamForm from './components/exam-form.vue'
import type { ExamFormData } from './components/exam-form.vue'
import {
  getExamDetail as getDetailApi,
  patchExam as patchApi,
} from '@/api/exam'
import checkResponse from '@/utils/checkResponse'

const route = useRoute()
const router = useRouter()

const formRef = shallowRef<InstanceType<typeof ExamForm>>()
const loading = ref(false)
const submitting = ref(false)

const examId = computed(() => route.params.id as string | undefined)

const initialData = ref<Partial<ExamFormData>>({})

async function fetchDetail() {
  if (!examId.value) return
  loading.value = true
  try {
    const response = await getDetailApi(Number(examId.value))
    const data = checkResponse(response.data)
    initialData.value = {
      semesterId: data.semesterId,
      courseId: data.courseId,
      classGroupId: data.classGroupId,
      classroomId: data.classroomId,
      startTime: data.startTime,
      endTime: data.endTime,
      invigilatorId: data.invigilatorId ?? undefined,
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取考试详情失败')
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
    const response = await patchApi(Number(examId.value), {
      semesterId: data.semesterId,
      courseId: data.courseId,
      classGroupId: data.classGroupId,
      classroomId: data.classroomId,
      startTime: data.startTime,
      endTime: data.endTime,
      invigilatorId: data.invigilatorId ?? null,
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