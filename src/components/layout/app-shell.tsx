import Link from "next/link";
import {
  BookOpenText,
  Building2,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";

const navigation = [
  { label: "工作台", href: "/", icon: LayoutDashboard },
  { label: "基础数据", href: "/base", icon: Users },
  { label: "考务管理", href: "/exams", icon: CalendarDays },
  { label: "教室申请", href: "/classroom-requests", icon: Building2 },
  { label: "调课管理", href: "/schedule-changes", icon: RefreshCw },
  { label: "教材管理", href: "/textbooks", icon: ClipboardList },
  { label: "毕业相关", href: "/graduation", icon: GraduationCap },
  { label: "教学日志", href: "/teaching-logs", icon: BookOpenText },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-slate-800 bg-slate-900 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link href="/" className="font-semibold">教学过程管理</Link>
          <button className="flex size-9 items-center justify-center text-slate-400 hover:text-white" title="退出登录" type="button">
            <LogOut aria-hidden="true" size={18} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1" aria-label="主导航">
          {navigation.map(({ label, href, icon: Icon }, index) => (
            <Link
              key={href}
              href={href}
              className={`flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm ${index === 0 ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
