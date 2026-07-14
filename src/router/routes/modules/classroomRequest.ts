import type { AppRouteRecordRaw } from '../types'
import { Tickets, Grid, Plus } from '@element-plus/icons-vue'

const CLASSROOM_REQUEST_ROUTE: AppRouteRecordRaw = {
    path: '/classroom-request',
    name: 'classroom-request',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Classroom Request',
        menuTitle: '教室借用',
        icon: Tickets,
        roles: ['admin'],
        order: 40,
    },
    children: [
        {
            path: '',
            name: 'classroom-request-list',
            component: () => import('@/views/classroom-request/classroom-request-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Classroom Request List',
                menuTitle: '借用申请列表',
                icon: Grid,
                hideInMenu: false,
                roles: ['admin'],
                order: 0,
            },
        },
        {
            path: 'add',
            name: 'classroom-request-add',
            component: () => import('@/views/classroom-request/add-classroom-request.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Classroom Request',
                menuTitle: '新建申请',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
                order: 10,
            },
        },
        {
            path: 'modify/:id',
            name: 'classroom-request-modify',
            component: () => import('@/views/classroom-request/modify-classroom-request.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Classroom Request',
                hideInMenu: true,
                roles: ['admin'],
                order: 99,
            },
        },
    ]
}

export default CLASSROOM_REQUEST_ROUTE