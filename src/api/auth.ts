import axios from 'axios'
import type { ApiResponse } from './types'

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface AuthUser {
    id: number;
    username: string;
    name: string;
    role: string;
    teacherId: number | null;
    studentId: number | null;
    enabled: boolean;
}

export interface RegisterStudentRequest {
    studentNo: string;
    name: string;
    password: string;
}

export interface RegisterStudentResponse {
    user: AuthUser;
}

export function login(data: LoginRequest) {
    return axios.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
}

export function register(data: RegisterStudentRequest) {
    return axios.post<ApiResponse<RegisterStudentResponse>>('/api/auth/register', data);
}