export interface AuthState {
    userId: number;
    role: string;
    accessToken?: string;
    displayName?: string;
    userName?: string;
}