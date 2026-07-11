export type PermType = '' | 'admin' | 'user' | 'guest';

export interface AuthState {
    permissions: PermType[];
    accessToken?: string;
}