<template>
  <div class="p-6">
    <!-- 筛选栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="filters" inline>
        <el-form-item label="姓名 / 工号">
          <el-input
            v-model="filters.keyword"
            placeholder="请输入姓名或工号"
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
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id ?? 0"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="教师类型">
          <el-select
            v-model="filters.teacherType"
            placeholder="全部类型"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="t in teacherTypeOptions"
              :key="t"
              :label="t"
              :value="t"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="职称">
          <el-select
            v-model="filters.title"
            placeholder="全部职称"
            clearable
            class="w-40!"
          >
            <el-option
              v-for="t in titleOptions"
              :key="t"
              :label="t"
              :value="t"
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
          <span class="font-medium">教师列表</span>
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
        <el-table-column prop="employeeNo" label="工号" min-width="120" />
        <el-table-column prop="departmentName" label="院系" min-width="150" />
        <el-table-column prop="teacherType" label="教师类型" min-width="120" />
        <el-table-column prop="title" label="职称" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="140" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row as Teacher)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as Teacher)">
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
import type { Teacher } from '@/api/teacher'
import {
  Search,
  Refresh,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTeacherList as getListApi, getTeacherFilterOptions as getOptionsApi } from '@/api/teacher'
import type { Department } from '@/api/teacher'
import { useRouter } from 'vue-router'

const router = useRouter();

const loading = ref(false)
const tableData = ref<Teacher[]>([])

const filters = reactive({
  keyword: '',
  departmentId: undefined as number | undefined,
  teacherType: undefined as string | undefined,
  title: undefined as string | undefined,
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const departmentOptions = ref<Department[]>([])
const teacherTypeOptions = ref<string[]>([])
const titleOptions = ref<string[]>([])

async function fetchTeachers() {
  loading.value = true
  try {
    const response = await getListApi({
      keyword: filters.keyword || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
      departmentId: filters.departmentId,
      teacherType: filters.teacherType,
      title: filters.title,
    });

    if (!response.data.success) throw new Error('获取教师列表失败');

    const page = response.data.data;
    tableData.value = page?.list ?? [];
    pagination.total = page?.total ?? 0;

  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '未知错误');
  } finally {
    loading.value = false;
  }
}

async function fetchFilterOptions() {
  const response = await getOptionsApi();
  const options = response.data.data;
  departmentOptions.value = options?.departments ?? [];
  teacherTypeOptions.value = options?.teacherTypes ?? [];
  titleOptions.value = options?.titles ?? [];
}

function handleSearch() {
  pagination.page = 1;
  fetchTeachers();
}

function handleReset() {
  filters.keyword = '';
  filters.departmentId = undefined;
  filters.teacherType = undefined;
  filters.title = undefined;
  pagination.page = 1;
  fetchTeachers();
}

function handlePageChange() {
  fetchTeachers();
}

function handleSizeChange() {
  pagination.page = 1;
  fetchTeachers();
}

function handleEdit(_row: Teacher) {
  router.push({
    name: 'teacher-management-modify-teacher',
    params: {
      id: _row.id,
    }
  })
}

function handleDelete(row: Teacher) {
  ElMessageBox.confirm(
    `确定要删除教师「${row.name}」吗？`,
    '删除确认',
    { type: 'warning' },
  )
    .then(() => {
      // TODO: 调用后端删除接口
      ElMessage.success('删除成功（待实现）')
      fetchTeachers()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchFilterOptions();
  fetchTeachers();
})
</script>