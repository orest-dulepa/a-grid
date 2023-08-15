<template>
  <div class="cards">
    <div class="cards__card-group">
      <base-card label="Live audiences" :value="liveAudienceCount.toString()" icon="user">
        <router-link
          class="link audiences-link"
          :to="ROUTE_DASHBOARD_CHILDREN_DETAILS.audiences.path"
        >
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import ArrowRight from '@/components/ui/icons/ArrowRight.svg?inline';
import BaseCard from '@/components/ui/BaseCard.vue';
import { audienceStatHelper } from '@/store/modules/audienceStat';
import { GetterTypes } from '@/store/getters';
import { ROUTE_DASHBOARD_CHILDREN_DETAILS } from '@/routes';
import { PublisherTraffic } from '@/store/types';
import { formatNumber } from '@/utils/filters';

type OverviewSummaryStat = {
  label: string;
  value: string;
  helpText: string;
  change: number;
  text: string;
  icon?: string;
  secondary: boolean;
};

type PublisherTrafficProperties =
  | 'traffic'
  | 'eligibleTraffic'
  | 'adsSupported'
  | 'cookiesSupported'
  | 'consentGranted';

@Component({
  components: { ArrowRight, BaseCard },
  computed: {
    ...audienceStatHelper.mapGetters({
      liveAudienceCount: GetterTypes.GET_LIVE_AUDIENCE_COUNT,
    }),
  },
})
export default class OverviewCards extends Vue {
  @Prop({ type: Array, required: true }) publisherTraffic!: PublisherTraffic[];

  ROUTE_DASHBOARD_CHILDREN_DETAILS = ROUTE_DASHBOARD_CHILDREN_DETAILS;
  liveAudienceCount?: number;

  sumTrafficProperty(values: PublisherTraffic[], property: PublisherTrafficProperties): number {
    return values.reduce((acc, e) => acc + (e[property] || 0), 0);
  }

  get stats(): OverviewSummaryStat[] {
    const trafficStatistic = this.getTrafficStatisticForToday();
    const { eligibleTraffic, adsSupported, consentGranted, cookiesSupported } = trafficStatistic;

    const trafficStatisticForWeek = this.getTrafficStatisticForWeek();
    const {
      weeklyEligibleTraffic,
      weeklyAdsSupported,
      weeklyConsentGranted,
      weeklyCookiesSupported,
    } = trafficStatisticForWeek;

    const eligibleTrafficDiff = eligibleTraffic - weeklyEligibleTraffic;
    const adsSupportedDiff = adsSupported - weeklyAdsSupported;
    const consentGrantedDiff = consentGranted - weeklyConsentGranted;
    const cookiesSupportedDiff = cookiesSupported - weeklyCookiesSupported;

    return [
      {
        label: 'Eligible traffic',
        value: eligibleTraffic ? `${formatNumber(eligibleTraffic, 0)}%` : '',
        helpText: 'The percentage of your traffic eligible for monetisation.',
        change: eligibleTrafficDiff,
        text: this.formatTrafficDiffText(eligibleTrafficDiff),
        icon: 'traffic',
        secondary: false,
      },
      {
        label: 'AdBlock',
        value: adsSupported ? `${formatNumber(adsSupported, 0)}%` : '',
        helpText: 'The percentage of your traffic which is blocking advertising.',
        change: adsSupportedDiff,
        text: this.formatTrafficDiffText(adsSupportedDiff),
        secondary: true,
      },
      {
        label: 'Cookieless',
        value: cookiesSupported ? `${formatNumber(cookiesSupported, 0)}%` : '',
        helpText:
          'The percentage of your traffic hidden to traditional cookie based audience modelling.',
        change: cookiesSupportedDiff,
        text: this.formatTrafficDiffText(cookiesSupportedDiff),
        secondary: true,
      },
      {
        label: 'Consented',
        value: consentGranted ? `${formatNumber(consentGranted, 0)}%` : '',
        helpText: 'The percentage of your traffic which has granted consent under GDPR.',
        change: consentGrantedDiff,
        text: this.formatTrafficDiffText(consentGrantedDiff),
        secondary: true,
      },
    ];
  }

  getTrafficStatisticForToday(): {
    eligibleTraffic: number;
    adsSupported: number;
    consentGranted: number;
    cookiesSupported: number;
  } {
    const publisherTraffic = this.publisherTraffic.filter((traffic: PublisherTraffic) => {
      return traffic.daysAgo === 0;
    });

    const {
      traffic,
      eligibleTraffic,
      adsSupported,
      consentGranted,
      cookiesSupported,
    } = publisherTraffic[0];

    if (!traffic) {
      return {
        eligibleTraffic: 0,
        adsSupported: 0,
        consentGranted: 0,
        cookiesSupported: 0,
      };
    }

    return {
      eligibleTraffic: ((eligibleTraffic || 0) / traffic) * 100,
      adsSupported: ((traffic - (adsSupported || 0)) / traffic) * 100,
      consentGranted: ((consentGranted || 0) / traffic) * 100,
      cookiesSupported: ((cookiesSupported || 0) / traffic) * 100,
    };
  }

  getTrafficStatisticForWeek(): {
    weeklyEligibleTraffic: number;
    weeklyAdsSupported: number;
    weeklyConsentGranted: number;
    weeklyCookiesSupported: number;
  } {
    const lastWeekTraffic = this.publisherTraffic.filter((traffic: PublisherTraffic) => {
      return traffic.daysAgo < 7;
    });

    const trafficSum = this.sumTrafficProperty(lastWeekTraffic, 'traffic');
    const eligibleTrafficSum = this.sumTrafficProperty(lastWeekTraffic, 'eligibleTraffic');
    const adsSupportedSum = this.sumTrafficProperty(lastWeekTraffic, 'adsSupported');
    const consentGrantedSum = this.sumTrafficProperty(lastWeekTraffic, 'consentGranted');
    const cookiesSupportedSum = this.sumTrafficProperty(lastWeekTraffic, 'cookiesSupported');

    return {
      weeklyEligibleTraffic: (eligibleTrafficSum / trafficSum) * 100,
      weeklyAdsSupported: ((trafficSum - adsSupportedSum) / trafficSum) * 100,
      weeklyConsentGranted: (consentGrantedSum / trafficSum) * 100,
      weeklyCookiesSupported: (cookiesSupportedSum / trafficSum) * 100,
    };
  }

  formatTrafficDiffText(diff: number): string {
    if (Number.isNaN(diff)) return '';
    let helpText = '';
    if (diff !== 0) {
      helpText = `${formatNumber(diff, 0)}% vs last 7 days`;
    }
    if (diff > 0) {
      helpText = `+${helpText}`;
    }
    return helpText;
  }
}
</script>

<style lang="scss" scoped>
$link-background: #dfe7fe;

.cards {
  margin: 64px 0;
  display: flex;

  .cards__card-group {
    display: flex;
    border-radius: 10px;
    background: $dark-grey-7;
    box-shadow: 0 4px 6px rgba($black, 0.04);

    &:not(:first-child) {
      margin-left: 16px;
    }
  }

  .link {
    transition: all 0.2s;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    padding: 6px 12px;
    color: $electric-blue;
    margin-top: 9px;

    &:hover {
      background: $link-background;
      border-radius: 6px;
    }
  }
}
</style>
