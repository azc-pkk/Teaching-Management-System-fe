import {
  BookOpenText,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const summaries = [
  { label: "待审批申请", value: "12", icon: ClipboardCheck, tone: "text-amber-700 bg-amber-50" },
  { label: "本周考试", value: "8", icon: CalendarClock, tone: "text-blue-700 bg-blue-50" },
  { label: "待交教学日志", value: "5", icon: BookOpenText, tone: "text-rose-700 bg-rose-50" },
  { label: "毕业审核人数", value: "126", icon: GraduationCap, tone: "text-emerald-700 bg-emerald-50" },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-sm text-muted">2026-2027 学年第一学期</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">教务工作台</h1>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="业务概览">
          {summaries.map(({ label, value, icon: Icon, tone }) => (
            <article key={label} className="rounded-md border border-border bg-panel p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                </div>
                <span className={`flex size-10 items-center justify-center rounded-md ${tone}`}>
                  <Icon aria-hidden="true" size={20} />
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-md border border-border bg-panel shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">近期事项</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-left text-sm">
              <thead className="bg-slate-50 text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">事项</th>
                  <th className="px-5 py-3 font-medium">模块</th>
                  <th className="px-5 py-3 font-medium">提交人</th>
                  <th className="px-5 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-4">高等数学调课申请</td>
                  <td className="px-5 py-4 text-muted">调课管理</td>
                  <td className="px-5 py-4 text-muted">张老师</td>
                  <td className="px-5 py-4"><span className="text-amber-700">待审批</span></td>
                </tr>
                <tr>
                  <td className="px-5 py-4">A301 教室临时使用</td>
                  <td className="px-5 py-4 text-muted">教室申请</td>
                  <td className="px-5 py-4 text-muted">软件 2401 班</td>
                  <td className="px-5 py-4"><span className="text-emerald-700">已通过</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
