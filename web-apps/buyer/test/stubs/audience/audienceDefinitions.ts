import { AudienceType, AudienceState } from '../../store/types';

const definition = [
  {
    featureVersion: 1,
    queryProperty: 'docVector',
    queryValue: {
      vector: [1, 1, 1],
      threshold: 1,
    },
  },
];

const testArray = [
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    status: AudienceState.READY,
    training: true,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.READY,
    training: true,
    type: AudienceType.IAB,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.IAB,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.IAB,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    status: AudienceState.READY,
    training: true,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    status: AudienceState.READY,
    training: true,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.READY,
    training: true,
    type: AudienceType.IAB,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.IAB,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER,
    definition,
    stats: {
      uniqueUsers: '271k',
      impressions: '2.2MM',
    },
  },
];

export default testArray;
