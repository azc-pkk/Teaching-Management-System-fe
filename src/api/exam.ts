import axios from 'axios'
import type { ApiResponse } from './types'

export interface Exam {
    id: number;
    semesterId: number;
    courseId: number;
    courseCode: string;
    courseName: string;
    classGroupId: number;
    classGroupName: string;
    classGroupGrade: number;
    classroomId: number;
    classroomRoomNo: string;
    classroomCampus?: string | null;
    classroomBuilding?: string | null;
    startTime: string;
    endTime: string;
    invigilatorId?: number | null;
    invigilatorName?: string | null;
    invigilatorEmployeeNo?: string | null;
}

export interface GetExamListRequest {
    page?: number;
    pageSize?: number;
    semesterId?: number;
    courseId?: number;
    classGroupId?: number;
    classroomId?: number;
    invigilatorId?: number;
    startTimeFrom?: string;
    startTimeTo?: string;
    keyword?: string;
}

export interface GetExamListResponse {
    list?: Exam[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export function getExamList(params: GetExamListRequest) {
    return axios.get<ApiResponse<GetExamListResponse>>('/api/exams', { params });
}

export interface AddExamRequest {
    semesterId: number;
    courseId: number;
    classGroupId: number;
    classroomId: number;
    startTime: string;
    endTime: string;
    invigilatorId?: number | null;
}

export function addExam(params: AddExamRequest) {
    return axios.post<ApiResponse<Exam>>('/api/exams', params);
}

export function getExamDetail(id: number) {
    return axios.get<ApiResponse<Exam>>(`/api/exams/${id}`);
}

export interface PatchExamRequest {
    semesterId?: number;
    courseId?: number;
    classGroupId?: number;
    classroomId?: number;
    startTime?: string;
    endTime?: string;
    invigilatorId?: number | null;
}

export function patchExam(id: number, params: PatchExamRequest) {
    return axios.patch<ApiResponse<Exam>>(`/api/exams/${id}`, params);
}

export interface DeleteExamResponse {
    deleted: boolean;
}

export function deleteExam(id: number) {
    return axios.delete<ApiResponse<DeleteExamResponse>>(`/api/exams/${id}`);
}