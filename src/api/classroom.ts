import type { AxiosResponse } from 'axios'

export interface Classroom {
    area?: number | null;
    building?: null | string;
    campus?: null | string;
    capacity: number;
    id: number;
    roomNo: string;
    status: ClassroomStatus;
    type?: null | string;
    [property: string]: any;
}

export type ClassroomStatus =
    | 'AVAILABLE'
    | 'MAINTENANCE'
    | 'OCCUPIED'

export interface ClassroomPageResponse {
    success?: boolean;
    data?: ClassroomPageData;
}

export interface ClassroomPageData {
    list?: Classroom[];
    total?: number;
    page?: number;
    pageSize?: number;
}

export interface GetClassroomListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    campus?: string;
    building?: string;
    type?: string;
    status?: ClassroomStatus;
    minCapacity?: number;
}

export interface ClassroomOptionsResponse {
    success?: boolean;
    data?: ClassroomOptions;
}

export interface ClassroomOptions {
    campuses?: string[];
    buildings?: string[];
    types?: string[];
}

export interface CreateClassroomRequest {
    roomNo: string;
    capacity: number;
    status?: ClassroomStatus;
    type?: string;
    campus?: string;
    building?: string;
    area?: number;
}

export interface UpdateClassroomRequest {
    roomNo?: string;
    capacity?: number;
    status?: ClassroomStatus;
    type?: string;
    campus?: string;
    building?: string;
    area?: number;
}

export function getClassroomList(_params: GetClassroomListRequest): Promise<AxiosResponse<ClassroomPageResponse>> {
    // TODO: 调用后端接口
    // return axios.get<ClassroomPageResponse>('/api/classrooms', { params })
    return Promise.reject(new Error('getClassroomList 未实现'))
}

export function getClassroomFilterOptions(): Promise<AxiosResponse<ClassroomOptionsResponse>> {
    // TODO: 调用后端接口
    // return axios.get<ClassroomOptionsResponse>('/api/classrooms/options')
    return Promise.reject(new Error('getClassroomFilterOptions 未实现'))
}

export function createClassroom(_data: CreateClassroomRequest): Promise<AxiosResponse<{ success: boolean }>> {
    // TODO: 调用后端接口
    // return axios.post('/api/classrooms', data)
    return Promise.reject(new Error('createClassroom 未实现'))
}

export function updateClassroom(_id: number, _data: UpdateClassroomRequest): Promise<AxiosResponse<{ success: boolean }>> {
    // TODO: 调用后端接口
    // return axios.put(`/api/classrooms/${id}`, data)
    return Promise.reject(new Error('updateClassroom 未实现'))
}