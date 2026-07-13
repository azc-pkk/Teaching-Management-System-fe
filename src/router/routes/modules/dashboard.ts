import type { AppRouteRecordRaw } from '../types'
import { HomeFilled } from '@element-plus/icons-vue'

const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue')

const DASHBOARD_ROUTE: AppRouteRecordRaw = {
    path: '/dashboard',
    name: 'dashboard',
    component: DEFAULT_LAYOUT,
    meta: {
        requiresAuth: true,
        title: 'Dashboard',
        menuTitle: '首页',
        icon: HomeFilled,
        roles: ['*'],
        order: 0,
    },
    children: [
        {
            path: '',
            name: 'dashboard-home',
            component: () => import('@/views/dashboard/index.vue'),
            meta: {
                requiresAuth: true,
                title: 'Dashboard Home',
                hideInMenu: true,
                roles: ['*'],
                order: 0,
            },
        },
    ],
}

export default DASHBOARD_ROUTE