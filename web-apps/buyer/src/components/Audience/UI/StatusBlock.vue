<template>
  <div class="status-block">
    <div class="status-block__indicator">
      <tooltip-table :tooltip="textForTooltip" :for-details="forDetails">
        <div class="indicator" :class="indicatorStatus" />
        <div class="status-text">{{ capitalizeFirstLetter(status) }}</div>
      </tooltip-table>
      <bubble :count="pausedBySellersOrgNamesCount" />
    </div>
    <label
      class="status-block__switch"
      :class="{
        enabled: status === 'live',
        disabled: isDisabled,
      }"
    >
      <input
        @change="changeStatus"
        :disabled="isDisabled"
        type="checkbox"
        class="switch"
      />
    </label>
  </div>
</template>

<script lang="ts">
import TooltipTable from './TooltipTable.vue';
import { getOrgNamesByOwner } from '@/store/api/audiences';
import { defineComponent, computed, onMounted, reactive } from 'vue';
import { AudienceStatus, AudienceType } from '@/store/types';
import Bubble from './Bubble.vue';
import { useStore } from 'vuex';
import { capitalizeFirstLetter } from '@/utils/filters';
import { ActionTypes } from '@/store/actions';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';

export default defineComponent({
  name: 'StatusBlock',
  props: {
    id: { type: String, required: true },
    forDetails: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  components: { Bubble, TooltipTable },
  setup(props) {
    const store = useStore();

    const pausedBySellersOrgNames: string[] = reactive([]);

    const status = computed(() =>
      store.getters[
        `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_STATUS}`
      ](props.id)
    );
    const type = computed(() =>
      store.getters[`${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_TYPE}`](
        props.id
      )
    );
    const pausedBySellers = computed(() =>
      store.getters[
        `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_AUDIENCE_PAUSED_BY_SELLERS}`
      ](props.id)
    );

    const indicatorStatus = computed(() => {
      return `indicator-${status.value}`;
    });
    const auth = computed(() => store.state.auth);
    const pausedBySellersOrgNamesCount = computed(
      () => pausedBySellersOrgNames.length
    );

    onMounted(() => {
      getOrgNamesByOwner(pausedBySellers.value).then((res) => {
        pausedBySellersOrgNames.push(...Object.values(res.data ?? {}));
      });
    });

    const getNewAudienceStatus = (oldStatus: AudienceStatus) => {
      if (oldStatus === AudienceStatus.LIVE) {
        return AudienceStatus.PAUSED;
      } else if (
        [AudienceStatus.READY, AudienceStatus.PAUSED].includes(oldStatus)
      ) {
        return AudienceStatus.LIVE;
      } else return oldStatus;
    };

    const changeStatus = (): void => {
      const newStatus = getNewAudienceStatus(status.value);

      if (status.value !== newStatus) {
        store.dispatch(ActionTypes.SET_AUDIENCE_STATUS, {
          id: props.id,
          status: newStatus,
        });
      }
    };

    const textForTooltip = computed(() => {
      switch (status.value) {
        case AudienceStatus.READY:
          return 'This audience is ready for deployment';
        case AudienceStatus.LIVE:
          if (pausedBySellersOrgNames.length > 0) {
            return `
              The audience is partially live and is paused by ${
                pausedBySellersOrgNames.length
              } seller${pausedBySellersOrgNames.length > 1 ? 's' : ''}:
              ${pausedBySellersOrgNames.map((name) => ` ${name}`)}
            `;
          } else {
            return 'Audience is live on the publisher network';
          }
        case AudienceStatus.PAUSED:
          if (pausedBySellersOrgNames.length > 0) {
            return `
              Paused by ${pausedBySellersOrgNames.length} seller${
              pausedBySellersOrgNames.length > 1 ? 's' : ''
            }:
              ${pausedBySellersOrgNames.map((name) => ` ${name}`)}
            `;
          } else {
            return 'You have paused the audience';
          }
        case AudienceStatus.TRAINING:
          return 'The audience is training and will be available soon';
        default:
          throw new Error('Invalid audience status found.');
      }
    });

    const isDisabled = computed(
      () =>
        status.value === AudienceStatus.TRAINING ||
        (!auth.value.user.isSeller && type.value === AudienceType.IAB)
    );

    return {
      status,
      indicatorStatus,
      pausedBySellersOrgNames,
      textForTooltip,
      changeStatus,
      isDisabled,
      auth,
      pausedBySellersOrgNamesCount,
      capitalizeFirstLetter,
    };
  },
  computed: {
    bubbleCount(): number {
      return this.pausedBySellersOrgNames.length;
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors.scss';
@import 'src/styles/variables.scss';

$dot-switch: #2b3961;
$dot-disabled: #e1e1e1;
$indicator: #a8a8a8;
$indicator-live: #02c038;
$indicator-training: #ffae73;
$indicator-paused: #a8a8a8;
$indicator-disabled: #a8a8a8;
$border-switch: #e6e6e6;

$switch-transition: all $tt-default ease-out;

.status-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;

  .status-text {
    cursor: pointer;
  }

  &__indicator {
    display: flex;
    align-items: center;
    transition: background-color $tt-default;

    .indicator {
      margin-right: 6px;
      border-radius: 50%;
      border: solid 4px $border-switch;

      &-live {
        border-color: $indicator-live;
        background: $indicator-live;
      }

      &-training {
        border-color: $indicator-training;
        background: $indicator-training;
      }

      &-ready {
        border-color: $indicator-live;
        width: 4px;
        height: 4px;
        border-width: 2px;
      }

      &-paused {
        border-color: $indicator-paused;
        background: $indicator-paused;
      }
    }
  }

  &__switch {
    cursor: pointer;
    position: relative;
    width: 32px;
    height: 20px;
    border-radius: 30px;
    border: 1px solid $border-switch;
    transition: $switch-transition;

    &.disabled.enabled {
      background: $grey-1;
    }

    &:before {
      position: absolute;
      top: 4px;
      left: 4px;
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: $dot-switch;
      transition: $switch-transition;
    }

    &.enabled {
      background: $light-blue;

      &:before {
        left: 16px;
        background-color: $clr-primary-blue;
      }
    }

    &.disabled {
      cursor: default;

      &:before {
        background: $dot-disabled;
      }
    }

    .switch {
      visibility: hidden;
    }
  }
}
</style>
