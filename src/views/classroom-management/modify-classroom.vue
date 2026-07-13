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
    // TODO: 调用后端获取教室详情接口
    // const res = await getClassroomDetail(Number(classroomId.value))
    // initialData.value = {
    //   roomNo: res.data.data.roomNo,
    //   capacity: res.data.data.capacity,
    //   status: res.data.data.status,
    //   type: res.data.data.type ?? undefined,
    //   campus: res.data.data.campus ?? undefined,
    //   building: res.data.data.building ?? undefined,
    //   area: res.data.data.area ?? undefined,
    // }
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
    // TODO: 调用后端修改教室接口
    // await updateClassroom(Number(classroomId.value), {
    //   ...data,
    //   area: data.area || undefined,
    // })
    console.log('[modify-classroom] id:', classroomId.value, 'payload:', data)
    ElMessage.success('修改成功（待实现）')
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