import * as shortid from 'shortid';
import { createWriteStream } from 'fs';

import { ResolverMap } from '../../../types/graphql-utils';
import { Offer } from '../../../entity/Offer';
// import { isAuthenticated } from '../../shared/isAuthenticated';

const storeUpload = async ({ stream }: any): Promise<any> => {
  // aseq2
  const id = shortid.generate();
  const path = `images/${id}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject)
  );
};

const processUpload = async (upload: any) => {
  const { stream, filename } = await upload;
  const { id } = await storeUpload({ stream, filename });
  return id;
};

export const resolvers: ResolverMap = {
  Mutation: {
    createOffer: async (_, { input: { picture, ...data } }, { session }) => {
      // isAuthenticated(session);

      const pictureUrl = await processUpload(picture);

      await Offer.create({
        ...data,
        pictureUrl,
        userId: session.userId
      }).save();

      return true;
    }
  }
};
