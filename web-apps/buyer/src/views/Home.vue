<template>
  <div>
    <waiting-for-approval :showSign="!isOrgApproved" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import WaitingForApproval from '@/components/App/UI/WaitingForApproval.vue';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  name: 'Home',
  components: { WaitingForApproval },
  setup() {
    const store = useStore();
    const isOrgApproved: Ref<boolean> = ref(true);

    onBeforeMount(async () => {
      const user = await store.dispatch(ActionTypes.SET_USER);
      isOrgApproved.value = user.data.isOrgApproved;
      await store.dispatch(ActionTypes.SET_AUDIENCES);
      await store.dispatch(ActionTypes.SET_ANALYTICS);
    });

    return {
      isOrgApproved,
    };
  },
});
</script>

<style lang="scss" scoped></style>
