import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/pages/LandingPage.vue'),
  },
  {
    path: '/game',
    name: 'GameHub',
    component: () => import('@/pages/game/index.vue'),
  },
  {
    path: '/game/level0',
    name: 'Level0',
    component: () => import('@/pages/game/Level0.vue'),
  },
  {
    path: '/game/level1',
    name: 'Level1',
    component: () => import('@/pages/game/Level1.vue'),
  },
  {
    path: '/game/level2',
    name: 'Level2',
    component: () => import('@/pages/game/Level2.vue'),
  },
  {
    path: '/game/level3',
    name: 'Level3',
    component: () => import('@/pages/game/Level3.vue'),
  },
  {
    path: '/game/level4',
    name: 'Level4',
    component: () => import('@/pages/game/Level4.vue'),
  },
  {
    path: '/game/level5',
    name: 'Level5',
    component: () => import('@/pages/game/Level5.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Restrict navigation on production domain: allow only root path
router.beforeEach((to, _from, next) => {
  const isProd = import.meta.env.PROD
  const prodDomain = 'that-harley-circus.vercel.app'
  const onProdDomain = typeof window !== 'undefined' && window.location.hostname === prodDomain
  if (isProd && onProdDomain && to.path !== '/') {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router


