import axios from 'axios'
import type { ApiResponse } from './types'

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        name: string;
        role: string;
        teacherId: number | null;
        studentId: number | null;
        enabled: boolean;
    };
}

export function login(data: LoginRequest) {
    return axios.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
}