import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { processUpload } from '../shared/processUpload';
import { getConnection } from 'typeorm';
import { offerCacheKey } from '../../../constants';
// import { isAuthenticated } from "../../shared/isAuthenticated";

export const resolvers: ResolverMap = {
  Mutation: {
    updateOffer: async (
      _,
      { offerId, input: { picture, ...data } },
      { redis }
    ) => {
      // isAuthenticated(session);
      // 1. user uploads a new picture
      if (picture) {
        data.pictureUrl = await processUpload(picture);
      }

      // 2. user remove picture
      // 3. do nothing

      const {
        raw: [newOffer]
      } = await getConnection()
        .createQueryBuilder()
        .update(Offer)
        .set(data)
        .where('id=:id', { id: offerId })
        .returning('*')
        .execute();

      const offers = await redis.lrange(offerCacheKey, 0, -1);
      const idx = offers.findIndex(
        (offer: string) => JSON.parse(offer).id === offerId
      );

      await redis.lset(offerCacheKey, idx, JSON.stringify(newOffer));
      return true;
    }
  }
};
