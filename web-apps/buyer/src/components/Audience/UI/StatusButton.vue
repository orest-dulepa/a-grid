<template>
  <tooltip
    v-if="status == 'training'"
    primary-text="Audience is still in training. Please check back later"
  >
    <button class="training status-button">
      <div class="button-icon">
        <div class="icon"></div>
      </div>
      <div class="button-text">Training</div>
    </button>
  </tooltip>
  <button class="status-button" :class="status" v-else>
    <div class="button-icon">
      <div class="icon"></div>
    </div>
    <div class="button-text">
      {{ transformedStatus }}
    </div>
  </button>
</template>

<script>
import { defineComponent } from 'vue';
import Tooltip from '../../UI/Tooltip.vue';

export default defineComponent({
  name: 'StatusButton',
  components: { Tooltip },
  computed: {
    transformedStatus() {
      return this.status === 'ready' ? 'deploy' : this.status;
    },
  },
  props: {
    status: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/typography';
@import '@/styles/colors';

.status-button {
  z-index: 10;
  font-family: Inter, sans-serif;
  font-size: $p-reg_font-size;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  background: none;
  border-radius: 6px;
  height: 32px;
  width: 102px;
  text-transform: capitalize;
  &.training {
    .button-text {
      color: $clr-primary-orange;
    }
    .icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $clr-primary-orange;
      margin-right: 6px;
    }
  }

  &.ready {
    color: $white;
    background-color: $clr-primary-blue;
    cursor: pointer;
    .icon {
      height: 10px;
      width: 16px;
      background-image: url('/src/assets/deploy.svg');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  &.live {
    color: $clr-primary-blue;
    background: $color-5;
    cursor: pointer;
    .icon {
      height: 10px;
      width: 16px;
      background-image: url('/src/assets/deployed.svg');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  &.paused {
    color: $clr-primary-disabled;
    background: $color-5;
    cursor: pointer;
    .icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $clr-primary-disabled;
      margin-right: 6px;
    }
  }
}
</style>
