<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="100px"
    label-position="right"
    size="default"
  >
    <el-form-item label="教室" prop="classroomId">
      <el-select
        v-model="formModel.classroomId"
        placeholder="请选择教室"
        filterable
        clearable
        :disabled="disabledFields.includes('classroomId')"
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
        placeholder="请选择开始时间"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DDTHH:mm:ss[Z]"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
        v-model="formModel.endTime"
        type="datetime"
        placeholder="请选择结束时间"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DDTHH:mm:ss[Z]"
        class="w-72!"
      />
    </el-form-item>

    <el-form-item label="用途" prop="purpose">
      <el-input
        v-model="formModel.purpose"
        type="textarea"
        :rows="3"
        placeholder="请输入借用用途"
        maxlength="255"
        show-word-limit
        class="w-72!"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getClassroomList } from '@/api/classroom'
import type { Classroom } from '@/api/classroom'

export interface ClassroomRequestFormData {
    classroomId: number | undefined
    startTime: string
    endTime: string
    purpose: string
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<ClassroomRequestFormData>
    disabledFields?: string[]
  }>(),
  {
    initialData: () => ({}),
    disabledFields: () => [],
  },
)

const formRef = shallowRef<FormInstance>()

const formModel = reactive<ClassroomRequestFormData>({
  classroomId: undefined,
  startTime: '',
  endTime: '',
  purpose: '',
})

const rules: FormRules<ClassroomRequestFormData> = {
  classroomId: [
    { required: true, message: '请选择教室', trigger: 'change' },
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
  ],
  purpose: [
    { required: true, message: '请输入借用用途', trigger: 'blur' },
    { max: 255, message: '用途长度不能超过 255 个字符', trigger: 'blur' },
  ],
}

const classroomOptions = ref<Classroom[]>([])

async function fetchClassroomOptions() {
  try {
    const response = await getClassroomList({ page: 1, pageSize: 100 })
    if (response.data.success && response.data.data) {
      classroomOptions.value = response.data.data.list ?? []
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取教室列表失败')
  }
}

function fillForm(data: Partial<ClassroomRequestFormData>) {
  if (data.classroomId !== undefined) formModel.classroomId = data.classroomId
  if (data.startTime !== undefined) formModel.startTime = data.startTime
  if (data.endTime !== undefined) formModel.endTime = data.endTime
  if (data.purpose !== undefined) formModel.purpose = data.purpose
}

async function validate(): Promise<void> {
  if (!formRef.value) throw new Error('表单未挂载')
  await formRef.value.validate()
}

function getFormData(): ClassroomRequestFormData {
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
  fetchClassroomOptions()
})
</script>