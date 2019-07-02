import { ResolverMap } from '../../../types/graphql-utils';
import { offerCacheKey } from '../../../constants';

export const resolvers: ResolverMap = {
  Offer: {
    pictureUrl: (parent, _, { url }) => {
      if (!parent.pictureUrl) {
        return parent.pictureUrl;
      }
      if (parent.pictureUrl.includes('http')) {
        return parent.pictureUrl;
      }
      return `${url}/images/${parent.pictureUrl}`;
    },
    owner: ({ userId }, _, { userLoader }) => userLoader.load(userId)
  },
  Query: {
    findOffers: async (_, __, { redis }) => {
      const offers = (await redis.lrange(offerCacheKey, 0, -1)) || [];

      return offers.map((offer: string) => JSON.parse(offer));
    }
  }
};
