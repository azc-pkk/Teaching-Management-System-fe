<template>
  <div class="p-6">
    <!-- 筛选栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="filters" inline>
        <el-form-item label="编号">
          <el-input
            v-model="filters.keyword"
            placeholder="请输入教室编号"
            clearable
            class="w-50"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="校区">
          <el-select
            v-model="filters.campus"
            placeholder="全部校区"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="c in campusOptions"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="楼栋">
          <el-select
            v-model="filters.building"
            placeholder="全部楼栋"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="b in buildingOptions"
              :key="b"
              :label="b"
              :value="b"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-model="filters.type"
            placeholder="全部类型"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="t in typeOptions"
              :key="t"
              :label="t"
              :value="t"
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
          <span class="font-medium">教室列表</span>
          <el-button type="primary" plain size="small" @click="handleAdd">
            <el-icon class="mr-1"><Plus /></el-icon>
            新增教室
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
        <el-table-column prop="roomNo" label="教室编号" min-width="120" fixed="left" />
        <el-table-column prop="campus" label="校区" min-width="120" />
        <el-table-column prop="building" label="楼栋" min-width="120" />
        <el-table-column prop="type" label="类型" min-width="120" />
        <el-table-column prop="capacity" label="容量" min-width="90" />
        <el-table-column prop="area" label="面积（㎡）" min-width="110" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status as ClassroomStatus]" size="small">
              {{ statusLabel[row.status as ClassroomStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row as Classroom)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as Classroom)">
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
  getClassroomList as getListApi,
  getClassroomFilterOptions as getOptionsApi,
  deleteClassroom as deleteApi,
  type Classroom,
  type ClassroomStatus,
} from '@/api/classroom'
import checkResponse from '@/utils/checkResponse'
import { useRouter } from 'vue-router'

const statusLabel: Record<ClassroomStatus, string> = {
  AVAILABLE: '可用',
  OCCUPIED: '占用中',
  MAINTENANCE: '维护中',
}

const statusTagType: Record<ClassroomStatus, 'success' | 'warning' | 'danger'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'danger',
  MAINTENANCE: 'warning',
}

const router = useRouter()

const loading = ref(false)
const tableData = ref<Classroom[]>([])

const filters = reactive({
  keyword: '',
  campus: undefined as string | undefined,
  building: undefined as string | undefined,
  type: undefined as string | undefined,
  status: undefined as ClassroomStatus | undefined,
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const campusOptions = ref<string[]>([])
const buildingOptions = ref<string[]>([])
const typeOptions = ref<string[]>([])
const statusOptions = ref<ClassroomStatus[]>(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'])

async function fetchClassrooms() {
  loading.value = true
  try {
    const response = await getListApi({
      keyword: filters.keyword || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      campus: filters.campus,
      building: filters.building,
      type: filters.type,
      status: filters.status,
    })
    const data = checkResponse(response.data)
    tableData.value = data.list ?? []
    pagination.total = data.total ?? 0
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取教室列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchFilterOptions() {
  try {
    const response = await getOptionsApi()
    const options = checkResponse(response.data)
    campusOptions.value = options.campuses ?? []
    buildingOptions.value = options.buildings ?? []
    typeOptions.value = options.types ?? []
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取选项数据失败')
  }
}

function handleSearch() {
  pagination.page = 1
  fetchClassrooms()
}

function handleReset() {
  filters.keyword = ''
  filters.campus = undefined
  filters.building = undefined
  filters.type = undefined
  filters.status = undefined
  pagination.page = 1
  fetchClassrooms()
}

function handlePageChange() {
  fetchClassrooms()
}

function handleSizeChange() {
  pagination.page = 1
  fetchClassrooms()
}

function handleAdd() {
  router.push({ name: 'classroom-management-add-classroom' })
}

function handleEdit(row: Classroom) {
  router.push({
    name: 'classroom-management-modify-classroom',
    params: { id: row.id },
  })
}

function handleDelete(row: Classroom) {
  ElMessageBox.confirm(
    `确定要删除教室「${row.roomNo}」吗？`,
    '删除确认',
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await deleteApi(row.id)
        ElMessage.success('删除成功')
        fetchClassrooms()
      } catch (err) {
        ElMessage.error(err instanceof Error ? err.message : '删除失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchFilterOptions()
  fetchClassrooms()
})
</script>