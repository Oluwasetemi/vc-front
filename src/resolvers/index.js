import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import Mutation from './mutation';
import Query from './query';

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query,
  Mutation,
  // Subscription,
};

export default resolvers;
