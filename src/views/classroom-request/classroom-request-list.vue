<template>
  <div class="p-6">
    <!-- 筛选栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="filters" inline>
        <el-form-item label="关键字">
          <el-input
            v-model="filters.keyword"
            placeholder="用途、教室号或申请人"
            clearable
            class="w-50"
            @keyup.enter="handleSearch"
          />
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
          <span class="font-medium">教室借用申请</span>
          <el-button type="primary" plain size="small" @click="handleAdd">
            <el-icon class="mr-1"><Plus /></el-icon>
            新建申请
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
        <el-table-column prop="applicantName" label="申请人" min-width="100" fixed="left" />
        <el-table-column prop="classroomRoomNo" label="教室" min-width="100" />
        <el-table-column prop="classroomCampus" label="校区" min-width="100" />
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
        <el-table-column prop="purpose" label="用途" min-width="180" show-overflow-tooltip />
        <el-table-column prop="participantCount" label="参与人数" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status as WorkflowStatus]" size="small">
              {{ statusLabel[row.status as WorkflowStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row as ClassroomRequest)">
              编辑
            </el-button>
            <el-button
              v-if="canApprove(row.status as WorkflowStatus)"
              link type="success" size="small"
              @click="handleApprove(row as ClassroomRequest)"
            >
              审批
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as ClassroomRequest)">
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

    <!-- 审批弹窗 -->
    <el-dialog v-model="approveDialogVisible" title="审批教室借用申请" width="480px">
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approveForm.status">
            <el-radio value="APPROVED">通过</el-radio>
            <el-radio value="REJECTED">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入审批意见（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="approving" @click="handleApproveSubmit">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getClassroomRequestList as getListApi,
  deleteClassroomRequest as deleteApi,
  patchClassroomRequestStatus as patchStatusApi,
  type ClassroomRequest,
} from '@/api/classroomRequest'
import type { WorkflowStatus } from '@/api/types'
import checkResponse from '@/utils/checkResponse'
import { useRouter } from 'vue-router'

const statusLabel: Record<WorkflowStatus, string> = {
  DRAFT: '草稿',
  PENDING: '待审批',
  APPROVED: '已通过',
  REJECTED: '已驳回',
  CANCELLED: '已取消',
  COMPLETED: '已完成',
}

const statusTagType: Record<WorkflowStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  DRAFT: 'info',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'info',
  COMPLETED: 'success',
}

const statusOptions: WorkflowStatus[] = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED']

function canApprove(status: WorkflowStatus): boolean {
  return status === 'PENDING'
}

function formatDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { hour12: false })
}

const router = useRouter()

const loading = ref(false)
const tableData = ref<ClassroomRequest[]>([])

const filters = reactive({
  keyword: '',
  status: undefined as WorkflowStatus | undefined,
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
      status: filters.status,
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
  filters.status = undefined
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
  router.push({ name: 'classroom-request-add' })
}

function handleEdit(row: ClassroomRequest) {
  router.push({
    name: 'classroom-request-modify',
    params: { id: row.id },
  })
}

function handleDelete(row: ClassroomRequest) {
  ElMessageBox.confirm(
    `确定要删除该借用申请吗？`,
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

// ===== 审批 =====
const approveDialogVisible = ref(false)
const approving = ref(false)
const approveTargetId = ref<number>(0)
const approveForm = reactive({
  status: 'APPROVED' as WorkflowStatus,
  comment: '',
})

function handleApprove(row: ClassroomRequest) {
  approveTargetId.value = row.id
  approveForm.status = 'APPROVED'
  approveForm.comment = ''
  approveDialogVisible.value = true
}

async function handleApproveSubmit() {
  approving.value = true
  try {
    await patchStatusApi(approveTargetId.value, {
      status: approveForm.status,
      comment: approveForm.comment || undefined,
    })
    ElMessage.success('审批成功')
    approveDialogVisible.value = false
    fetchList()
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '审批失败')
  } finally {
    approving.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>