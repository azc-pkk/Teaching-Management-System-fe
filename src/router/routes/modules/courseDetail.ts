import type { AppRouteRecordRaw } from '../types'
import { Reading } from '@element-plus/icons-vue'

const COURSE_DETAIL_ROUTE: AppRouteRecordRaw = {
    path: '/course-detail',
    name: 'course-detail',
    component: () => import('@/layout/default-layout.vue'),
    meta: {
        requiresAuth: true,
        title: 'Course Detail',
        menuTitle: '课程详情',
        icon: Reading,
        roles: ['admin', 'student'],
        order: 70,
    },
    children: [
        {
            path: '',
            name: 'course-detail-page',
            component: () => import('@/views/course-detail/course-detail.vue'),
            meta: {
                requiresAuth: true,
                title: 'Course Detail Page',
                menuTitle: '课程详情查询',
                icon: Reading,
                hideInMenu: false,
                roles: ['admin', 'student'],
                order: 0,
            },
        },
    ]
}

export default COURSE_DETAIL_ROUTE