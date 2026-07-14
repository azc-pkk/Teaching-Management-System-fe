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
        placeholder="请输入教师姓名"
        clearable
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="工号" prop="employeeNo">
      <el-input
        v-model="formModel.employeeNo"
        placeholder="请输入工号"
        clearable
        :disabled="disabledFields.includes('employeeNo')"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="院系" prop="departmentId">
      <el-select
        v-model="formModel.departmentId"
        placeholder="请选择院系"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="dept in departmentOptions"
          :key="dept.id"
          :label="dept.name"
          :value="dept.id ?? 0"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="教师类型" prop="teacherType">
      <el-select
        v-model="formModel.teacherType"
        placeholder="请选择教师类型"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="t in teacherTypeOptions"
          :key="t"
          :label="t"
          :value="t"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="职称" prop="title">
      <el-select
        v-model="formModel.title"
        placeholder="请选择职称"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="t in titleOptions"
          :key="t"
          :label="t"
          :value="t"
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
  getTeacherFilterOptions as getOptionsApi,
  type Department,
} from '@/api/teacher'
import checkResponse from '@/utils/checkResponse'

export interface TeacherFormData {
  name: string
  employeeNo: string
  departmentId: number | undefined
  teacherType: string | undefined
  title: string | undefined
  phone: string
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<TeacherFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<TeacherFormData>({
  name: '',
  employeeNo: '',
  departmentId: undefined,
  teacherType: undefined,
  title: undefined,
  phone: '',
})

const rules: FormRules<TeacherFormData> = {
  name: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' },
    { max: 32, message: '姓名长度不能超过 32 个字符', trigger: 'blur' },
  ],
  employeeNo: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-]+$/, message: '工号只能包含字母、数字和连字符', trigger: 'blur' },
  ],
  departmentId: [
    { required: true, message: '请选择院系', trigger: 'change' },
  ],
  teacherType: [
    { required: true, message: '请选择教师类型', trigger: 'change' },
  ],
  title: [
    { required: true, message: '请选择职称', trigger: 'change' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$|^$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
}

const departmentOptions = ref<Department[]>([])
const teacherTypeOptions = ref<string[]>([])
const titleOptions = ref<string[]>([])

async function fetchOptions() {
  try {
    const response = await getOptionsApi()
    const options = checkResponse(response.data)
    departmentOptions.value = options.departments ?? []
    teacherTypeOptions.value = options.teacherTypes ?? []
    titleOptions.value = options.titles ?? []
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function fillForm(data: Partial<TeacherFormData>) {
  if (data.name !== undefined) formModel.name = data.name
  if (data.employeeNo !== undefined) formModel.employeeNo = data.employeeNo
  if (data.departmentId !== undefined) formModel.departmentId = data.departmentId
  if (data.teacherType !== undefined) formModel.teacherType = data.teacherType
  if (data.title !== undefined) formModel.title = data.title
  if (data.phone !== undefined) formModel.phone = data.phone
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): TeacherFormData {
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