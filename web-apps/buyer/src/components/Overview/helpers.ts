import { PublisherTraffic } from '@/store/types';
import { getFormattedNumber } from '@/utils/filters';

type PublisherTrafficProperties =
  | 'traffic'
  | 'eligibleTraffic'
  | 'adsSupported'
  | 'cookiesSupported'
  | 'consentGranted';

const sumTrafficProperty = (
  values: PublisherTraffic[],
  property: PublisherTrafficProperties
): number => {
  return values.reduce((acc, e) => acc + (e[property] || 0), 0);
};

export const getTrafficStatisticForWeek = (
  publisherTraffic: PublisherTraffic[] = []
) => {
  const lastWeekTraffic = publisherTraffic.filter(
    (traffic: PublisherTraffic) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(traffic.day) > sevenDaysAgo;
    }
  );

  const trafficSum = sumTrafficProperty(lastWeekTraffic, 'traffic');
  const eligibleTrafficSum = sumTrafficProperty(
    lastWeekTraffic,
    'eligibleTraffic'
  );
  const adsSupportedSum = sumTrafficProperty(lastWeekTraffic, 'adsSupported');
  const consentGrantedSum = sumTrafficProperty(
    lastWeekTraffic,
    'consentGranted'
  );
  const cookiesSupportedSum = sumTrafficProperty(
    lastWeekTraffic,
    'cookiesSupported'
  );

  return {
    weeklyEligibleTraffic: (eligibleTrafficSum / trafficSum) * 100,
    weeklyAdsSupported: ((trafficSum - adsSupportedSum) / trafficSum) * 100,
    weeklyConsentGranted: (consentGrantedSum / trafficSum) * 100,
    weeklyCookiesSupported: (cookiesSupportedSum / trafficSum) * 100,
  };
};

export const formatTrafficDiffText = (diff: number): string => {
  if (Number.isNaN(diff)) return '';

  let helpText = '';
  if (diff !== 0) {
    helpText = `${getFormattedNumber(diff, 0)}% vs last 7 days`;
  }
  if (diff > 0) {
    helpText = `+${helpText}`;
  }
  return helpText;
};

export const getTrafficStatisticForToday = (
  publisherTraffic: PublisherTraffic[] = []
) => {
  publisherTraffic = publisherTraffic.filter((traffic: PublisherTraffic) => {
    return new Date(traffic.day).getDate() === new Date().getDate();
  });

  const emptyReturn = {
    eligibleTraffic: 0,
    adsSupported: 0,
    consentGranted: 0,
    cookiesSupported: 0,
  };

  if (publisherTraffic.length > 0) {
    const {
      traffic,
      eligibleTraffic,
      adsSupported,
      consentGranted,
      cookiesSupported,
    } = publisherTraffic[0];

    if (!traffic) {
      return emptyReturn;
    }

    return {
      eligibleTraffic: ((eligibleTraffic || 0) / traffic) * 100,
      adsSupported: ((traffic - (adsSupported || 0)) / traffic) * 100,
      consentGranted: ((consentGranted || 0) / traffic) * 100,
      cookiesSupported: ((cookiesSupported || 0) / traffic) * 100,
    };
  }

  return emptyReturn;
};
