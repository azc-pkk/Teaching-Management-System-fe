import axios from 'axios'
import type { ApiResponse, WorkflowStatus } from './types'

export interface DepartmentBrief {
    id: number;
    code: string;
    name: string;
}

export interface TeacherBrief {
    id: number;
    employeeNo: string;
    name: string;
    title?: string | null;
}

export interface ClassGroupBrief {
    id: number;
    name: string;
    grade: number;
}

export interface CourseSummary {
    id: number;
    code: string;
    name: string;
    credits: number;
    courseType?: string | null;
    departmentId?: number | null;
    departmentName?: string | null;
    directorId?: number | null;
    directorName?: string | null;
}

export interface ExamArrangement {
    id: number;
    semesterId: number;
    classGroup: ClassGroupBrief;
    classroom: {
        id: number;
        campus?: string | null;
        building?: string | null;
        roomNo: string;
    };
    startTime: string;
    endTime: string;
    invigilator?: TeacherBrief | null;
}

export interface ScheduleChangeArrangement {
    id: number;
    teacher?: TeacherBrief | null;
    classGroup?: ClassGroupBrief | null;
    hours: number;
    reason: string;
    status: WorkflowStatus;
}

export type TextbookOrderStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'ORDERED'
    | 'RECEIVED'
    | 'CANCELLED';

export interface TextbookOrderArrangement {
    id: number;
    semesterId: number;
    quantity: number;
    status: TextbookOrderStatus;
    textbook: {
        id: number;
        isbn: string;
        name: string;
        author?: string | null;
        publisher?: string | null;
        price: number;
    };
}

export type TeachingLogStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'APPROVED'
    | 'REJECTED';

export interface TeachingLogArrangement {
    id: number;
    teacher?: TeacherBrief | null;
    classGroup?: ClassGroupBrief | null;
    lessonDate: string;
    content: string;
    attendanceSummary?: string | null;
    status: TeachingLogStatus;
}

export interface CourseDetail extends CourseSummary {
    department?: DepartmentBrief | null;
    director?: TeacherBrief | null;
    arrangements: {
        exams: ExamArrangement[];
        scheduleChanges: ScheduleChangeArrangement[];
        textbookOrders: TextbookOrderArrangement[];
        teachingLogs: TeachingLogArrangement[];
    };
}

export function getCourseDetail(id: number, semesterId?: number) {
    return axios.get<ApiResponse<CourseDetail>>(`/api/base-data/courses/${id}`, {
        params: semesterId ? { semesterId } : undefined,
    });
}