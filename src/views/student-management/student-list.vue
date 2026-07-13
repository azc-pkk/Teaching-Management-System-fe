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
              :value="c.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
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
          <div class="flex gap-2">
            <el-button type="primary" plain size="small" @click="handleImport">
              <el-icon class="mr-1"><Upload /></el-icon>
              批量导入
            </el-button>
            <el-button type="primary" plain size="small" @click="handleAdd">
              <el-icon class="mr-1"><Plus /></el-icon>
              新增学生
            </el-button>
          </div>
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
        <el-table-column prop="studentNo" label="学号" min-width="120" />
        <el-table-column prop="grade" label="年级" min-width="90">
          <template #default="{ row }">
            {{ row.grade }} 级
          </template>
        </el-table-column>
        <el-table-column prop="classGroupName" label="班级" min-width="150" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status as StudentStatus]" size="small">
              {{ statusLabel[row.status as StudentStatus] }}
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

    <!-- 批量导入弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入学生"
      width="480px"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleFileChange"
        drag
        accept=".xlsx,.xls,.csv"
      >
        <el-icon class="text-3xl text-gray-400 mb-2"><UploadFilled /></el-icon>
        <div class="text-sm text-gray-600">
          将文件拖到此处，或<em class="text-indigo-600">点击上传</em>
        </div>
        <template #tip>
          <div class="text-xs text-gray-400 mt-2">
            支持 .xlsx / .xls / .csv 格式，单次上传一个文件
          </div>
        </template>
      </el-upload>

      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="importing"
          :disabled="!pendingFile"
          @click="handleImportSubmit"
        >
          开始导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInstance, UploadRawFile, UploadFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Refresh, Plus, Upload, UploadFilled,
} from '@element-plus/icons-vue'
import {
  getStudentList as getListApi,
  getStudentFilterOptions as getOptionsApi,
  importStudentsFromFile as importApi,
  type Student,
  type StudentStatus,
  type ClassGroup,
} from '@/api/student'
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
  grade: undefined as number | undefined,
  classGroupId: undefined as number | undefined,
  status: undefined as StudentStatus | undefined,
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const classGroupOptions = ref<ClassGroup[]>([])
const gradeOptions = ref<number[]>([])
const statusOptions = ref<StudentStatus[]>(['ENROLLED', 'GRADUATED', 'SUSPENDED', 'WITHDRAWN'])

async function fetchStudents() {
  loading.value = true
  try {
    const response = await getListApi({
      keyword: filters.keyword || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      grade: filters.grade,
      classGroupId: filters.classGroupId,
      status: filters.status,
    })
    const body = response.data
    if (!body.success) throw new Error('获取学生列表失败')
    const page = body.data
    tableData.value = page?.list ?? []
    pagination.total = page?.total ?? 0
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '未知错误')
  } finally {
    loading.value = false
  }
}

async function fetchFilterOptions() {
  try {
    const response = await getOptionsApi()
    const options = response.data.data
    classGroupOptions.value = options?.classGroups ?? []
    gradeOptions.value = options?.grades ?? []
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
  filters.grade = undefined
  filters.classGroupId = undefined
  filters.status = undefined
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
    .then(() => {
      // TODO: 调用后端删除接口
      ElMessage.success('删除成功（待实现）')
      fetchStudents()
    })
    .catch(() => {})
}

// ===== 批量导入 =====
const importDialogVisible = ref(false)
const importing = ref(false)
const pendingFile = ref<File | null>(null)
const uploadRef = shallowRef<UploadInstance>()

function handleImport() {
  pendingFile.value = null
  importDialogVisible.value = true
}

function handleFileChange(file: UploadFile) {
  if (file.raw) {
    pendingFile.value = file.raw as unknown as File
  }
}

function handleExceed(files: File[]) {
  uploadRef.value?.clearFiles()
  const file = files[0] as unknown as UploadRawFile
  uploadRef.value?.handleStart(file)
  pendingFile.value = files[0]
}

async function handleImportSubmit() {
  if (!pendingFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  importing.value = true
  try {
    await importApi(pendingFile.value)
    ElMessage.success('导入成功（待实现）')
    importDialogVisible.value = false
    fetchStudents()
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '导入失败')
  } finally {
    importing.value = false
  }
}

onMounted(() => {
  fetchFilterOptions()
  fetchStudents()
})
</script>