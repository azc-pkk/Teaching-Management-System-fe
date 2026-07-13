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
    data?: TeacherPageData;
    success?: boolean;
}

export interface TeacherPageData {
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

export interface getOptionsResponse {
    data?: Options;
    success?: boolean;
}

export interface Options {
    departments?: Department[];
    teacherTypes?: string[];
    titles?: string[];
}

export interface Department {
    id?: number;
    name?: string;
}

export function getTeacherFilterOptions() {
    return axios.get<getOptionsResponse>('/api/teachers/options');
}