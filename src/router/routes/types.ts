import type { Component } from 'vue';
import type { NavigationGuard, RouteMeta, RouteRecordRedirectOption } from 'vue-router';

export type AsyncComponent<T = any> =
    | ReturnType<typeof import('vue').defineComponent>
    | (() => Promise<T>);

export interface AppRouteMeta extends RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    menuTitle?: string;
    icon?: Component;
    hideInMenu?: boolean;
    roles?: string[];
}

export interface AppRouteRecordRaw {
    path: string;
    name?: string | symbol;
    meta?: AppRouteMeta;
    redirect?: RouteRecordRedirectOption;
    component?: AsyncComponent | string;
    children?: AppRouteRecordRaw[];
    alias?: string | string[];
    props?: Record<string, any>;
    beforeEnter?: NavigationGuard | NavigationGuard[];
}