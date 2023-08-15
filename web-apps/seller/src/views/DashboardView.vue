<template>
  <div>
    <scalable :is-dashboard="true">
      <navbar />
      <outer-container>
        <router-view />
      </outer-container>
    </scalable>
    <mobile-banner />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/layout/Navbar.vue';
import OuterContainer from '@/components/layout/OuterContainer.vue';
import Scalable from '@/components/layout/Scalable.vue';
import MobileBanner from '@/components/ui/MobileBanner.vue';

@Component({
  components: {
    Navbar,
    OuterContainer,
    MobileBanner,
    Scalable,
  },
})
export default class DashboardView extends Vue {}
</script>
