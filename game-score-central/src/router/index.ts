import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home', // Redirect root to home
  },
  {
    path: '/:pathMatch(.*)*', // This is a fallback for any undefined routes.
    redirect: '/home', // Will route to home if the URL doesn't match.
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home.vue'),
      },
      {
        path: 'gameSelect',
        component: () => import('@/views/gameSelect.vue'),
      },
      {
        path: 'dart',
        component: () => import('@/views/dart.vue'),
      },
      {
        path: 'tournament',
        component: () => import('@/views/tournament.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
