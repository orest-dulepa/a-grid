import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import App from '@/App.vue';
import store from '@/store';
import router from '@/routes';
import { ActionTypes } from '@/store/actions';

Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: '"aktiv-grotesk", "IBM Plex Sans", sans-serif', // TODO: add to global styles
    },
  },
  credits: {
    enabled: false,
  },
});

Vue.use(HighchartsVue, {
  tagName: 'charts',
  highcharts: Highcharts,
});

new Vue({
  router,
  store,
  render: (createElement) => createElement(App),
  beforeCreate() {
    store.dispatch(ActionTypes.SET_USER);
  },
}).$mount('#app');
