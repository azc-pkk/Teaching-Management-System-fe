import type { AppRouteRecordRaw } from '../types'

const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue')

const DASHBOARD_ROUTE: AppRouteRecordRaw = {
    path: '/dashboard',
    name: 'dashboard',
    component: DEFAULT_LAYOUT,
    meta: {
        requiresAuth: true,
        title: 'Dashboard',
        roles: ['*'],
    },
    children: [
        {
            path: '',
            name: 'dashboard-home',
            component: () => import('@/views/dashboard/index.vue'),
            meta: {
                requiresAuth: true,
                title: 'Dashboard Home',
                roles: ['*'],
            },
        },
    ],
}

export default DASHBOARD_ROUTE