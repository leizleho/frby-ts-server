import { rule, shield } from 'graphql-shield';

const isAuthenticated = rule()((_: any, __: any, context: any) => {
  return !!context.session.userId;
});

export const middlewareShield = shield({
  Mutation: {
    createOffer: isAuthenticated,
    deleteOffer: isAuthenticated
  }
});
