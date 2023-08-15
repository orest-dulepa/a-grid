<template>
  <component :is="layout"></component>
</template>

<script lang="ts">
import { defineComponent, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  name: 'App',
  components: {
    MainLayout,
    AuthLayout,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    watch(
      () => route.meta.layout,
      () => {
        if (typeof route.meta.layout === 'string') {
          document.body.className = route.meta.layout.toLowerCase();
        }
      }
    );

    onMounted(async () => {
      await store.dispatch(ActionTypes.SET_USER);
    });

    return {
      layout: computed(() => route.meta.layout || 'AuthLayout'),
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/fonts';
@import '@/styles/colors';
@import '@/styles/form';

body {
  padding: 0;
  margin: 0;
}
body,
input,
textarea,
button {
  font-family: Inter, sans-serif;
}
</style>
