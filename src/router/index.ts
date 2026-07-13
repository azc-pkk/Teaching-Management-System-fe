import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { appRoutes } from './routes'
import { NOT_FOUND_ROUTE } from './routes/base'
import createRouterGuard from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    ...appRoutes as RouteRecordRaw[],
    NOT_FOUND_ROUTE,
  ] as RouteRecordRaw[],
})

createRouterGuard(router)

export default router