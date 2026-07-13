<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改学生信息</span>
          <span v-if="studentId" class="text-xs text-gray-400">
            ID: {{ studentId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <StudentForm
          ref="studentFormRef"
          :initial-data="initialData"
          :disabled-fields="['studentNo']"
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
import StudentForm from './components/student-form.vue'
import type { StudentFormData } from './components/student-form.vue'

const route = useRoute()
const router = useRouter()

const studentFormRef = shallowRef<InstanceType<typeof StudentForm>>()
const loading = ref(false)
const submitting = ref(false)

const studentId = computed(() => route.params.id as string | undefined)

const initialData = ref<Partial<StudentFormData>>({})

async function fetchStudentDetail() {
  if (!studentId.value) return
  loading.value = true
  try {
    // TODO: 调用后端获取学生详情接口
    // const res = await getStudentDetail(Number(studentId.value))
    // initialData.value = {
    //   name: res.data.data.name,
    //   studentNo: res.data.data.studentNo,
    //   grade: res.data.data.grade,
    //   classGroupId: res.data.data.classGroupId,
    //   status: res.data.data.status,
    //   phone: res.data.data.phone ?? '',
    // }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取学生信息失败')
  } finally {
    loading.value = false
  }
}

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
    // TODO: 调用后端修改学生接口
    // await updateStudent(Number(studentId.value), {
    //   ...data,
    //   phone: data.phone || undefined,
    // })
    console.log('[modify-student] id:', studentId.value, 'payload:', data)
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
  fetchStudentDetail()
})
</script>