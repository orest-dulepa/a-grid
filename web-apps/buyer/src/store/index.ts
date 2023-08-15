import { createStore, Store } from 'vuex';
import { RootState } from './types';
import { audiences } from './modules/audiences';
import { analytics } from './modules/analytics';
import { auth } from './modules/auth';

export const store: Store<RootState> = createStore({
  modules: {
    audiences,
    analytics,
    auth,
  },
});
