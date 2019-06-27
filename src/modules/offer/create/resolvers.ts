import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { processUpload } from '../shared/processUpload';
// import { isAuthenticated } from '../../shared/isAuthenticated';

export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (_, { input: { picture, ...data } }, { session }) => {
      // isAuthenticated(session);
      const pictureUrl = picture ? await processUpload(picture) : null;

      await Offer.create({
        ...data,
        pictureUrl,
        userId: session.userId
      }).save();

      return true;
    }
  }
};
