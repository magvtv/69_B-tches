import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/pages/LandingPage.vue'),
  },
  {
    path: '/demo/quiz',
    name: 'DemoQuiz',
    component: () => import('@/pages/DemoQuiz.vue'),
  },
  {
    path: '/demo/puzzle',
    name: 'DemoPuzzle',
    component: () => import('@/pages/DemoPuzzle.vue'),
  },
  {
    path: '/levels/01',
    name: 'Level1',
    component: () => import('@/pages/levels/01-meme-maze/MemeMaze.vue'),
  },
  {
    path: '/levels/meme-maze/:slug',
    name: 'MemeMazeStep',
    component: () => import('@/pages/levels/[slug].vue'),
    props: true,
  },
  {
    path: '/levels/02',
    name: 'Level2',
    component: () => import('@/pages/levels/02-songs-origin/SongsOrigin.vue'),
  },
  {
    path: '/levels/03',
    name: 'Level3',
    component: () => import('@/pages/levels/03-jokes-chaos/JokesChaos.vue'),
  },
  {
    path: '/levels/04',
    name: 'Level4',
    component: () => import('@/pages/levels/04-sutra-enigma/SutraEnigma.vue'),
  },
  {
    path: '/levels/05',
    name: 'Level5',
    component: () => import('@/pages/levels/05-final-heist/FinalHeist.vue'),
  },
  {
    path: '/levels',
    name: 'Levels',
    component: () => import('@/pages/CircusIntro.vue'),
  },
  // Removed generic dynamic routes to avoid conflict with meme-maze slug routes
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFound.vue'),
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
  // Allow the 404 page to render for unknown routes on production
  const isNotFound = to.matched.some(r => r.name === 'NotFound')
  if (isProd && onProdDomain && to.path !== '/' && !isNotFound) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router


