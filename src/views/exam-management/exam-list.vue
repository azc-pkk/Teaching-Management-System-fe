<template>
  <div class="p-6">
    <!-- 筛选栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="filters" inline>
        <el-form-item label="关键字">
          <el-input
            v-model="filters.keyword"
            placeholder="课程、班级、教室或监考教师"
            clearable
            class="w-50"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="开始时间从">
          <el-date-picker
            v-model="filters.startTimeFrom"
            type="datetime"
            placeholder="选择起始时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
            class="w-40!"
          />
        </el-form-item>

        <el-form-item label="至">
          <el-date-picker
            v-model="filters.startTimeTo"
            type="datetime"
            placeholder="选择截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
            class="w-40!"
          />
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
          <span class="font-medium">考试安排列表</span>
          <el-button type="primary" plain size="small" @click="handleAdd">
            <el-icon class="mr-1"><Plus /></el-icon>
            新建考试安排
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
        <el-table-column prop="courseName" label="课程" min-width="150" fixed="left" />
        <el-table-column prop="courseCode" label="课程代码" min-width="120" />
        <el-table-column prop="classGroupName" label="班级" min-width="150" />
        <el-table-column prop="classroomRoomNo" label="教室" min-width="100" />
        <el-table-column prop="startTime" label="开始时间" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="invigilatorName" label="监考教师" min-width="120">
          <template #default="{ row }">
            {{ row.invigilatorName ?? '—' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row as Exam)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as Exam)">
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
  getExamList as getListApi,
  deleteExam as deleteApi,
  type Exam,
} from '@/api/exam'
import checkResponse from '@/utils/checkResponse'
import { useRouter } from 'vue-router'

function formatDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { hour12: false })
}

const router = useRouter()

const loading = ref(false)
const tableData = ref<Exam[]>([])

const filters = reactive({
  keyword: '',
  startTimeFrom: '',
  startTimeTo: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

async function fetchList() {
  loading.value = true
  try {
    const response = await getListApi({
      keyword: filters.keyword || undefined,
      startTimeFrom: filters.startTimeFrom || undefined,
      startTimeTo: filters.startTimeTo || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    const data = checkResponse(response.data)
    tableData.value = data.list ?? []
    pagination.total = data.total ?? 0
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchList()
}

function handleReset() {
  filters.keyword = ''
  filters.startTimeFrom = ''
  filters.startTimeTo = ''
  pagination.page = 1
  fetchList()
}

function handlePageChange() {
  fetchList()
}

function handleSizeChange() {
  pagination.page = 1
  fetchList()
}

function handleAdd() {
  router.push({ name: 'exam-management-add' })
}

function handleEdit(row: Exam) {
  router.push({
    name: 'exam-management-modify',
    params: { id: row.id },
  })
}

function handleDelete(row: Exam) {
  ElMessageBox.confirm(
    `确定要删除考试「${row.courseName}」的安排吗？`,
    '删除确认',
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await deleteApi(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (err) {
        ElMessage.error(err instanceof Error ? err.message : '删除失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchList()
})
</script>