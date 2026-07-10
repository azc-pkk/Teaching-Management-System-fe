import type { RouteRecordNormalized } from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', { eager: true });

function formatModules(_module: any, result: RouteRecordNormalized[]) {
    Object.keys(_module).forEach((key) => {
        const defaultModule = _module[key].default;
        if (!defaultModule) return;
        const moduleList = Array.isArray(defaultModule)
            ? defaultModule
            : [defaultModule];
        result.push(...moduleList);
    });
    return result;
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);