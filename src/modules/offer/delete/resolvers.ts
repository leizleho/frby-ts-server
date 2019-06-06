import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
// import { isAuthenticated } from '../../shared/isAuthenticated';

export const resolvers: ResolverMap = {
  Mutation: {
    deleteOffer: async (_, { id }, { session }) => {
      // isAuthenticated(session);

      const offer = await Offer.findOne({ where: { id } });

      if (!offer) {
        throw new Error('does not exist');
      }

      if (session.userId !== offer.userId) {
        // log message
        console.log(
          `this user ${
            session.userId
          } is trying to delete a offer they don't own`
        );
        throw new Error('not authorized');
      }

      await Offer.remove(offer);

      return true;
    }
  }
};
