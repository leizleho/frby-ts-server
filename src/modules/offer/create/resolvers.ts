import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
// import { isAuthenticated } from '../../shared/isAuthenticated';
export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (_, { input }, { session }) => {
      // isAuthenticated(session);

      await Offer.create({
        ...input,
        pictureUrl: '',
        userId: session.userId
      }).save();

      return true;
    }
  }
};
