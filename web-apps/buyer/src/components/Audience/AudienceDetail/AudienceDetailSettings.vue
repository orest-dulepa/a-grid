<template>
  <div class="settings-container">
    <div class="settings">
      <div class="title">Settings</div>
      <div class="settings-items">
        <settings-item
          title="Time to live"
          description="How long a user is placed inside an audience after having been matched"
          :type="AudienceSettingsSliderType.TTL"
          :on-save="onSave"
        />
        <settings-item
          title="Lookback"
          description="How long to look backwards in a user's page view history when matching"
          :type="AudienceSettingsSliderType.LOOKBACK"
          :on-save="onSave"
        />
        <settings-item
          title="Confidence"
          description="How accurate the model should be it gives an accuracy VS scale tradeoff"
          :type="AudienceSettingsSliderType.CONFIDENCE"
          :on-save="onSave"
        />
      </div>
      <div v-if="!isDisabled" class="saving">
        <div @click="save" class="save-btn">Save changes</div>
        <div v-if="areSettingsUpdated" class="saved">
          <SuccessIcon class="success-icon" />Changes saved successfully.
        </div>
      </div>
    </div>
    <div class="deals">
      <div class="title">Deals</div>
      <div class="deals-items">
        <deals-item />
        <deals-item />
        <deals-item />
      </div>
    </div>
  </div>
</template>

<script>
import SettingsItem from '@/components/Audience/UI/SettingsItem.vue';
import DealsItem from '@/components/Audience/UI/DealsItem.vue';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '@/store/actions';
import { AudienceSettingsSliderType } from '@/store/values';
import useIsDisabled from '@/components/Audience/AudienceDetail/uses/useIsDisabled';
import SuccessIcon from '@/components/Audience/UI/icons/success.svg';
import { NAMESPACE as AUDIENCES_NAMESPACE } from '@/store/modules/audiences';
import { GetterTypes } from '@/store/getters';
import { onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
  name: 'AudienceDetailSettings',
  components: { DealsItem, SettingsItem, SuccessIcon },
  setup() {
    const onSave = ref(false);
    const store = useStore();
    const { isDisabled } = useIsDisabled();

    const save = () => {
      store.dispatch(ActionTypes.SET_IS_AUDIENCE_SETTINGS_SAVING_NEEDED);
      onSave.value = !onSave.value;
    };

    const areSettingsUpdated = computed(
      () =>
        store.getters[
          `${AUDIENCES_NAMESPACE}/${GetterTypes.GET_IS_AUDIENCE_SETTINGS_UPDATED}`
        ]
    );

    onBeforeRouteLeave(() => {
      store.dispatch(ActionTypes.SET_ARE_AUDIENCE_SETTINGS_UPDATED);
    });

    return {
      save,
      onSave,
      isDisabled,
      areSettingsUpdated,
      AudienceSettingsSliderType,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';
@import 'src/styles/shadows';

.settings-container {
  display: flex;
  margin-top: 48px;
  justify-content: center;

  .settings,
  .deals {
    box-sizing: border-box;
    height: min-content;
    margin: 0 16px;
    padding: 32px;
    background-color: white;
    border-radius: 10px;
    box-shadow: $shadow-0;

    .title {
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: -0.02em;
      color: $dark-grey-4;
    }
  }

  .settings {
    width: 726px;

    .saving {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .save-btn {
        width: 132px;
        height: 40px;
        background-color: $clr-primary-disabled;
        border-radius: 6px;
        cursor: pointer;

        text-align: center;
        line-height: 40px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: -0.02em;
      }

      .saved {
        margin-left: 32px;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: -0.02em;
        color: $green-2;

        .success-icon {
          margin-right: 12px;
        }
      }
    }
  }

  .deals {
    width: 458px;
  }
}
</style>
