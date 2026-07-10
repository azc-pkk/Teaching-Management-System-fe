import {createRouter, createWebHistory} from 'vue-router'

import {appRoutes} from './routes'
import { NOT_FOUND_ROUTE } from './routes/base'

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
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: () => import('@/views/register/index.vue'),
    //     meta: {
    //         requiresAuth: false,
    //     }
    // },
    ...appRoutes,
    NOT_FOUND_ROUTE,
  ],
})

export default router