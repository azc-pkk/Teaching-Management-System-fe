import type { AppRouteRecordRaw } from '../types'
import { UserFilled, List, Plus } from '@element-plus/icons-vue'

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
        order: 10,
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
                order: 0,
            },
        },
        {
            path: 'add-teacher',
            name: 'teacher-management-add-teacher',
            component: () => import('@/views/teacher-management/add-teacher.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Teacher',
                menuTitle: '添加教师',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
                order: 10,
            },
        },
        {
            path: 'modify-teacher/:id',
            name: 'teacher-management-modify-teacher',
            component: () => import('@/views/teacher-management/modify-teacher.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Teacher',
                hideInMenu: true,
                roles: ['admin'],
                order: 99,
            },
        },
    ]
}

export default TEACHER_MANAGEMENT_ROUTE