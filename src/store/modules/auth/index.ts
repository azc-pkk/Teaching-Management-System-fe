import { defineStore } from 'pinia'
import type { AuthState } from './types'
import { login as loginApi } from '@/api/auth'

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

                // TODO: fail

                // FiXME: remove it at backend
                const removeBearerPrefix = (token: string) => {
                    if (token.startsWith('Bearer '))
                        return token.slice(7);
                    return token;
                };

                this.$patch((state) => {
                    state.userId = response.data.data.user.id;
                    state.role = response.data.data.user.role;
                    state.accessToken = removeBearerPrefix(response.data.data.token);
                })
            } catch (error) {
                this.resetAuth();
                throw error;
            }
        }
    },
});

export default useAuthStore;