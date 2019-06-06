import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';

export const resolvers: ResolverMap = {
  Query: {
    findOffers: async () => {
      return Offer.find();
    }
  }
};
