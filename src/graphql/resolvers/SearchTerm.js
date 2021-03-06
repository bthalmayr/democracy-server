/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import { isLoggedin } from '../../express/auth/permissions';

export default {
  Query: {
    mostSearched: async (parent, args, { SearchTermModel }) => {
      Log.graphql('SearchTerm.query.mostSearched');
      const result = await SearchTermModel.aggregate([
        { $unwind: '$times' },
        {
          $group: {
            _id: '$term',
            times: { $push: '$times' },
            size: { $sum: 1 },
          },
        },
        { $sort: { size: -1 } },
        { $limit: 10 },
      ]);
      return result.map(({ _id }) => ({ term: _id }));
    },
  },
  Mutation: {
    finishSearch: isLoggedin.createResolver(async (parent, { term }, { SearchTermModel, user }) => {
      Log.graphql('SearchTerm.mutation.finishSearchs');
      if (user && user.isVerified()) {
        return { term };
      }
      if (term && term.trim().length >= 3) {
        SearchTermModel.findOneAndUpdate(
          {
            term: term.toLowerCase().trim(),
          },
          {
            $push: {
              times: new Date(),
            },
          },
          {
            upsert: true,
          },
        ).then();
      }
      return { term };
    }),
  },
};
