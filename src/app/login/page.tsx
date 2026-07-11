"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api/client";

type LoginResult = {
  accessToken: string;
  user: {
    id: number;
    username: string;
    realName: string;
    role: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await apiRequest<LoginResult>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      window.localStorage.setItem("accessToken", result.accessToken);
      window.localStorage.setItem("currentUser", JSON.stringify(result.user));
      router.push("/");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-sm rounded-md border border-border bg-panel p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">教学过程管理系统</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">账号登录</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            用户名
            <input
              className="mt-2 h-10 w-full rounded-md border border-border px-3 outline-none focus:border-primary"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            密码
            <input
              className="mt-2 h-10 w-full rounded-md border border-border px-3 outline-none focus:border-primary"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <button
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-medium text-white hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            <LogIn aria-hidden="true" size={18} />
            {isSubmitting ? "登录中" : "登录"}
          </button>
        </form>
      </section>
    </main>
  );
}
