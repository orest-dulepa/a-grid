import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { once } from '@/utils';
import * as api from '@/store/api';
import { Position, Route } from 'vue-router/types/router.d';
import { vueRoutes, ROUTE_DASHBOARD_CHILDREN_DETAILS } from './routes';

export { vueRoutes, ROUTE_DASHBOARD_CHILDREN_DETAILS };

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: vueRoutes.dashboard.path,
    },
    ...Object.values(vueRoutes),
  ],
  async scrollBehavior(_to: Route, _from: Route, savedPosition: Position | void) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

const isLoggedIn = once(api.isLoggedIn);

// kick out if user gets logged out
store.subscribe(async () => {
  const requiresAuth = router.currentRoute.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !(await isLoggedIn()) && requiresAuth) router.push(vueRoutes.login.path);
});

router.beforeEach(async (to, _, next) => {
  const isAuthenticated = await isLoggedIn();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authPage = to.matched.some((record) => record.meta.authPage);

  if (authPage && isAuthenticated) {
    return next(vueRoutes.dashboard);
  }
  if (requiresAuth && !isAuthenticated) {
    return next(vueRoutes.login.path);
  }
  // Redirect from Welcome page to Overview page when onboarding complete.
  if (to.path === ROUTE_DASHBOARD_CHILDREN_DETAILS.welcome.path) {
    if (JSON.parse(localStorage.getItem('isOnboardingComplete') || 'false')) {
      return next(ROUTE_DASHBOARD_CHILDREN_DETAILS.overview.path);
    }
  }
  return next();
});

export default router;
