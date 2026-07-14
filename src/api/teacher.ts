import axios from 'axios'
import type { ApiResponse } from './types'

export interface Teacher {
    departmentId?: number | null;
    departmentName?: string | null;
    employeeNo: string;
    id: number;
    name: string;
    phone?: string | null;
    teacherType?: string | null;
    title?: string | null;
}

export interface GetTeacherListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    departmentId?: number;
    teacherType?: string;
    title?: string;
}

export interface GetTeacherListResponse {
    list?: Teacher[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getTeacherList(params: GetTeacherListRequest) {
    return axios.get<ApiResponse<GetTeacherListResponse>>('/api/teachers', { params });
}

export interface Department {
    id?: number;
    name?: string;
}

export interface GetOptionsResponse {
    departments?: Department[];
    teacherTypes?: string[];
    titles?: string[];
}

export function getTeacherFilterOptions() {
    return axios.get<ApiResponse<GetOptionsResponse>>('/api/teachers/options');
}

export interface AddTeacherRequest {
    departmentId?: number | null;
    employeeNo: string;
    name: string;
    phone?: string | null;
    teacherType?: string | null;
    title?: string | null;
}

export function addTeacher(params: AddTeacherRequest) {
    return axios.post<ApiResponse<Teacher>>('/api/teachers', params);
}

export function getTeacherDetail(id: number) {
    return axios.get<ApiResponse<Teacher>>(`/api/teachers/${id}`);
}

export interface PatchTeacherRequest {
    departmentId?: number | null;
    employeeNo?: string;
    name?: string;
    phone?: string | null;
    teacherType?: string | null;
    title?: string | null;
}

export function patchTeacher(id: number, params: PatchTeacherRequest) {
    return axios.patch<ApiResponse<Teacher>>(`/api/teachers/${id}`, params);
}

export interface DeleteTeacherResponse {
    deleted: boolean;
}

export function deleteTeacher(id: number) {
    return axios.delete<ApiResponse<DeleteTeacherResponse>>(`/api/teachers/${id}`);
}