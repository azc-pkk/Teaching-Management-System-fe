<template>
  <div class="p-6">
    <!-- 筛选栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="filters" inline>
        <el-form-item label="姓名 / 学号">
          <el-input
            v-model="filters.keyword"
            placeholder="请输入姓名或学号"
            clearable
            class="w-50"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="院系">
          <el-select
            v-model="filters.departmentId"
            placeholder="全部院系"
            clearable
            class="w-40!"
            @change="handleDepartmentChange"
          >
            <el-option
              v-for="d in departmentOptions"
              :key="d.id"
              :label="d.name"
              :value="d.id ?? 0"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select
            v-model="filters.majorId"
            placeholder="全部专业"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="m in filteredMajorOptions"
              :key="m.id"
              :label="m.name"
              :value="m.id ?? 0"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="filters.grade"
            placeholder="全部年级"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="g in gradeOptions"
              :key="g"
              :label="`${g} 级`"
              :value="g"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="班级">
          <el-select
            v-model="filters.classGroupId"
            placeholder="全部班级"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="c in classGroupOptions"
              :key="c.id"
              :label="c.name"
              :value="c.id ?? 0"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学籍状态">
          <el-select
            v-model="filters.status"
            placeholder="全部状态"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="s in statusOptions"
              :key="s"
              :label="statusLabel[s]"
              :value="s"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="账号激活">
          <el-select
            v-model="filters.activated"
            placeholder="全部"
            clearable
            class="w-32!"
          >
            <el-option label="已激活" :value="true" />
            <el-option label="未激活" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="账号启用">
          <el-select
            v-model="filters.enabled"
            placeholder="全部"
            clearable
            class="w-32!"
          >
            <el-option label="已启用" :value="true" />
            <el-option label="已禁用" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon class="mr-1"><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon class="mr-1"><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">学生列表</span>
          <el-button type="primary" plain size="small" @click="handleAdd">
            <el-icon class="mr-1"><Plus /></el-icon>
            新增学生
          </el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        border
        stripe
        class="w-full"
      >
        <el-table-column prop="name" label="姓名" min-width="100" fixed="left" />
        <el-table-column prop="studentNo" label="学号" min-width="140" />
        <el-table-column prop="departmentName" label="院系" min-width="120" />
        <el-table-column prop="majorName" label="专业" min-width="120" />
        <el-table-column prop="grade" label="年级" min-width="90">
          <template #default="{ row }">
            {{ row.grade }} 级
          </template>
        </el-table-column>
        <el-table-column prop="classGroupName" label="班级" min-width="150" />
        <el-table-column prop="status" label="学籍状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status as StudentStatus]" size="small">
              {{ statusLabel[row.status as StudentStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="activated" label="账号激活" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.activated ? 'success' : 'info'" size="small">
              {{ row.activated ? '已激活' : '未激活' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="账号状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'danger'" size="small">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="140" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row as Student)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as Student)">
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-between mt-4">
        <span class="text-sm text-gray-500">
          共 {{ pagination.total }} 条
        </span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          background
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getStudentList as getListApi,
  getStudentFilterOptions as getOptionsApi,
  deleteStudent as deleteApi,
  type Student,
  type StudentStatus,
  type ClassGroup,
  type Department,
  type Major,
} from '@/api/student'
import checkResponse from '@/utils/checkResponse'
import { useRouter } from 'vue-router'

const statusLabel: Record<StudentStatus, string> = {
  ENROLLED: '在读',
  GRADUATED: '已毕业',
  SUSPENDED: '休学',
  WITHDRAWN: '退学',
}

const statusTagType: Record<StudentStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  ENROLLED: 'success',
  GRADUATED: 'info',
  SUSPENDED: 'warning',
  WITHDRAWN: 'danger',
}

const router = useRouter()

const loading = ref(false)
const tableData = ref<Student[]>([])

const filters = reactive({
  keyword: '',
  departmentId: undefined as number | undefined,
  majorId: undefined as number | undefined,
  grade: undefined as number | undefined,
  classGroupId: undefined as number | undefined,
  status: undefined as StudentStatus | undefined,
  activated: undefined as boolean | undefined,
  enabled: undefined as boolean | undefined,
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const departmentOptions = ref<Department[]>([])
const majorOptions = ref<Major[]>([])
const classGroupOptions = ref<ClassGroup[]>([])
const gradeOptions = ref<number[]>([])
const statusOptions = ref<StudentStatus[]>(['ENROLLED', 'GRADUATED', 'SUSPENDED', 'WITHDRAWN'])

const filteredMajorOptions = computed(() => {
  if (!filters.departmentId) return majorOptions.value
  return majorOptions.value.filter((m) => m.departmentId === filters.departmentId)
})

function handleDepartmentChange() {
  filters.majorId = undefined
}

async function fetchStudents() {
  loading.value = true
  try {
    const response = await getListApi({
      keyword: filters.keyword || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      departmentId: filters.departmentId,
      majorId: filters.majorId,
      grade: filters.grade,
      classGroupId: filters.classGroupId,
      status: filters.status,
      activated: filters.activated,
      enabled: filters.enabled,
    })
    const data = checkResponse(response.data)
    tableData.value = data.list ?? []
    pagination.total = data.total ?? 0
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取学生列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchFilterOptions() {
  try {
    const response = await getOptionsApi()
    const options = checkResponse(response.data)
    departmentOptions.value = options.departments ?? []
    majorOptions.value = options.majors ?? []
    classGroupOptions.value = options.classGroups ?? []
    gradeOptions.value = options.grades ?? []
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function handleSearch() {
  pagination.page = 1
  fetchStudents()
}

function handleReset() {
  filters.keyword = ''
  filters.departmentId = undefined
  filters.majorId = undefined
  filters.grade = undefined
  filters.classGroupId = undefined
  filters.status = undefined
  filters.activated = undefined
  filters.enabled = undefined
  pagination.page = 1
  fetchStudents()
}

function handlePageChange() {
  fetchStudents()
}

function handleSizeChange() {
  pagination.page = 1
  fetchStudents()
}

function handleAdd() {
  router.push({ name: 'student-management-add-student' })
}

function handleEdit(row: Student) {
  router.push({
    name: 'student-management-modify-student',
    params: { id: row.id },
  })
}

function handleDelete(row: Student) {
  ElMessageBox.confirm(
    `确定要删除学生「${row.name}」吗？`,
    '删除确认',
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await deleteApi(row.id)
        ElMessage.success('删除成功')
        fetchStudents()
      } catch (err) {
        ElMessage.error(err instanceof Error ? err.message : '删除失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchFilterOptions()
  fetchStudents()
})
</script>