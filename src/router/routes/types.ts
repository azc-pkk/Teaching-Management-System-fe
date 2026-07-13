import type { defineComponent } from 'vue';
import type { NavigationGuard, RouteMeta } from 'vue-router';

export type AsyncComponent<T = any> =
    | ReturnType<typeof defineComponent>
    | (() => Promise<T>);

export interface AppRouteRecordRaw {
    path: string;
    name?: string | symbol;
    meta?: RouteMeta;
    redirect?: string;
    component?: AsyncComponent | string;
    children?: AppRouteRecordRaw[];
    alias?: string | string[];
    props?: Record<string, any>;
    beforeEnter?: NavigationGuard | NavigationGuard[];
}