<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="100px"
    label-position="right"
    size="default"
  >
    <el-form-item label="学期" prop="semesterId">
      <el-input
        v-model.number="formModel.semesterId"
        placeholder="请输入学期 ID（如 202601）"
        clearable
        type="number"
        :disabled="disabledFields.includes('semesterId')"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="课程" prop="courseId">
      <el-input
        v-model.number="formModel.courseId"
        placeholder="请输入课程 ID"
        clearable
        type="number"
        class="w-72!"
      />
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

    <el-form-item label="教室" prop="classroomId">
      <el-select
        v-model="formModel.classroomId"
        placeholder="请选择教室"
        filterable
        clearable
        class="w-72!"
      >
        <el-option
          v-for="c in classroomOptions"
          :key="c.id"
          :label="`${c.roomNo}（${c.campus ?? ''} ${c.building ?? ''}）`"
          :value="c.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
        v-model="formModel.startTime"
        type="datetime"
        placeholder="请选择考试开始时间"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DDTHH:mm:ss[Z]"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
        v-model="formModel.endTime"
        type="datetime"
        placeholder="请选择考试结束时间"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DDTHH:mm:ss[Z]"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="监考教师" prop="invigilatorId">
      <el-select
        v-model="formModel.invigilatorId"
        placeholder="请选择监考教师（选填）"
        filterable
        clearable
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
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getClassroomList } from '@/api/classroom'
import type { Classroom } from '@/api/classroom'
import { getTeacherList } from '@/api/teacher'
import type { Teacher } from '@/api/teacher'
import { getStudentFilterOptions } from '@/api/student'
import type { ClassGroup } from '@/api/student'

export interface ExamFormData {
    semesterId: number | undefined
    courseId: number | undefined
    classGroupId: number | undefined
    classroomId: number | undefined
    startTime: string
    endTime: string
    invigilatorId: number | undefined
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<ExamFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<ExamFormData>({
  semesterId: undefined,
  courseId: undefined,
  classGroupId: undefined,
  classroomId: undefined,
  startTime: '',
  endTime: '',
  invigilatorId: undefined,
})

const rules: FormRules<ExamFormData> = {
  semesterId: [
    { required: true, message: '请输入学期 ID', trigger: 'blur' },
  ],
  courseId: [
    { required: true, message: '请输入课程 ID', trigger: 'blur' },
  ],
  classGroupId: [
    { required: true, message: '请选择班级', trigger: 'change' },
  ],
  classroomId: [
    { required: true, message: '请选择教室', trigger: 'change' },
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
  ],
}

const classroomOptions = ref<Classroom[]>([])
const teacherOptions = ref<Teacher[]>([])
const classGroupOptions = ref<ClassGroup[]>([])

async function fetchOptions() {
  try {
    const [classroomRes, teacherRes, optionsRes] = await Promise.all([
      getClassroomList({ page: 1, pageSize: 100 }),
      getTeacherList({ page: 1, pageSize: 100 }),
      getStudentFilterOptions(),
    ])
    if (classroomRes.data.success && classroomRes.data.data) {
      classroomOptions.value = classroomRes.data.data.list ?? []
    }
    if (teacherRes.data.success && teacherRes.data.data) {
      teacherOptions.value = teacherRes.data.data.list ?? []
    }
    if (optionsRes.data.success && optionsRes.data.data) {
      classGroupOptions.value = optionsRes.data.data.classGroups ?? []
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function fillForm(data: Partial<ExamFormData>) {
  if (data.semesterId !== undefined) formModel.semesterId = data.semesterId
  if (data.courseId !== undefined) formModel.courseId = data.courseId
  if (data.classGroupId !== undefined) formModel.classGroupId = data.classGroupId
  if (data.classroomId !== undefined) formModel.classroomId = data.classroomId
  if (data.startTime !== undefined) formModel.startTime = data.startTime
  if (data.endTime !== undefined) formModel.endTime = data.endTime
  if (data.invigilatorId !== undefined) formModel.invigilatorId = data.invigilatorId
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): ExamFormData {
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