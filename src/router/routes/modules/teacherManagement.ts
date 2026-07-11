import type { AppRouteRecordRaw } from '../types'
import { UserFilled, List } from '@element-plus/icons-vue'

const TEACHER_MANAGEMENT_ROUTE: AppRouteRecordRaw = {
    path: '/teacher-management',
    name: 'teacher-management',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Teacher Management',
        menuTitle: '教师管理',
        icon: UserFilled,
        roles: ['admin'],
    },
    children: [
        {
            path: '',
            name: 'teacher-management-teacher-list',
            component: () => import('@/views/teacher-management/teacher-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Teacher List',
                menuTitle: '教师列表',
                icon: List,
                hideInMenu: false,
                roles: ['admin'],
            },
        },
    ]
}

export default TEACHER_MANAGEMENT_ROUTE