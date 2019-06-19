import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';

export const resolvers: ResolverMap = {
  Query: {
    viewOffer: async (_, { id }) => {
      return Offer.findOne({ where: { id } });
    }
  }
};
