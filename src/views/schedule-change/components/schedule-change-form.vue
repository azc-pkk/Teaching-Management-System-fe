<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="100px"
    label-position="right"
    size="default"
  >
    <el-form-item label="教师" prop="teacherId">
      <el-select
        v-model="formModel.teacherId"
        placeholder="请选择教师"
        filterable
        clearable
        :disabled="disabledFields.includes('teacherId')"
        class="w-72!"
      >
        <el-option
          v-for="t in teacherOptions"
          :key="t.id"
          :label="`${t.name}（${t.employeeNo}）`"
          :value="t.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="课程" prop="courseId">
      <el-select
        v-model="formModel.courseId"
        placeholder="请选择课程"
        filterable
        clearable
        class="w-72!"
      >
        <el-option
          v-for="c in courseOptions"
          :key="c.id"
          :label="c.label"
          :value="c.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="班级" prop="classGroupId">
      <el-select
        v-model="formModel.classGroupId"
        placeholder="请选择班级"
        filterable
        clearable
        class="w-72!"
      >
        <el-option
          v-for="c in classGroupOptions"
          :key="c.id"
          :label="c.name"
          :value="c.id ?? 0"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="调课学时" prop="hours">
      <el-input-number
        v-model="formModel.hours"
        :min="0.5"
        :step="0.5"
        :precision="1"
        controls-position="right"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="调课原因" prop="reason">
      <el-input
        v-model="formModel.reason"
        type="textarea"
        :rows="3"
        placeholder="请输入调课原因"
        maxlength="500"
        show-word-limit
        class="w-72!"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getTeacherList } from '@/api/teacher'
import type { Teacher } from '@/api/teacher'
import { getStudentFilterOptions } from '@/api/student'
import type { ClassGroup } from '@/api/student'
import { getCourseOptions } from '@/api/baseDataOptions'
import type { CourseOption } from '@/api/baseDataOptions'

export interface ScheduleChangeFormData {
    teacherId: number | undefined
    courseId: number | undefined
    classGroupId: number | undefined
    hours: number
    reason: string
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<ScheduleChangeFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<ScheduleChangeFormData>({
  teacherId: undefined,
  courseId: undefined,
  classGroupId: undefined,
  hours: 0.5,
  reason: '',
})

const rules: FormRules<ScheduleChangeFormData> = {
  teacherId: [
    { required: true, message: '请选择教师', trigger: 'change' },
  ],
  courseId: [
    { required: true, message: '请输入课程 ID', trigger: 'blur' },
  ],
  classGroupId: [
    { required: true, message: '请选择班级', trigger: 'change' },
  ],
  hours: [
    { required: true, message: '请输入调课学时', trigger: 'blur' },
    { type: 'number', min: 0.5, message: '学时至少为 0.5', trigger: 'blur' },
  ],
  reason: [
    { required: true, message: '请输入调课原因', trigger: 'blur' },
    { max: 500, message: '原因长度不能超过 500 个字符', trigger: 'blur' },
  ],
}

const teacherOptions = ref<Teacher[]>([])
const classGroupOptions = ref<ClassGroup[]>([])
const courseOptions = ref<CourseOption[]>([])

async function fetchOptions() {
  try {
    const [teacherRes, optionsRes, courseRes] = await Promise.all([
      getTeacherList({ page: 1, pageSize: 100 }),
      getStudentFilterOptions(),
      getCourseOptions(),
    ])
    if (teacherRes.data.success && teacherRes.data.data) {
      teacherOptions.value = teacherRes.data.data.list ?? []
    }
    if (optionsRes.data.success && optionsRes.data.data) {
      classGroupOptions.value = optionsRes.data.data.classGroups ?? []
    }
    if (courseRes.data.success && courseRes.data.data) {
      courseOptions.value = courseRes.data.data
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function fillForm(data: Partial<ScheduleChangeFormData>) {
  if (data.teacherId !== undefined) formModel.teacherId = data.teacherId
  if (data.courseId !== undefined) formModel.courseId = data.courseId
  if (data.classGroupId !== undefined) formModel.classGroupId = data.classGroupId
  if (data.hours !== undefined) formModel.hours = data.hours
  if (data.reason !== undefined) formModel.reason = data.reason
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): ScheduleChangeFormData {
  return { ...formModel }
}

function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({ validate, getFormData, resetFields, fillForm })

watch(
  () => props.initialData,
  (data) => {
    if (data && Object.keys(data).length > 0) {
      fillForm(data)
    }
  },
  { immediate: true },
)

onMounted(() => {
  fetchOptions()
})
</script>