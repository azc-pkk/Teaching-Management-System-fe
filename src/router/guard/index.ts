import type { Router } from 'vue-router';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permisson';

export default function createRouterGuard(router: Router) {
    setupUserLoginInfoGuard(router);
    setupPermissionGuard(router)
}