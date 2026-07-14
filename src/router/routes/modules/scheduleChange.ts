import type { AppRouteRecordRaw } from '../types'
import { Calendar, Grid, Plus } from '@element-plus/icons-vue'

const SCHEDULE_CHANGE_ROUTE: AppRouteRecordRaw = {
    path: '/schedule-change',
    name: 'schedule-change',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Schedule Change',
        menuTitle: '课表调课',
        icon: Calendar,
        roles: ['admin'],
        order: 50,
    },
    children: [
        {
            path: '',
            name: 'schedule-change-list',
            component: () => import('@/views/schedule-change/schedule-change-list.vue'),
            meta: {
                requiresAuth: true,
                title: 'Schedule Change List',
                menuTitle: '调课申请列表',
                icon: Grid,
                hideInMenu: false,
                roles: ['admin'],
                order: 0,
            },
        },
        {
            path: 'add',
            name: 'schedule-change-add',
            component: () => import('@/views/schedule-change/add-schedule-change.vue'),
            meta: {
                requiresAuth: true,
                title: 'Add Schedule Change',
                menuTitle: '新建调课申请',
                icon: Plus,
                hideInMenu: false,
                roles: ['admin'],
                order: 10,
            },
        },
        {
            path: 'modify/:id',
            name: 'schedule-change-modify',
            component: () => import('@/views/schedule-change/modify-schedule-change.vue'),
            meta: {
                requiresAuth: true,
                title: 'Modify Schedule Change',
                hideInMenu: true,
                roles: ['admin'],
                order: 99,
            },
        },
    ]
}

export default SCHEDULE_CHANGE_ROUTE