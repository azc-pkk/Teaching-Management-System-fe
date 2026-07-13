<template>
  <div class="p-6">
    <el-card shadow="never" class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-600"><EditPen /></el-icon>
          <span class="font-medium">修改教师信息</span>
          <span v-if="teacherId" class="text-xs text-gray-400">
            ID: {{ teacherId }}
          </span>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-20">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      </div>

      <template v-else>
        <TeacherForm
          ref="teacherFormRef"
          :initial-data="initialData"
          :disabled-fields="['employeeNo']"
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
import TeacherForm from './components/teacher-form.vue'
import type { TeacherFormData } from './components/teacher-form.vue'

const route = useRoute()
const router = useRouter()

const teacherFormRef = shallowRef<InstanceType<typeof TeacherForm>>()
const loading = ref(false)
const submitting = ref(false)

const teacherId = computed(() => route.params.id as string | undefined)

const initialData = ref<Partial<TeacherFormData>>({})

async function fetchTeacherDetail() {
  if (!teacherId.value) return
  loading.value = true
  try {
    // TODO: 调用后端获取教师详情接口
    // const res = await getTeacherDetail(teacherId.value)
    // initialData.value = {
    //   name: res.data.data.name,
    //   employeeNo: res.data.data.employeeNo,
    //   departmentId: res.data.data.departmentId ?? undefined,
    //   teacherType: res.data.data.teacherType ?? undefined,
    //   title: res.data.data.title ?? undefined,
    //   phone: res.data.data.phone ?? '',
    // }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取教师信息失败')
  } finally {
    loading.value = false
  }
}

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
    // TODO: 调用后端修改教师接口
    // await updateTeacher(teacherId.value!, {
    //   ...data,
    //   phone: data.phone || undefined,
    // })
    console.log('[modify-teacher] id:', teacherId.value, 'payload:', data)
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
  fetchTeacherDetail()
})
</script>