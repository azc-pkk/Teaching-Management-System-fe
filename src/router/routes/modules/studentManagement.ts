import type { AppRouteRecordRaw } from '../types'
import { Reading, List, Plus } from '@element-plus/icons-vue'

const STUDENT_MANAGEMENT_ROUTE: AppRouteRecordRaw = {
    path: '/student-management',
    name: 'student-management',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Student Management',
        menuTitle: '学生管理',
        icon: Reading,
        roles: ['admin'],
    },
    children: [
        {
            path: '',
            name: 'student-management-student-list',
            component: () => import('@/views/student-management/student-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Student List',
                menuTitle: '学生列表',
                icon: List,
                hideInMenu: false,
                roles: ['admin'],
            },
        },
        {
            path: 'add-student',
            name: 'student-management-add-student',
            component: () => import('@/views/student-management/add-student.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Student',
                menuTitle: '新增学生',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
            },
        },
        {
            path: 'modify-student/:id',
            name: 'student-management-modify-student',
            component: () => import('@/views/student-management/modify-student.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Student',
                hideInMenu: true,
                roles: ['admin'],
            },
        },
    ]
}

export default STUDENT_MANAGEMENT_ROUTE