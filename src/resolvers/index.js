import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import Location from '../models/location';
import {findSubscriptionById} from '../services/subscription';
import {findUserById} from '../services/user';
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
    currentSubscriptionPlan: async (parent) => {
      const subscription = await findSubscriptionById(
        parent.currentSubscriptionPlan,
      );

      if (!subscription) {
        // eslint-disable-next-line no-shadow
        const subscription = null;
        return subscription;
      }
      return subscription;
    },
  },
  Request: {
    user: async (parent) => {
      const user = await findUserById(parent.user);

      if (!user) {
        // eslint-disable-next-line no-shadow
        const user = null;
        return user;
      }
      return user;
    },
    pickupLocation: async (parent) => {
      const location = await Location.findById(parent.pickupLocation);

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
