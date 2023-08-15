import { createApp } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';

import App from './App.vue';
import { router } from './router/router';
import { store } from './store';
import './styles/global.scss';

const app = createApp(App);
app.use(VueHighcharts, { Highcharts });
app.use(router);
app.use(store);

app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event: Record<string, unknown>) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

app.mount('#app');
