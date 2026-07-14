import type { AppRouteRecordRaw } from '../types'
import { OfficeBuilding, Grid, Plus } from '@element-plus/icons-vue'

const CLASSROOM_MANAGEMENT_ROUTE: AppRouteRecordRaw = {
    path: '/classroom-management',
    name: 'classroom-management',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Classroom Management',
        menuTitle: '教室管理',
        icon: OfficeBuilding,
        roles: ['admin'],
        order: 30,
    },
    children: [
        {
            path: '',
            name: 'classroom-management-classroom-list',
            component: () => import('@/views/classroom-management/classroom-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Classroom List',
                menuTitle: '教室列表',
                icon: Grid,
                hideInMenu: false,
                roles: ['admin'],
                order: 0,
            },
        },
        {
            path: 'add-classroom',
            name: 'classroom-management-add-classroom',
            component: () => import('@/views/classroom-management/add-classroom.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Classroom',
                menuTitle: '新增教室',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
                order: 10,
            },
        },
        {
            path: 'modify-classroom/:id',
            name: 'classroom-management-modify-classroom',
            component: () => import('@/views/classroom-management/modify-classroom.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Classroom',
                hideInMenu: true,
                roles: ['admin'],
                order: 99,
            },
        },
    ]
}

export default CLASSROOM_MANAGEMENT_ROUTE