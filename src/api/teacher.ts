import axios from 'axios'

export interface Teacher {
    departmentId?: number | null;
    departmentName?: null | string;
    employeeNo: string;
    id: number;
    name: string;
    phone?: null | string;
    teacherType?: null | string;
    title?: null | string;
}

export interface TeacherPageResponse {
    data?: Data;
    success?: boolean;
}

export interface Data {
    list?: Teacher[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export interface GetTeacherListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    departmentId?: number;
    teacherType?: string;
    title?: string;
}

export function getTeacherList(params: GetTeacherListRequest) {
    return axios.get<TeacherPageResponse>('/api/teachers', { params });
}