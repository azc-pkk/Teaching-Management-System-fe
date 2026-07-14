<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改教室信息</span>
          <span v-if="classroomId" class="text-xs text-gray-400">
            ID: {{ classroomId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <ClassroomForm
          ref="classroomFormRef"
          :initial-data="initialData"
          :disabled-fields="['roomNo']"
        />

        <div class="flex gap-3 pl-25">
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
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
import ClassroomForm from './components/classroom-form.vue'
import type { ClassroomFormData } from './components/classroom-form.vue'
import {
  getClassroomDetail as getDetailApi,
  patchClassroom as patchApi,
} from '@/api/classroom'
import checkResponse from '@/utils/checkResponse'

const route = useRoute()
const router = useRouter()

const classroomFormRef = shallowRef<InstanceType<typeof ClassroomForm>>()
const loading = ref(false)
const submitting = ref(false)

const classroomId = computed(() => route.params.id as string | undefined)

const initialData = ref<Partial<ClassroomFormData>>({})

async function fetchClassroomDetail() {
  if (!classroomId.value) return
  loading.value = true
  try {
    const response = await getDetailApi(Number(classroomId.value))
    const data = checkResponse(response.data)
    initialData.value = {
      roomNo: data.roomNo,
      capacity: data.capacity,
      status: data.status,
      type: data.type ?? undefined,
      campus: data.campus ?? undefined,
      building: data.building ?? undefined,
      area: data.area ?? undefined,
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取教室信息失败')
  } finally {
    loading.value = false
  }
}

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
    const response = await patchApi(Number(classroomId.value), {
      capacity: data.capacity,
      status: data.status,
      type: data.type ?? null,
      campus: data.campus ?? null,
      building: data.building ?? null,
      area: data.area ?? null,
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
  fetchClassroomDetail()
})
</script>