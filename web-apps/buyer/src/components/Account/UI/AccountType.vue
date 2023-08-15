<template>
  <div class="account-type">
    Account type: <span>{{ type }}</span>
    <div class="account-type-info"><info /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Info from '@/components/UI/Icons/Info.vue';

export default defineComponent({
  name: 'AccountType',
  components: { Info },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.account-type {
  height: 48px;
  display: flex;
  align-items: center;
  background-color: rgba($electric-blue, 0.08);
  color: $dark-grey-4;
  font-size: 16px;
  padding-left: 20px;
  border-left: 2px solid $electric-blue;

  span {
    text-transform: capitalize;
    font-weight: 500;
    padding-left: 3px;
  }

  .account-type-info {
    display: flex;
    margin-left: 3px;

    svg {
      color: $grey-5;
    }
  }
}
</style>
