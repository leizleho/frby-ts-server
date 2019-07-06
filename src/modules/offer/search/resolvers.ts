import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
import { getConnection } from 'typeorm';

export const resolvers: ResolverMap = {
  Query: {
    searchOffers: async (
      _,
      { input: { title, description, category }, limit, offset }
    ) => {
      let offerQB = getConnection()
        .getRepository(Offer)
        .createQueryBuilder('l');
      if (title) {
        offerQB = offerQB.andWhere('l.title ilike :title', {
          title: `%${title}%`
        });
      }
      if (description) {
        offerQB = offerQB.andWhere('l.description ilike :description', {
          description: `%${description}%`
        });
      }
      if (category) {
        offerQB = offerQB.andWhere('l.category ilike :category', {
          category: `%${category}%`
        });
      }

      return offerQB
        .take(limit)
        .skip(offset)
        .getMany();
    }
  }
};
