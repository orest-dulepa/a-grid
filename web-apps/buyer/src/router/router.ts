import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase';
import Overview from '@/components/Overview/Overview.vue';
import Audiences from '@/components/Audience/Audiences.vue';
import Account from '@/components/Account/Account.vue';
import AudienceDetailAnalytics from '@/components/Audience/AudienceDetail/AudienceDetailAnalytics.vue';
import AudienceDetailSettings from '@/components/Audience/AudienceDetail/AudienceDetailSettings.vue';

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { layout: 'MainLayout', auth: true },
      children: [
        {
          path: '/overview',
          name: 'Overview',
          component: Overview,
        },
        {
          path: '/audiences',
          name: 'Audiences',
          component: Audiences,
        },
        {
          path: '/audiences/:id',
          name: 'AudienceDetail',
          component: () => import('@/views/AudienceDetailView.vue'),
          children: [
            {
              path: '/audiences/:id/analytics',
              name: 'AudienceDetailAnalytics',
              component: AudienceDetailAnalytics,
            },
            {
              path: '/audiences/:id/settings',
              name: 'AudienceDetailSettings',
              component: AudienceDetailSettings,
            },
            {
              path: '/audiences/:id',
              redirect: (to) => `/audiences/${to.params.id}/analytics`,
            },
          ],
        },
        {
          path: '/',
          redirect: '/overview',
        },
      ],
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('@/views/account/AccountView.vue'),
      meta: { layout: 'MainLayout', auth: true },
      children: [
        {
          path: '/account',
          name: 'Account',
          component: Account,
        },
        {
          path: '/',
          redirect: '/account',
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/email-signup',
      name: 'EmailSignup',
      component: () => import('@/views/EmailSignupView.vue'),
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/first-user-signup',
      name: 'FirstUserSignup',
      component: () => import('@/views/EmailSignupView.vue'),
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/create-organization',
      name: 'CreateOrganization',
      component: () => import('@/views/CreateOrganizationView.vue'),
      meta: { layout: 'AuthLayout' },
    },
  ],
});

router.beforeEach((to, _, next) => {
  auth.onAuthStateChanged((user) => {
    if (!user && to.meta.auth) next('/login');
    else next();
  });
});

export const authPaths = [
  '/login',
  '/signup',
  '/email-signup',
  '/first-user-signup',
  '/create-organization',
];
