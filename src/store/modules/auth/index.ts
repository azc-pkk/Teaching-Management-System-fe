import { defineStore } from 'pinia'
import type { AuthState } from './types'
import { login as loginApi } from '@/api/auth'
import { getCurrentUser as getMeApi } from '@/api/authme'
import checkResponse from '@/utils/checkResponse';
import { isAxiosError } from 'axios';

const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        userId: -1,
        role: '',
        accessToken: '',
        displayName: '',
        userName: '',
    }),

    persist: {
        pick: ['accessToken', 'userId', 'role', 'displayName', 'userName'],
    },

    getters: {
        isLogin(state: AuthState): boolean {
            return !!state.accessToken;
        },
    },

    actions: {
        resetAuth() {
            this.$reset();
        },

        async login(username: string, password: string) {
            try {
                const response = await loginApi({ username, password });
                const data = checkResponse(response.data);

                this.$patch((state) => {
                    state.userId = data.user.id;
                    state.role = data.user.role;
                    state.accessToken = data.token;
                })

                await this.fetchUserProfile();
            } catch (error) {
                this.resetAuth();
                throw error;
            }
        },

        async fetchUserProfile() {
            try {
                const response = await getMeApi();
                const data = checkResponse(response.data);
                this.$patch((state) => {
                    state.displayName = data.user.displayName;
                    state.userName = data.user.username;
                })
            } catch (err) {
                if (isAxiosError(err) && err.response?.status === 401) {
                    this.resetAuth();
                }
            }
        },
    },
});

export default useAuthStore;