import axios from 'axios'
import type { ApiResponse } from './types'

export interface CourseOption {
    id: number;
    code: string;
    name: string;
    label: string;
    value: number;
}

export interface SemesterOption {
    id: number;
    code: string;
    name: string;
    startDate: string;
    endDate: string;
    status: SemesterStatus;
    label: string;
    value: number;
}

export type SemesterStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface GetCourseOptionsRequest {
    departmentId?: number;
    keyword?: string;
}

export function getCourseOptions(params?: GetCourseOptionsRequest) {
    return axios.get<ApiResponse<CourseOption[]>>('/api/base-data/courses/options', { params });
}

export function getSemesterOptions() {
    return axios.get<ApiResponse<SemesterOption[]>>('/api/base-data/semesters/options');
}