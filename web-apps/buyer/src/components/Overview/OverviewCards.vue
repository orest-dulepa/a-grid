<template>
  <div class="cards">
    <div class="cards__card-group">
      <base-card
        label="Live audiences"
        :value="liveAudiencesCount.toString()"
        icon="user"
      >
        <router-link class="go-to-audiences-link" to="/audiences">
          Go to audiences <arrow-right />
        </router-link>
      </base-card>
    </div>
    <div class="cards__card-group">
      <base-card
        v-for="stat in stats"
        :label="stat.label"
        :value="stat.value"
        :help-text="stat.helpText"
        :is-increase="stat.change > 0"
        :is-decrease="stat.change < 0"
        :footer-text="stat.text"
        :icon="stat.icon"
        :is-secondary="stat.secondary"
        :key="stat.label"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ArrowRight from '@/components/UI/Icons/ArrowRight.vue';
import BaseCard from '@/components/UI/BaseCard.vue';
import { PublisherTraffic } from '../../../functions/types';
import { getFormattedNumber } from '@/utils/filters';
import { computed, defineComponent } from 'vue';
import {
  getTrafficStatisticForToday,
  getTrafficStatisticForWeek,
  formatTrafficDiffText,
} from './helpers';

type OverviewSummaryStat = {
  label: string;
  value: string;
  helpText: string;
  change: number;
  text: string;
  icon?: string;
  secondary: boolean;
};

export default defineComponent({
  name: 'OverviewCards',
  components: {
    ArrowRight,
    BaseCard,
  },
  props: {
    publisherTraffic: {
      type: Array as () => PublisherTraffic[],
      required: true,
    },
    liveAudiencesCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const stats = computed((): OverviewSummaryStat[] => {
      let eligibleTrafficDiff = 0;
      let adsSupportedDiff = 0;
      let consentGrantedDiff = 0;
      let cookiesSupportedDiff = 0;

      let eligibleTraffic = 0;
      let adsSupported = 0;
      let consentGranted = 0;
      let cookiesSupported = 0;

      const publisherTraffic = props.publisherTraffic;

      if (publisherTraffic?.length > 0) {
        const trafficStatistic = getTrafficStatisticForToday(publisherTraffic);
        eligibleTraffic = trafficStatistic.eligibleTraffic;
        adsSupported = trafficStatistic.adsSupported;
        consentGranted = trafficStatistic.consentGranted;
        cookiesSupported = trafficStatistic.cookiesSupported;

        const trafficStatisticForWeek = getTrafficStatisticForWeek(
          publisherTraffic
        );
        const {
          weeklyEligibleTraffic,
          weeklyAdsSupported,
          weeklyConsentGranted,
          weeklyCookiesSupported,
        } = trafficStatisticForWeek;

        eligibleTrafficDiff = eligibleTraffic - weeklyEligibleTraffic;
        adsSupportedDiff = adsSupported - weeklyAdsSupported;
        consentGrantedDiff = consentGranted - weeklyConsentGranted;
        cookiesSupportedDiff = cookiesSupported - weeklyCookiesSupported;
      }

      return [
        {
          label: 'Eligible traffic',
          value: eligibleTraffic
            ? `${getFormattedNumber(eligibleTraffic, 0)}%`
            : '',
          helpText: 'The percentage of your traffic eligible for monetisation.',
          change: eligibleTrafficDiff,
          text: formatTrafficDiffText(eligibleTrafficDiff),
          icon: 'traffic',
          secondary: false,
        },
        {
          label: 'AdBlock',
          value: adsSupported ? `${getFormattedNumber(adsSupported, 0)}%` : '',
          helpText:
            'The percentage of your traffic which is blocking advertising.',
          change: adsSupportedDiff,
          text: formatTrafficDiffText(adsSupportedDiff),
          secondary: true,
        },
        {
          label: 'Cookieless',
          value: cookiesSupported
            ? `${getFormattedNumber(cookiesSupported, 0)}%`
            : '',
          helpText:
            'The percentage of your traffic hidden to traditional cookie based audience modelling.',
          change: cookiesSupportedDiff,
          text: formatTrafficDiffText(cookiesSupportedDiff),
          secondary: true,
        },
        {
          label: 'Consented',
          value: consentGranted
            ? `${getFormattedNumber(consentGranted, 0)}%`
            : '',
          helpText:
            'The percentage of your traffic which has granted consent under GDPR.',
          change: consentGrantedDiff,
          text: formatTrafficDiffText(consentGrantedDiff),
          secondary: true,
        },
      ];
    });

    return {
      stats,
      getTrafficStatisticForToday,
      formatTrafficDiffText,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/colors';
$link-background: #dfe7fe;

.cards {
  display: flex;
  justify-content: space-between;
  margin: 64px 0;

  .cards__card-group {
    display: flex;
    border-radius: 10px;
    background: $dark-grey-7;
    box-shadow: 0 4px 6px rgba($black, 0.04);

    &:not(:first-child) {
      margin-left: 16px;
    }
  }

  .go-to-audiences-link {
    transition: all 0.2s;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    padding: 6px 12px;
    color: $electric-blue;
    margin-top: 9px;
    text-decoration: none;
    background: $link-background;
    border-radius: 30px;
  }
}
</style>
