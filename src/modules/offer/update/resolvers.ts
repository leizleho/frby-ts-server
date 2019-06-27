import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { processUpload } from '../shared/processUpload';
// import { isAuthenticated } from "../../shared/isAuthenticated";

export const resolvers: ResolverMap = {
  Mutation: {
    updateOffer: async (_, { offerId, input: { picture, ...data } }) => {
      // isAuthenticated(session);
      // 1. user uploads a new picture
      if (picture) {
        data.pictureUrl = await processUpload(picture);
      }

      // 2. user remove picture
      // 3. do nothing

      await Offer.update(
        {
          id: offerId
        },
        {
          ...data
        }
      );

      return true;
    }
  }
};
