import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import Location from '../models/location';
import Mutation from './mutation';
import Query from './query';

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query,
  Mutation,
  // Subscription,
  User: {
    locations: async (parent) => {
      //  filter out the array of hra_id and try to populate it
      const locationList = JSON.parse(JSON.stringify(parent.locations));
      const locationDataObject = [];
      for (const each of locationList) {
        const eachLocation = await Location.findById(each);
        locationDataObject.push(JSON.parse(JSON.stringify(eachLocation)));
      }
      return locationDataObject;
    },
    currentLocation: async (parent) => {
      const location = await Location.findById(parent.currentLocation);

      if (!location) {
        // eslint-disable-next-line no-shadow
        const location = null;
        return location;
      }
      return location;
    },
  },
};

export default resolvers;
