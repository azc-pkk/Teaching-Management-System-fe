import type { LocationQueryRaw, Router } from 'vue-router';
import useAuthStore from '@/store/modules/auth';
import NProgress from 'nprogress';

export default function setupUserLoginInfoGuard(router: Router) {
    router.beforeEach((to, _from, next) => {
        NProgress.start();
        const authStore = useAuthStore();
        // next();
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
        NProgress.done();
    });
}