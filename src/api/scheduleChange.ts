import axios from 'axios'
import type { ApiResponse, WorkflowStatus } from './types'

export interface ScheduleChange {
    id: number;
    teacherId: number;
    teacherName: string;
    teacherEmployeeNo: string;
    courseId: number;
    courseCode: string;
    courseName: string;
    classGroupId: number;
    classGroupName: string;
    classGroupGrade: number;
    hours: number;
    reason: string;
    status: WorkflowStatus;
}

export interface GetScheduleChangeListRequest {
    page?: number;
    pageSize?: number;
    teacherId?: number;
    courseId?: number;
    classGroupId?: number;
    status?: WorkflowStatus;
    keyword?: string;
}

export interface GetScheduleChangeListResponse {
    list?: ScheduleChange[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getScheduleChangeList(params: GetScheduleChangeListRequest) {
    return axios.get<ApiResponse<GetScheduleChangeListResponse>>('/api/schedule-changes', { params });
}

export interface AddScheduleChangeRequest {
    teacherId: number;
    courseId: number;
    classGroupId: number;
    hours: number;
    reason: string;
    status?: WorkflowStatus;
}

export function addScheduleChange(params: AddScheduleChangeRequest) {
    return axios.post<ApiResponse<ScheduleChange>>('/api/schedule-changes', params);
}

export function getScheduleChangeDetail(id: number) {
    return axios.get<ApiResponse<ScheduleChange>>(`/api/schedule-changes/${id}`);
}

export interface PatchScheduleChangeRequest {
    teacherId?: number;
    courseId?: number;
    classGroupId?: number;
    hours?: number;
    reason?: string;
    status?: WorkflowStatus;
}

export function patchScheduleChange(id: number, params: PatchScheduleChangeRequest) {
    return axios.patch<ApiResponse<ScheduleChange>>(`/api/schedule-changes/${id}`, params);
}

export interface PatchScheduleChangeStatusRequest {
    status: WorkflowStatus;
    operatorId?: number;
    comment?: string;
}

export function patchScheduleChangeStatus(id: number, params: PatchScheduleChangeStatusRequest) {
    return axios.patch<ApiResponse<ScheduleChange>>(`/api/schedule-changes/${id}/status`, params);
}

export interface DeleteScheduleChangeResponse {
    deleted: boolean;
}

export function deleteScheduleChange(id: number) {
    return axios.delete<ApiResponse<DeleteScheduleChangeResponse>>(`/api/schedule-changes/${id}`);
}