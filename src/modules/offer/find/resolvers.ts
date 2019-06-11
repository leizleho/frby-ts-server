import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';

export const resolvers: ResolverMap = {
  Offer: {
    pictureUrl: (parent, _, { url }) =>
      parent.pictureUrl && `${url}/images/${parent.pictureUrl}`,
    owner: ({ userId }, _, { userLoader }) => userLoader.load(userId)
  },
  Query: {
    findOffers: async () => {
      return Offer.find();
    }
  }
};
