import type { ApiResponse } from "@/types/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    credentials: "include",
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || result.data === undefined) {
    throw new Error(result.error?.message ?? "请求失败，请稍后重试");
  }

  return result.data;
}
