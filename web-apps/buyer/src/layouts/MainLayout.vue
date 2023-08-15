<template>
  <div class="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '@/components/App/NavBar.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { NavBar },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.app {
  min-height: 100vh;
  padding-bottom: var(--global-bottom-spacing);
  box-sizing: border-box;
}
</style>
