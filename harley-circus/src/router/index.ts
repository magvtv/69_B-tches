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
  {
    path: '/levels/:slug',
    name: 'LevelDynamic',
    component: () => import('@/pages/levels/[slug].vue'),
    props: true,
  },
  {
    path: '/game/levels/:slug',
    name: 'GameLevelDynamic',
    component: () => import('@/pages/levels/[slug].vue'),
    props: true,
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


