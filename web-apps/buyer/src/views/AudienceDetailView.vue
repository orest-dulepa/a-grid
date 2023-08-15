<template>
  <base-spinner v-if="showSpinner" class="search-models-chart__spinner" />
  <scalable v-else>
    <div class="audience-detail">
      <audience-detail-header />
      <router-view></router-view>
    </div>
  </scalable>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import AudienceDetailHeader from '@/components/Audience/AudienceDetail/AudienceDetailHeader.vue';
import Scalable from '@/layouts/Scalable.vue';
import { useStore } from 'vuex';
import BaseSpinner from '@/components/Audience/UI/BaseSpinner.vue';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';

export default defineComponent({
  name: 'AudienceDetail',
  components: { AudienceDetailHeader, Scalable, BaseSpinner },
  setup() {
    const store = useStore();

    const showSpinner = computed(
      () =>
        !store.getters[
          `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_IS_AUDIENCES_LOADED}`
        ]
    );

    return {
      showSpinner,
    };
  },
});
</script>
