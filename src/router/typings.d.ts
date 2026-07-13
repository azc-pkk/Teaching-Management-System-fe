import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth: boolean;
        title?: string;
        menuTitle?: string;
        icon?: any;
        hideInMenu?: boolean;
        roles?: string[];
    }
}