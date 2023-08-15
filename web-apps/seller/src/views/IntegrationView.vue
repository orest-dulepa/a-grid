<template>
  <div>
    <integration-check :is-integration-page="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/layout/Navbar.vue';
import IntegrationCheck from '@/components/integration/IntegrationCheck.vue';
import Container from '@/components/layout/Container.vue';

@Component({
  components: {
    Navbar,
    IntegrationCheck,
    Container,
  },
})
export default class IntegrationView extends Vue {}
</script>
