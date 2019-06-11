import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { User } from '../../../entity/User';

export const resolvers: ResolverMap = {
  Offer: {
    pictureUrl: (parent, _, { url }) =>
      parent.pictureUrl && `${url}/images/${parent.pictureUrl}`,
    owner: ({ userId }) => User.findOne({ where: { id: userId } })
  },
  Query: {
    findOffers: async () => {
      return Offer.find();
    }
  }
};
