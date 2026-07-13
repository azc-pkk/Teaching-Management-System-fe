<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="100px"
    label-position="right"
    size="default"
  >
    <el-form-item label="教室编号" prop="roomNo">
      <el-input
        v-model="formModel.roomNo"
        placeholder="请输入教室编号"
        clearable
        :disabled="disabledFields.includes('roomNo')"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="容量" prop="capacity">
      <el-input-number
        v-model="formModel.capacity"
        :min="1"
        :max="999"
        controls-position="right"
        class="w-72!"
      />
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

    <el-form-item label="类型" prop="type">
      <el-select
        v-model="formModel.type"
        placeholder="请选择类型"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="t in typeOptions"
          :key="t"
          :label="t"
          :value="t"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="校区" prop="campus">
      <el-select
        v-model="formModel.campus"
        placeholder="请选择校区"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="c in campusOptions"
          :key="c"
          :label="c"
          :value="c"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="楼栋" prop="building">
      <el-select
        v-model="formModel.building"
        placeholder="请选择楼栋"
        clearable
        class="w-72!"
      >
        <el-option
          v-for="b in buildingOptions"
          :key="b"
          :label="b"
          :value="b"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="面积（㎡）" prop="area">
      <el-input-number
        v-model="formModel.area"
        :min="0"
        :precision="2"
        controls-position="right"
        class="w-72!"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  getClassroomFilterOptions as getOptionsApi,
  type ClassroomStatus,
} from '@/api/classroom'

export interface ClassroomFormData {
  roomNo: string
  capacity: number
  status: ClassroomStatus | undefined
  type: string | undefined
  campus: string | undefined
  building: string | undefined
  area: number | undefined
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<ClassroomFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<ClassroomFormData>({
  roomNo: '',
  capacity: 1,
  status: undefined,
  type: undefined,
  campus: undefined,
  building: undefined,
  area: undefined,
})

const statusLabel: Record<ClassroomStatus, string> = {
  AVAILABLE: '可用',
  MAINTENANCE: '维护中',
  OCCUPIED: '占用中',
}

const rules: FormRules<ClassroomFormData> = {
  roomNo: [
    { required: true, message: '请输入教室编号', trigger: 'blur' },
    { max: 32, message: '编号长度不能超过 32 个字符', trigger: 'blur' },
  ],
  capacity: [
    { required: true, message: '请输入容量', trigger: 'blur' },
    { type: 'number', min: 1, message: '容量至少为 1', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
  ],
  campus: [
    { required: true, message: '请选择校区', trigger: 'change' },
  ],
  building: [
    { required: true, message: '请选择楼栋', trigger: 'change' },
  ],
}

const campusOptions = ref<string[]>([])
const buildingOptions = ref<string[]>([])
const typeOptions = ref<string[]>([])
const statusOptions = ref<ClassroomStatus[]>(['AVAILABLE', 'MAINTENANCE', 'OCCUPIED'])

async function fetchOptions() {
  try {
    const response = await getOptionsApi()
    const options = response.data.data
    campusOptions.value = options?.campuses ?? []
    buildingOptions.value = options?.buildings ?? []
    typeOptions.value = options?.types ?? []
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function fillForm(data: Partial<ClassroomFormData>) {
  if (data.roomNo !== undefined) formModel.roomNo = data.roomNo
  if (data.capacity !== undefined) formModel.capacity = data.capacity
  if (data.status !== undefined) formModel.status = data.status
  if (data.type !== undefined) formModel.type = data.type
  if (data.campus !== undefined) formModel.campus = data.campus
  if (data.building !== undefined) formModel.building = data.building
  if (data.area !== undefined) formModel.area = data.area
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): ClassroomFormData {
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