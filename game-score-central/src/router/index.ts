import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/home1'
      },
      {
        path: 'home',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'gameSelect',
        component: () => import('@/views/gameSelect.vue')
      },
      {
        path: 'dart',
        component: () => import('@/views/dart.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
