import type { AxiosResponse } from 'axios'

export interface Student {
    classGroupId: number;
    classGroupName?: string;
    grade: number;
    id: number;
    name: string;
    phone?: null | string;
    status: StudentStatus;
    studentNo: string;
}

export type StudentStatus =
    | 'ENROLLED'
    | 'GRADUATED'
    | 'SUSPENDED'
    | 'WITHDRAWN';

export interface ClassGroup {
    id: number;
    name: string;
}

export interface StudentPageResponse {
    success?: boolean;
    data?: StudentPageData;
}

export interface StudentPageData {
    list?: Student[];
    total?: number;
    page?: number;
    pageSize?: number;
}

export interface GetStudentListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    grade?: number;
    classGroupId?: number;
    status?: StudentStatus;
}

export interface StudentOptionsResponse {
    success?: boolean;
    data?: StudentOptions;
}

export interface StudentOptions {
    classGroups?: ClassGroup[];
    grades?: number[];
    statuses?: StudentStatus[];
}

export interface CreateStudentRequest {
    name: string;
    studentNo: string;
    grade: number;
    classGroupId: number;
    phone?: string;
    status?: StudentStatus;
}

export interface UpdateStudentRequest {
    name?: string;
    grade?: number;
    classGroupId?: number;
    phone?: string;
    status?: StudentStatus;
}

export function getStudentList(_params: GetStudentListRequest): Promise<AxiosResponse<StudentPageResponse>> {
    // TODO: 调用后端接口
    // return axios.get<StudentPageResponse>('/api/students', { params })
    return Promise.reject(new Error('getStudentList 未实现'))
}

export function getStudentFilterOptions(): Promise<AxiosResponse<StudentOptionsResponse>> {
    // TODO: 调用后端接口
    // return axios.get<StudentOptionsResponse>('/api/students/options')
    return Promise.reject(new Error('getStudentFilterOptions 未实现'))
}

export function createStudent(_data: CreateStudentRequest): Promise<AxiosResponse<{ success: boolean }>> {
    // TODO: 调用后端接口
    // return axios.post('/api/students', data)
    return Promise.reject(new Error('createStudent 未实现'))
}

export function updateStudent(_id: number, _data: UpdateStudentRequest): Promise<AxiosResponse<{ success: boolean }>> {
    // TODO: 调用后端接口
    // return axios.put(`/api/students/${id}`, data)
    return Promise.reject(new Error('updateStudent 未实现'))
}

export function importStudentsFromFile(_file: File): Promise<AxiosResponse<{ success: boolean }>> {
    // TODO: 调用后端批量导入接口
    // const formData = new FormData()
    // formData.append('file', file)
    // return axios.post('/api/students/import', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // })
    return Promise.reject(new Error('importStudentsFromFile 未实现'))
}