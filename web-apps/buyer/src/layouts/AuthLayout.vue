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
  name: 'AuthLayout',
  components: { NavBar },
});
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
}
</style>
