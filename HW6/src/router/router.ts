import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../views/MainPage.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/Home.vue')
      },
      {
        path: '/explain',
        name: 'explain',
        component: () => import('../views/explain/Explain.vue')
      }/* ,
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/profile/Profile.vue')
      } */
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
