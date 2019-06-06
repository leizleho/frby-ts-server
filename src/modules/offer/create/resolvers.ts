import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';

export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (_, { input }, { session }) => {
      console.log(session);
      await Offer.create({
        ...input,
        pictureUrl: '',
        userId: session.userId
      }).save();

      return true;
    }
  }
};
