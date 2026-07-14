import type { AppRouteRecordRaw } from '../types'
import { Document, Grid, Plus } from '@element-plus/icons-vue'

const EXAM_MANAGEMENT_ROUTE: AppRouteRecordRaw = {
    path: '/exam-management',
    name: 'exam-management',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Exam Management',
        menuTitle: '考务管理',
        icon: Document,
        roles: ['admin'],
        order: 60,
    },
    children: [
        {
            path: '',
            name: 'exam-management-list',
            component: () => import('@/views/exam-management/exam-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Exam List',
                menuTitle: '考试安排列表',
                icon: Grid,
                hideInMenu: false,
                roles: ['admin'],
                order: 0,
            },
        },
        {
            path: 'add',
            name: 'exam-management-add',
            component: () => import('@/views/exam-management/add-exam.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Exam',
                menuTitle: '新建考试安排',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
                order: 10,
            },
        },
        {
            path: 'modify/:id',
            name: 'exam-management-modify',
            component: () => import('@/views/exam-management/modify-exam.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Exam',
                hideInMenu: true,
                roles: ['admin'],
                order: 99,
            },
        },
    ]
}

export default EXAM_MANAGEMENT_ROUTE