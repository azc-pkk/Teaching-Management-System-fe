import axios from 'axios'
import type { ApiResponse } from './types'

export interface Student {
    classGroupId: number;
    classGroupName?: string;
    grade: number;
    id: number;
    name: string;
    phone?: string | null;
    status: StudentStatus;
    studentNo: string;
}

export type StudentStatus =
    | 'ENROLLED'
    | 'SUSPENDED'
    | 'GRADUATED'
    | 'WITHDRAWN';

export interface GetStudentListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    classGroupId?: number;
    grade?: number;
    status?: StudentStatus;
}

export interface GetStudentListResponse {
    list?: Student[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getStudentList(params: GetStudentListRequest) {
    return axios.get<ApiResponse<GetStudentListResponse>>('/api/students', { params });
}

export interface Department {
    id?: number;
    name?: string;
}

export interface Major {
    id?: number;
    name?: string;
    departmentId?: number;
}

export interface ClassGroup {
    id?: number;
    name?: string;
    grade?: number;
    majorId?: number;
    majorName?: string;
    departmentId?: number;
    departmentName?: string;
}

export interface GetOptionsResponse {
    departments?: Department[];
    majors?: Major[];
    classGroups?: ClassGroup[];
    grades?: number[];
    statuses?: StudentStatus[];
}

export function getStudentFilterOptions() {
    return axios.get<ApiResponse<GetOptionsResponse>>('/api/students/options');
}

export interface AddStudentRequest {
    studentNo: string;
    name: string;
    classGroupId: number;
    grade: number;
    status: StudentStatus;
    phone?: string | null;
}

export function addStudent(params: AddStudentRequest) {
    return axios.post<ApiResponse<Student>>('/api/students', params);
}

export function getStudentDetail(id: number) {
    return axios.get<ApiResponse<Student>>(`/api/students/${id}`);
}

export interface PatchStudentRequest {
    studentNo?: string;
    name?: string;
    classGroupId?: number;
    grade?: number;
    status?: StudentStatus;
    phone?: string | null;
}

export function patchStudent(id: number, params: PatchStudentRequest) {
    return axios.patch<ApiResponse<Student>>(`/api/students/${id}`, params);
}

export interface DeleteStudentResponse {
    deleted: boolean;
}

export function deleteStudent(id: number) {
    return axios.delete<ApiResponse<DeleteStudentResponse>>(`/api/students/${id}`);
}