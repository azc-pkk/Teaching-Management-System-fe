import { defineStore } from 'pinia'
import type { AuthState } from './types'

const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        permissions: [],
        accessToken: '',
    }),

    getters: {
        isLogin(state: AuthState): boolean {
            return !!state.accessToken;
        },
    },

    actions: {

    },
});

export default useAuthStore;