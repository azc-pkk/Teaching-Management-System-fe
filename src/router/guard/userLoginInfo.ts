import type { LocationQueryRaw, Router } from 'vue-router';
import useAuthStore from '@/store/modules/auth';

export default function setupUserLoginInfoGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        const authStore = useAuthStore();
        next();
        if (authStore.isLogin) {
            next();
        } else {
            if (to.name === 'login' || to.name === 'register') {
                next();
            } else {
                next({
                    name: 'login',
                    query: {
                        redirect: to.name,
                        ...to.query,
                    } as LocationQueryRaw,
                });
            }
        }
    });
}