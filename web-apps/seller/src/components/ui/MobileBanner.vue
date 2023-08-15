<template>
  <div v-if="!mobileBannerShowed" class="mobile-banner" :class="{ closed: closed }">
    <span class="x-mark" @click="closeModal()">
      <xmark-icon />
    </span>

    <div class="mobile-banner__content">
      <desktop-icon />
      <h2>Consider using desktop for better experience</h2>
      <p>
        Currently we do not fully support small screen sizes, click proceed to continue using a
        scaled down version of the application.
      </p>
      <base-button
        :theme="BUTTON_THEMES.white"
        :size="BUTTON_SIZES.small"
        full-width
        @click="closeModal()"
      >
        Proceed
      </base-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import XmarkIcon from '@/components/ui/icons/Xmark.svg?inline';
import DesktopIcon from '@/components/ui/icons/Desktop.svg?inline';
import BaseButton, { BUTTON_THEMES, BUTTON_SIZES } from '@/components/ui/BaseButton.vue';
import { MutationTypes } from '@/store/mutations';
import { mapGetters } from 'vuex';

@Component({
  components: {
    XmarkIcon,
    DesktopIcon,
    BaseButton,
  },
  computed: {
    ...mapGetters({
      mobileBannerShowed: 'mobileBannerShowed',
    }),
  },
})
export default class MobileBanner extends Vue {
  @Prop({ default: false }) outlined!: boolean;
  BUTTON_THEMES = BUTTON_THEMES;
  BUTTON_SIZES = BUTTON_SIZES;
  closed = false;
  mobileBannerShowed?: boolean;

  closeModal(): void {
    this.$store.commit(MutationTypes.MOBILE_BANNER_SHOWN);
    this.closed = true;
  }
}
</script>

<style lang="scss" scoped>
$blue-background: #394873;

.mobile-banner {
  display: none;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: rgba($blue-background, 0.95);
  overflow: hidden;

  color: $white;
  &.closed {
    display: none;
  }

  .mobile-banner__content {
    flex: 5;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    max-width: 295px;

    svg {
      width: 55px;
      height: 46px;
      margin: 40px auto 20px;
    }

    h2 {
      max-width: 295px;
      margin: 0 auto 16px;
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
    }

    p {
      max-width: 295px;
      margin: 0 auto 32px;
      color: rgba($white, 0.8);
      font-size: 16px;
      line-height: 24px;
    }

    .button {
      font-weight: 600;
      font-size: 16px;
      line-height: 16px;
      height: 56px;
      width: 50%;
      max-width: 143px;
    }
  }

  .x-mark {
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 0.5;
    cursor: pointer;
  }
}
@media screen and (max-width: $breakpoint-mobile) {
  .mobile-banner {
    display: flex;
  }
}
</style>
