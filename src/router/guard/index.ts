import type { Router } from 'vue-router';
import setupUserLoginInfoGuard from './userLoginInfo';

export default function createRouterGuard(router: Router) {
    setupUserLoginInfoGuard(router);
}