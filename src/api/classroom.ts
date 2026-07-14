import axios from 'axios'
import type { ApiResponse } from './types'

export interface Classroom {
    area?: number | null;
    building?: string | null;
    campus?: string | null;
    capacity: number;
    id: number;
    roomNo: string;
    status: ClassroomStatus;
    type?: string | null;
}

export type ClassroomStatus =
    | 'AVAILABLE'
    | 'OCCUPIED'
    | 'MAINTENANCE';

export interface GetClassroomListRequest {
    page?: number;
    pageSize?: number;
    keyword?: string;
    campus?: string;
    building?: string;
    type?: string;
    status?: ClassroomStatus;
}

export interface GetClassroomListResponse {
    list?: Classroom[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getClassroomList(params: GetClassroomListRequest) {
    return axios.get<ApiResponse<GetClassroomListResponse>>('/api/classrooms', { params });
}

export interface GetOptionsResponse {
    campuses?: string[];
    buildings?: string[];
    types?: string[];
    statuses?: ClassroomStatus[];
}

export function getClassroomFilterOptions() {
    return axios.get<ApiResponse<GetOptionsResponse>>('/api/classrooms/options');
}

export interface AddClassroomRequest {
    roomNo: string;
    capacity: number;
    status?: ClassroomStatus;
    type?: string | null;
    campus?: string | null;
    building?: string | null;
    area?: number | null;
}

export function addClassroom(params: AddClassroomRequest) {
    return axios.post<ApiResponse<Classroom>>('/api/classrooms', params);
}

export function getClassroomDetail(id: number) {
    return axios.get<ApiResponse<Classroom>>(`/api/classrooms/${id}`);
}

export interface PatchClassroomRequest {
    roomNo?: string;
    capacity?: number;
    status?: ClassroomStatus;
    type?: string | null;
    campus?: string | null;
    building?: string | null;
    area?: number | null;
}

export function patchClassroom(id: number, params: PatchClassroomRequest) {
    return axios.patch<ApiResponse<Classroom>>(`/api/classrooms/${id}`, params);
}

export interface DeleteClassroomResponse {
    deleted: boolean;
}

export function deleteClassroom(id: number) {
    return axios.delete<ApiResponse<DeleteClassroomResponse>>(`/api/classrooms/${id}`);
}