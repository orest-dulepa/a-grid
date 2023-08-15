import { functions } from '../../firebase';
import {
  AudienceSpendAndImpressions,
  PublisherTraffic,
  AudienceOverlap,
} from '../../../functions/types';
import { ReturnResult } from '@/types';
import { successResponse, errorResponse } from './utils';

export const getAudiencesSpendAndImpressions = async ({
  audiencesIds,
  buyerMemberId,
}: {
  audiencesIds: string[];
  buyerMemberId: number;
}): Promise<
  ReturnResult<{
    analytics: AudienceSpendAndImpressions[];
    traffic: PublisherTraffic[];
  }>
> => {
  try {
    const [{ data: analytics }, { data: traffic }] = await Promise.all([
      functions.httpsCallable('buyer-getAudiencesSpendAndImpressions')({
        audiencesIds,
        buyerMemberId,
      }),
      functions.httpsCallable('buyer-getPublisherTraffic')(),
    ]);
    return successResponse('Successfully fetched analytics data', {
      analytics,
      traffic,
    });
  } catch ({ message }) {
    return errorResponse(message);
  }
};

export const getAudienceOverlap = async ({
  audienceId,
}: {
  audienceId: string;
}): Promise<ReturnResult<AudienceOverlap[]>> => {
  try {
    const { data } = await functions.httpsCallable('buyer-getAudienceOverlap')({
      audienceId,
    });
    return successResponse('Successfully fetched audience overlap data', data);
  } catch ({ message }) {
    return errorResponse(message);
  }
};
