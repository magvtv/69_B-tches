import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
    {
      path: '/gallery/:hall',
      name: 'gallery-hall',
      component: () => import('../views/GalleryView.vue'),
      props: true,
    },
    {
      path: '/gallery/artwork/:id',
      name: 'artwork-detail',
      component: () => import('../pages/gallery/artwork/[id].vue'),
    },
    {
      path: '/membership',
      name: 'membership',
      component: () => import('../pages/membership/index.vue'),
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../pages/auth/login.vue'),
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../pages/auth/register.vue'),
    },
    {
      path: '/admin/curator',
      name: 'admin-curator',
      component: () => import('../pages/admin/curator.vue'),
    },
  ],
})

export default router
