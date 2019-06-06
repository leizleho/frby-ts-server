import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';

export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (_, { input }, { session }) => {
      console.log(session);

      if (!session.userId) {
        // user is not logged in
        throw new Error('not authenticated');
      }
      await Offer.create({
        ...input,
        pictureUrl: '',
        userId: session.userId
      }).save();

      return true;
    }
  }
};
