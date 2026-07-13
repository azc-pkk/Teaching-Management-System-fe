import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import useAuthStore from '@/store/modules/auth'

export default function usePermission() {
    const authStore = useAuthStore();
    return {
        hasPermission(route: RouteLocationNormalized | RouteRecordRaw) {
            return (
                !route.meta?.requiresAuth ||
                !route.meta?.roles ||
                route.meta?.roles?.includes('*') ||
                route.meta?.roles?.includes(authStore.role)
            );
        }
    }
}