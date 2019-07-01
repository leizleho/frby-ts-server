import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { processUpload } from '../shared/processUpload';
import { offerCacheKey } from '../../../constants';
// import { isAuthenticated } from '../../shared/isAuthenticated';

export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (
      _,
      { input: { picture, ...data } },
      { session, redis }
    ) => {
      // isAuthenticated(session);
      const pictureUrl = picture ? await processUpload(picture) : null;

      const offer = await Offer.create({
        ...data,
        pictureUrl,
        userId: session.userId
      }).save();

      redis.lpush(offerCacheKey, JSON.stringify(offer));

      return true;
    }
  }
};
