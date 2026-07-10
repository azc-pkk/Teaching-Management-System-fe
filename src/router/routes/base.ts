import type { RouteRecordRaw } from 'vue-router'

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/not-found/index.vue'),
}