import { defineStore } from 'pinia'
import type { AuthState } from './types'
import { login as loginApi } from '@/api/auth'
import checkResponse from '@/utils/checkResponse';

const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        userId: -1,
        role: '',
        accessToken: '',
    }),

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
                const innerRes = response.data;
                const data = checkResponse(innerRes);

                this.$patch((state) => {
                    state.userId = data.user.id;
                    state.role = data.user.role;
                    state.accessToken = data.token;
                })
            } catch (error) {
                this.resetAuth();
                throw error;
            }
        }
    },
});

export default useAuthStore;