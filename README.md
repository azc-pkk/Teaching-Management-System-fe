# 教学过程管理系统前端

本仓库是教学过程管理系统的独立前端仓库，使用 `Next.js + React + TypeScript + Tailwind CSS`。后端代码位于 [Teaching-Management-System-be](https://github.com/azc-pkk/Teaching-Management-System-be)，前后端通过 Apifox 中约定的 REST API 协作。

## 本地启动

环境要求：Node.js 20 或更高版本，pnpm 10 或更高版本。

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

前端默认运行在 `http://localhost:3000`。本地环境默认请求 `http://localhost:3001/api`，可在 `.env.local` 中修改 `NEXT_PUBLIC_API_BASE_URL`。

## 目录说明

```text
src/
  app/                         页面路由、布局和全局样式
  components/
    layout/                    导航、侧边栏等布局组件
    ui/                        通用基础组件
  features/
    auth/                      登录与权限
    base-data/                 基础数据页面与组件
    classroom-requests/        教室申请
    schedule-changes/          调课审批
    exams/                     考务管理
    textbooks/                 教材管理
    graduation/                毕业相关
    teaching-logs/             教学日志
  lib/api/                     API 请求客户端
  types/                       前端类型和生成的接口类型
```

业务页面、表单、查询 hooks 和模块私有类型放在对应 `features` 目录；只有跨模块复用的组件才放到 `components`。

## Apifox 协作

1. 开发页面前先查看 Apifox 接口文档和响应示例。
2. 后端接口未完成时，使用 Apifox Mock 环境开发。
3. 联调时只通过 `NEXT_PUBLIC_API_BASE_URL` 切换环境，不在组件里写死地址。
4. 接口字段以 Apifox 文档为准，公共类型后续从 OpenAPI 文档生成到 `src/types/generated`。
5. 发现字段或状态码不一致时，先与后端确认并更新 Apifox。

## 提交前检查

```bash
pnpm typecheck
pnpm lint
pnpm build
```

每个功能使用独立分支开发，分支名建议为 `feature/模块-功能`。不要提交 `.env.local`、`.next` 或 `node_modules`。

## 当前状态

- 已搭建 App Router、基础工作台、登录页、模块目录和统一 API 客户端。
- 下一步由前端工程师接入登录接口，完善角色菜单和基础数据页面。
