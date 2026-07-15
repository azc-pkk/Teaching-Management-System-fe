<template>
  <div class="p-6">
    <!-- 搜索栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="课程 ID">
          <el-input
            v-model="searchForm.courseId"
            placeholder="请输入课程 ID"
            clearable
            type="number"
            class="w-50"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="学期 ID">
          <el-input
            v-model="searchForm.semesterId"
            placeholder="选填，如 202601"
            clearable
            type="number"
            class="w-40"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon class="mr-1"><Search /></el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 课程详情 -->
    <div v-if="loading" class="flex justify-center py-20">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else-if="courseDetail">
      <!-- 基础信息卡片 -->
      <el-card class="mb-4" shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-indigo-600"><Reading /></el-icon>
            <span class="font-medium">{{ courseDetail.name }}</span>
            <el-tag size="small" type="info">{{ courseDetail.code }}</el-tag>
            <el-tag size="small">{{ courseDetail.credits }} 学分</el-tag>
            <el-tag v-if="courseDetail.courseType" size="small" type="warning">{{ courseDetail.courseType }}</el-tag>
          </div>
        </template>

        <el-descriptions :column="3" border>
          <el-descriptions-item label="课程编号">{{ courseDetail.code }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ courseDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="学分">{{ courseDetail.credits }}</el-descriptions-item>
          <el-descriptions-item label="课程类型">{{ courseDetail.courseType ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="所属院系">{{ courseDetail.department?.name ?? courseDetail.departmentName ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="课程负责人">{{ courseDetail.director?.name ?? courseDetail.directorName ?? '—' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 四类安排 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 考试安排 -->
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-indigo-600"><Document /></el-icon>
              <span class="font-medium">考试安排</span>
              <el-tag size="small" type="info">{{ courseDetail.arrangements.exams.length }}</el-tag>
            </div>
          </template>
          <el-table :data="courseDetail.arrangements.exams" border size="small">
            <el-table-column prop="classGroup.name" label="班级" min-width="120" />
            <el-table-column label="教室" min-width="120">
              <template #default="{ row }">
                {{ row.classroom.roomNo }}{{ row.classroom.campus ? `（${row.classroom.campus}）` : '' }}
              </template>
            </el-table-column>
            <el-table-column label="时间" min-width="160">
              <template #default="{ row }">
                {{ formatDateTime(row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column label="监考教师" min-width="100">
              <template #default="{ row }">
                {{ row.invigilator?.name ?? '—' }}
              </template>
            </el-table-column>
            <template #empty>
              <span class="text-sm text-gray-400">暂无考试安排</span>
            </template>
          </el-table>
        </el-card>

        <!-- 调课记录 -->
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-indigo-600"><Calendar /></el-icon>
              <span class="font-medium">调课记录</span>
              <el-tag size="small" type="info">{{ courseDetail.arrangements.scheduleChanges.length }}</el-tag>
            </div>
          </template>
          <el-table :data="courseDetail.arrangements.scheduleChanges" border size="small">
            <el-table-column label="教师" min-width="100">
              <template #default="{ row }">
                {{ row.teacher?.name ?? '—' }}
              </template>
            </el-table-column>
            <el-table-column label="班级" min-width="120">
              <template #default="{ row }">
                {{ row.classGroup?.name ?? '—' }}
              </template>
            </el-table-column>
            <el-table-column prop="hours" label="学时" min-width="70" />
            <el-table-column prop="reason" label="原因" min-width="150" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="workflowStatusTagType[row.status as WorkflowStatus]" size="small">
                  {{ workflowStatusLabel[row.status as WorkflowStatus] }}
                </el-tag>
              </template>
            </el-table-column>
            <template #empty>
              <span class="text-sm text-gray-400">暂无调课记录</span>
            </template>
          </el-table>
        </el-card>

        <!-- 教材征订 -->
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-indigo-600"><Notebook /></el-icon>
              <span class="font-medium">教材征订</span>
              <el-tag size="small" type="info">{{ courseDetail.arrangements.textbookOrders.length }}</el-tag>
            </div>
          </template>
          <el-table :data="courseDetail.arrangements.textbookOrders" border size="small">
            <el-table-column label="教材名称" min-width="150">
              <template #default="{ row }">
                {{ row.textbook.name }}
              </template>
            </el-table-column>
            <el-table-column label="ISBN" min-width="140">
              <template #default="{ row }">
                {{ row.textbook.isbn }}
              </template>
            </el-table-column>
            <el-table-column label="作者" min-width="100">
              <template #default="{ row }">
                {{ row.textbook.author ?? '—' }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" min-width="70" />
            <el-table-column prop="status" label="状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="textbookStatusTagType[row.status as TextbookOrderStatus]" size="small">
                  {{ textbookStatusLabel[row.status as TextbookOrderStatus] }}
                </el-tag>
              </template>
            </el-table-column>
            <template #empty>
              <span class="text-sm text-gray-400">暂无教材征订</span>
            </template>
          </el-table>
        </el-card>

        <!-- 教学日志 -->
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon class="text-indigo-600"><EditPen /></el-icon>
              <span class="font-medium">教学日志</span>
              <el-tag size="small" type="info">{{ courseDetail.arrangements.teachingLogs.length }}</el-tag>
            </div>
          </template>
          <el-table :data="courseDetail.arrangements.teachingLogs" border size="small">
            <el-table-column label="教师" min-width="100">
              <template #default="{ row }">
                {{ row.teacher?.name ?? '—' }}
              </template>
            </el-table-column>
            <el-table-column label="班级" min-width="120">
              <template #default="{ row }">
                {{ row.classGroup?.name ?? '—' }}
              </template>
            </el-table-column>
            <el-table-column label="日期" min-width="110">
              <template #default="{ row }">
                {{ formatDate(row.lessonDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="教学内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="teachingLogStatusTagType[row.status as TeachingLogStatus]" size="small">
                  {{ teachingLogStatusLabel[row.status as TeachingLogStatus] }}
                </el-tag>
              </template>
            </el-table-column>
            <template #empty>
              <span class="text-sm text-gray-400">暂无教学日志</span>
            </template>
          </el-table>
        </el-card>
      </div>
    </template>

    <!-- 空状态 -->
    <el-card v-else shadow="never">
      <el-empty description="请输入课程 ID 查询详情" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import {
  Search, Loading, Reading, Document, Calendar, Notebook, EditPen,
} from '@element-plus/icons-vue'
import {
  getCourseDetail as getDetailApi,
  type CourseDetail,
  type TextbookOrderStatus,
  type TeachingLogStatus,
} from '@/api/courseDetail'
import type { WorkflowStatus } from '@/api/types'
import checkResponse from '@/utils/checkResponse'

const route = useRoute()

const loading = ref(false)
const courseDetail = ref<CourseDetail | null>(null)

const searchForm = reactive({
  courseId: (route.query.courseId as string) || '',
  semesterId: (route.query.semesterId as string) || '',
})

const workflowStatusLabel: Record<WorkflowStatus, string> = {
  DRAFT: '草稿',
  PENDING: '待审批',
  APPROVED: '已通过',
  REJECTED: '已驳回',
  CANCELLED: '已取消',
  COMPLETED: '已完成',
}

const workflowStatusTagType: Record<WorkflowStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  DRAFT: 'info',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'info',
  COMPLETED: 'success',
}

const textbookStatusLabel: Record<TextbookOrderStatus, string> = {
  PENDING: '待审批',
  APPROVED: '已批准',
  ORDERED: '已下单',
  RECEIVED: '已到货',
  CANCELLED: '已取消',
}

const textbookStatusTagType: Record<TextbookOrderStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  ORDERED: 'info',
  RECEIVED: 'success',
  CANCELLED: 'danger',
}

const teachingLogStatusLabel: Record<TeachingLogStatus, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  APPROVED: '已通过',
  REJECTED: '已驳回',
}

const teachingLogStatusTagType: Record<TeachingLogStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  DRAFT: 'info',
  SUBMITTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
}

function formatDateTime(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('zh-CN', { hour12: false })
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('zh-CN')
}

async function fetchDetail(courseId: number, semesterId?: number) {
  loading.value = true
  try {
    const response = await getDetailApi(courseId, semesterId)
    courseDetail.value = checkResponse(response.data)
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取课程详情失败')
    courseDetail.value = null
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const id = Number(searchForm.courseId)
  if (!id || id < 1) {
    ElMessage.warning('请输入有效的课程 ID')
    return
  }
  fetchDetail(id, searchForm.semesterId ? Number(searchForm.semesterId) : undefined)
}

onMounted(() => {
  if (searchForm.courseId) {
    handleSearch()
  }
})
</script>