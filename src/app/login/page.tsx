import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-sm rounded-md border border-border bg-panel p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">教学过程管理系统</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">账号登录</h1>
        </div>
        <form className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            用户名
            <input className="mt-2 h-10 w-full rounded-md border border-border px-3 outline-none focus:border-primary" name="username" autoComplete="username" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            密码
            <input className="mt-2 h-10 w-full rounded-md border border-border px-3 outline-none focus:border-primary" name="password" type="password" autoComplete="current-password" />
          </label>
          <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-medium text-white hover:bg-primary-strong" type="submit">
            <LogIn aria-hidden="true" size={18} />
            登录
          </button>
        </form>
      </section>
    </main>
  );
}
