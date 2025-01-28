import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient("https://twitter-server-ynrf.onrender.com/graphql", {
    headers: () => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('__twitter_token') : '';
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },
  });
  