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

                // TODO: Fail
                console.log(
                    '%c[auth] login response',
                    'color: #16a34a; font-weight: bold',
                )
                console.log('  raw response:', response.data)
                console.log('  user:', response.data.data.user)
                console.log('  token:', response.data.data.token)

                this.$patch((state) => {
                    state.userId = response.data.data.user.id;
                    state.role = response.data.data.user.role;
                    state.accessToken = response.data.data.token;
                })

                console.log(
                    '%c[auth] state after patch',
                    'color: #2563eb; font-weight: bold',
                    'userId =', this.userId,
                    ', role =', this.role,
                    ', isLogin =', this.isLogin,
                )
            } catch (error) {
                this.resetAuth();
                throw error;
            }
        }
    },
});

export default useAuthStore;