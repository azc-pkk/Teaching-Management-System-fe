import type { Router } from 'vue-router';
import usePermission from '@/hooks/permission';

export default function setupPermissionGuard(router: Router) {
    router.beforeEach((to, _from, next) => {
        const Permission = usePermission();
        const permissionAllow = Permission.hasPermission(to);
        if (permissionAllow) next();
        else {
            next({ name: 'Forbidden' })
        }
    });
}