import axios from 'axios'
import type { ApiResponse, WorkflowStatus } from './types'

export type ApprovalAction = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'RETURN' | 'CANCEL';

export interface ApprovalTimelineItem {
    id: number;
    action: ApprovalAction;
    comment?: string | null;
    operator: {
        id: number;
        username: string;
        name: string;
        role: string;
    };
    createdAt: string;
}

export interface ClassroomRequest {
    id: number;
    applicantId: number;
    applicantName: string;
    applicantUsername: string;
    classroomId: number;
    classroomRoomNo: string;
    classroomCampus?: string | null;
    classroomBuilding?: string | null;
    classroomType?: string | null;
    classroomCapacity: number;
    classroomStatus?: ClassroomStatus;
    participantCount: number;
    startTime: string;
    endTime: string;
    purpose: string;
    status: WorkflowStatus;
    latestApproval?: ApprovalTimelineItem | null;
    approvalHistory?: ApprovalTimelineItem[];
}

export type ClassroomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface GetClassroomRequestListRequest {
    page?: number;
    pageSize?: number;
    applicantId?: number;
    classroomId?: number;
    status?: WorkflowStatus;
    startTimeFrom?: string;
    startTimeTo?: string;
    keyword?: string;
}

export interface GetClassroomRequestListResponse {
    list?: ClassroomRequest[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getClassroomRequestList(params: GetClassroomRequestListRequest) {
    return axios.get<ApiResponse<GetClassroomRequestListResponse>>('/api/classroom-requests', { params });
}

export interface AddClassroomRequestRequest {
    classroomId: number;
    participantCount: number;
    startTime: string;
    endTime: string;
    purpose: string;
    status?: 'DRAFT' | 'PENDING';
}

export function addClassroomRequest(params: AddClassroomRequestRequest) {
    return axios.post<ApiResponse<ClassroomRequest>>('/api/classroom-requests', params);
}

export function getClassroomRequestDetail(id: number) {
    return axios.get<ApiResponse<ClassroomRequest>>(`/api/classroom-requests/${id}`);
}

export interface PatchClassroomRequestRequest {
    classroomId?: number;
    participantCount?: number;
    startTime?: string;
    endTime?: string;
    purpose?: string;
    status?: 'DRAFT' | 'PENDING';
}

export function patchClassroomRequest(id: number, params: PatchClassroomRequestRequest) {
    return axios.patch<ApiResponse<ClassroomRequest>>(`/api/classroom-requests/${id}`, params);
}

export interface PatchClassroomRequestStatusRequest {
    status: WorkflowStatus;
    operatorId?: number;
    comment?: string;
}

export function patchClassroomRequestStatus(id: number, params: PatchClassroomRequestStatusRequest) {
    return axios.patch<ApiResponse<ClassroomRequest>>(`/api/classroom-requests/${id}/status`, params);
}

export interface DeleteClassroomRequestResponse {
    deleted: boolean;
}

export function deleteClassroomRequest(id: number) {
    return axios.delete<ApiResponse<DeleteClassroomRequestResponse>>(`/api/classroom-requests/${id}`);
}