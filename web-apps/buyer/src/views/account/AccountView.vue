<template>
  <div>
    <account-tabs></account-tabs>
    <container>
      <router-view></router-view>
    </container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Container from '@/layouts/Container.vue';
import AccountTabs from '@/components/Account/AccountTabs.vue';

export default defineComponent({
  name: 'AccountView',
  components: {
    Container,
    AccountTabs,
  },
});
</script>
