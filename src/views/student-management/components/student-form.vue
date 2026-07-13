<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="100px"
    label-position="right"
    size="default"
  >
    <el-form-item label="姓名" prop="name">
      <el-input
        v-model="formModel.name"
        placeholder="请输入学生姓名"
        clearable
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="学号" prop="studentNo">
      <el-input
        v-model="formModel.studentNo"
        placeholder="请输入学号"
        clearable
        :disabled="disabledFields.includes('studentNo')"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="年级" prop="grade">
      <el-select
        v-model="formModel.grade"
        placeholder="请选择年级"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="g in gradeOptions"
          :key="g"
          :label="`${g} 级`"
          :value="g"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="班级" prop="classGroupId">
      <el-select
        v-model="formModel.classGroupId"
        placeholder="请选择班级"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="c in classGroupOptions"
          :key="c.id"
          :label="c.name"
          :value="c.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-select
        v-model="formModel.status"
        placeholder="请选择状态"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="s in statusOptions"
          :key="s"
          :label="statusLabel[s]"
          :value="s"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="联系电话" prop="phone">
      <el-input
        v-model="formModel.phone"
        placeholder="请输入联系电话（选填）"
        clearable
        class="w-72!"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  getStudentFilterOptions as getOptionsApi,
  type ClassGroup,
  type StudentStatus,
} from '@/api/student'

export interface StudentFormData {
  name: string
  studentNo: string
  grade: number | undefined
  classGroupId: number | undefined
  status: StudentStatus | undefined
  phone: string
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<StudentFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<StudentFormData>({
  name: '',
  studentNo: '',
  grade: undefined,
  classGroupId: undefined,
  status: undefined,
  phone: '',
})

const statusLabel: Record<StudentStatus, string> = {
  Enrolled: '在读',
  Graduated: '已毕业',
  Suspended: '休学',
  Withdrawn: '退学',
}

const rules: FormRules<StudentFormData> = {
  name: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' },
    { max: 32, message: '姓名长度不能超过 32 个字符', trigger: 'blur' },
  ],
  studentNo: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-]+$/, message: '学号只能包含字母、数字和连字符', trigger: 'blur' },
  ],
  grade: [
    { required: true, message: '请选择年级', trigger: 'change' },
  ],
  classGroupId: [
    { required: true, message: '请选择班级', trigger: 'change' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$|^$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
}

const classGroupOptions = ref<ClassGroup[]>([])
const gradeOptions = ref<number[]>([])
const statusOptions = ref<StudentStatus[]>(['Enrolled', 'Graduated', 'Suspended', 'Withdrawn'])

async function fetchOptions() {
  try {
    const response = await getOptionsApi()
    const options = response.data.data
    classGroupOptions.value = options?.classGroups ?? []
    gradeOptions.value = options?.grades ?? []
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function fillForm(data: Partial<StudentFormData>) {
  if (data.name !== undefined) formModel.name = data.name
  if (data.studentNo !== undefined) formModel.studentNo = data.studentNo
  if (data.grade !== undefined) formModel.grade = data.grade
  if (data.classGroupId !== undefined) formModel.classGroupId = data.classGroupId
  if (data.status !== undefined) formModel.status = data.status
  if (data.phone !== undefined) formModel.phone = data.phone
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): StudentFormData {
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