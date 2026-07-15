import type { RouteRecordRaw } from 'vue-router'

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/not-found/index.vue'),
}

export const FORBIDDEN_ROUTE: RouteRecordRaw = {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/forbidden/index.vue'),
    meta: {
        requiresAuth: false,
    },
}