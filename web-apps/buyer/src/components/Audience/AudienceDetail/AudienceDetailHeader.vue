<template>
  <div class="header-container">
    <div class="left-part">
      <router-link to="/audiences">
        <arrow-right class="icon-left" />
      </router-link>
      <div class="title">{{ name }}</div>
    </div>
    <div class="right-part">
      <div class="status-switcher">
        <status-block :id="$route.params.id" :for-details="true"></status-block>
      </div>
      <div class="vertical-divider" />
      <div class="page-switcher">
        <router-link
          :to="`/audiences/${$route.params.id}/analytics`"
          :class="{
            active: $route.path === `/audiences/${$route.params.id}/analytics`,
          }"
          >Analytics</router-link
        >
        <router-link
          :to="`/audiences/${$route.params.id}/settings`"
          :class="{
            active: $route.path === `/audiences/${$route.params.id}/settings`,
          }"
        >
          Settings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ArrowRight from '@/components/UI/Icons/ArrowRight.vue';
import StatusBlock from '@/components/Audience/UI/StatusBlock.vue';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';

export default defineComponent({
  name: 'AudienceDetailHeader',
  components: { StatusBlock, ArrowRight },
  setup() {
    const store = useStore();
    const route = useRoute();

    const name = computed(() =>
      store.getters[`${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_NAME}`](
        route.params.id
      )
    );

    return {
      name,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';
@import 'src/styles/shadows';

.header-container {
  display: flex;
  margin-top: 80px;
  justify-content: center;

  .left-part,
  .right-part {
    margin: 0 16px;
  }

  .left-part {
    display: flex;
    align-items: center;
    width: 729px;

    .icon-left {
      width: 17px;
      height: 14px;
      margin-right: 15px;
      color: $grey-6;
      transform: rotate(180deg);
      cursor: pointer;
    }

    .title {
      font-weight: bold;
      font-size: 40px;
      line-height: 48px;
      letter-spacing: -0.02em;
      color: $dark-grey-4;
    }
  }

  .right-part {
    display: flex;
    justify-content: space-between;
    width: 458px;

    .status-switcher {
      width: 170px;
      height: 48px;
      background-color: white;
      border-radius: 6px;
      box-shadow: $shadow-0;

      font-size: 14px;
      line-height: 48px;
      letter-spacing: -0.02em;
      color: $clr-typo-titles;
    }

    .vertical-divider {
      border-right: 1px solid $grey-14;
    }

    .page-switcher {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 240px;
      height: 48px;
      background-color: $color-6;
      border-radius: 6px;

      a {
        width: 110px;
        height: 40px;
        border-radius: 6px;
        text-align: center;
        line-height: 40px;
        text-decoration: none;

        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.02em;
        color: $dark-grey-1;

        &.active {
          background-color: white;
          color: black;
        }
      }
    }
  }
}
</style>
