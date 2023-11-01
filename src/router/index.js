import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import ChangePassword from '../pages/change-password.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    {
        path: '/change-password/:token',
        name: 'change-password-token',
        component: ChangePassword
    }
  ],
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
const publicRoutes = ['login', 'forgot-password', 'change-password-token']

router.beforeEach((to, from, next) => {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken && !publicRoutes.includes(to.name)) {
        next('/login')
    } else {
        next()
    }
})

export default router
