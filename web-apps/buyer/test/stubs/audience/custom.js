import {AudienceType, AudienceState} from '../../store/types';

let testArray = [
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: true,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: true,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: true,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Mercedes',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.LIVE,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla last',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla',
    description: 'Q1 Car trends 2020 / January report',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'BMW',
    description: 'Q1 Mini Sports Long Name _ Final version 36',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.READY,
    training: false,
    type: AudienceType.BUYER
  },
  {
    name: 'Tesla last',
    description: 'New audience 2021',
    stats: {
      users: '271k',
      impressions: '2.2MM',
    },
    status: AudienceState.DEPLOYED,
    training: false,
    type: AudienceType.BUYER
  },
];

export default testArray;
