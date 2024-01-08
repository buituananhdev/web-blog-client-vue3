import router from '.'
import { authStore } from '@/stores/auth.store'
export const authMiddleware = () => {
    router.beforeEach((to, from, next) => {
        console.log('beforeEach aa', to, from)
        const auth = authStore();
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (!auth.isLoggedIn) {
                next({ name: 'login' })
            } else {
                next()
            }
        } else {
            if (auth.isLoggedIn && to.name == 'login') {
                next({ name: 'dashboard' })
            } else {
                next()
            }
        }
    })
}
