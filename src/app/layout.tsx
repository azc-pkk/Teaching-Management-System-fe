import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "教学过程管理系统",
  description: "学院教务与教学过程管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
