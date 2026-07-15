export interface ApiResponse<T = any> {
    success: boolean,
    data: T | null,
    error: ErrType | null,
}

export interface ErrType {
    code: string,
    message: string,
    details?: string[],
}

export type WorkflowStatus =
    | 'DRAFT'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'COMPLETED';