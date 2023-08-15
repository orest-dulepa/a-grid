import Dashboard from '@/views/DashboardView.vue';

// Remove after rule will fixed https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
// eslint-disable-next-line no-shadow
enum NAV_TYPES {
  dashboard,
  signup,
  signin,
  resetPassword,
}

export const ROUTE_DASHBOARD_CHILDREN_DETAILS = Object.freeze({
  welcome: {
    name: 'welcome',
    path: '/welcome',
  },
  audiences: {
    name: 'audiences',
    path: '/audiences',
  },
  features: {
    name: 'features',
    path: '/features',
  },
  account: {
    name: 'account',
    path: '/account',
  },
  integration: {
    name: 'integration',
    path: '/integration',
  },
  setupDeals: {
    name: 'setup-deals',
    path: '/setup-deals',
  },
  overview: {
    name: 'overview',
    path: '/overview',
  },
});

export const vueRoutes = Object.freeze({
  dashboard: {
    path: '/',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      navType: NAV_TYPES.dashboard,
    },
    redirect: () => {
      return ROUTE_DASHBOARD_CHILDREN_DETAILS.welcome.path;
    },
    children: [
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.welcome.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.welcome.name,
        component: () => import('@/views/WelcomeView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.audiences.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.audiences.name,
        component: () => import('@/views/AudiencesView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          isContinueNavbar: true,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.features.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.features.name,
        component: () => import('@/views/FeaturesView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          isContinueNavbar: true,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.account.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.account.name,
        component: () => import('@/views/AccountView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          hasSubNavbar: true,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.integration.name,
        component: () => import('@/views/IntegrationView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          hasSubNavbar: true,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.setupDeals.name,
        component: () => import('@/views/SetupDealsView/SetupDealsView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          hasSubNavbar: true,
        },
      },
      {
        path: ROUTE_DASHBOARD_CHILDREN_DETAILS.overview.path,
        name: ROUTE_DASHBOARD_CHILDREN_DETAILS.overview.name,
        component: () => import('@/views/OverviewView.vue'),
        meta: {
          requiresAuth: true,
          navType: NAV_TYPES.dashboard,
          isContinueNavbar: true,
          isNavbarBlue: false,
        },
      },
    ],
  },
  signup: {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupView.vue'),
    meta: {
      navType: NAV_TYPES.signup,
      authPage: true,
    },
  },
  login: {
    path: '/login',
    name: 'login',
    component: () => import('@/views/SigninView.vue'),
    meta: {
      navType: NAV_TYPES.signin,
      authPage: true,
    },
  },
  forgotPassword: {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      navType: NAV_TYPES.resetPassword,
      authPage: true,
    },
  },
  changePassword: {
    path: '/change-password',
    name: 'change-password',
    component: () => import('@/views/ChangePasswordView.vue'),
    meta: {
      navType: NAV_TYPES.resetPassword,
      authPage: true,
    },
  },
  emailAction: {
    path: '/email-action',
    name: 'email-action',
    component: () => import('@/views/EmailActionHandler.vue'),
  },
});
