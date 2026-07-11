import axios from 'axios'

export interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
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
    };
}

export function login(data: LoginData) {
    return axios.post<LoginResponse>('/api/auth/login', data);
}