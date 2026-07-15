import axios from 'axios'
import type { ApiResponse } from './types'

export interface AccountInfo {
    id: number;
    username: string;
    name: string;
    displayName: string;
    enabled: boolean;
}

export interface IdentityInfo {
    role: string;
    roleCode: string;
    roleLabel: string;
    isAdministrator: boolean;
}

export interface TeacherProfile {
    id: number;
    employeeNo: string;
    name: string;
    departmentId?: number | null;
    departmentName?: string | null;
    teacherType?: string | null;
    title?: string | null;
    phone?: string | null;
}

export interface StudentProfile {
    id: number;
    studentNo: string;
    name: string;
    grade: number;
    status: string;
    phone?: string | null;
    classGroupId: number;
    classGroupCode: string;
    classGroupName: string;
    majorId: number;
    majorName: string;
    departmentId: number;
    departmentName: string;
    counselorId?: number | null;
    counselorName?: string | null;
}

export interface CurrentUserData {
    user: AccountInfo;
    identity: IdentityInfo;
    teacherProfile: TeacherProfile | null;
    studentProfile: StudentProfile | null;
}

export function getCurrentUser() {
    return axios.get<ApiResponse<CurrentUserData>>('/api/auth/me');
}