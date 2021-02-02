import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import Location from '../models/location';
import {findClosetById} from '../services/closet';
import {fetchOneItem, findOutfitById} from '../services/outfit';
import {findReportById} from '../services/report';
import {findRequestById} from '../services/request';
import {findSubscriptionById} from '../services/subscription';
import {findUserById} from '../services/user';
import Mutation from './mutation';
import Query from './query';
import Subscription from './subscription';

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query,
  Mutation,
  Subscription,
  User: {
    locations: async (parent) => {
      //  filter out the array of request_id and try to populate it
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
    closet: async (parent) => {
      const closet = await findClosetById(parent.closet);

      if (!closet) {
        // eslint-disable-next-line no-shadow
        const closet = null;
        return closet;
      }
      return closet;
    },
    outfit: async (parent) => {
      const outfitList = JSON.parse(JSON.stringify(parent.outfit));

      const outfitDataObject = [];
      for (const each of outfitList) {
        const eachOutfit = await findOutfitById(each);
        outfitDataObject.push(JSON.parse(JSON.stringify(eachOutfit)));
      }
      return outfitDataObject;
    },
    reports: async (parent) => {
      const reportList = JSON.parse(JSON.stringify(parent.report));

      const reportDataObject = [];
      for (const each of reportList) {
        const eachReport = await findReportById(each);
        reportDataObject.push(JSON.parse(JSON.stringify(eachReport)));
      }
      return reportDataObject;
    },
    requests: async (parent) => {
      //  filter out the array of request_id and try to populate it
      const requestList = JSON.parse(JSON.stringify(parent.requests));
      const requestDataObject = [];
      for (const each of requestList) {
        const eachRequest = await findRequestById(each);
        requestDataObject.push(JSON.parse(JSON.stringify(eachRequest)));
      }
      return requestDataObject;
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
  Outfit: {
    user: async (parent) => {
      const user = await findUserById(parent.user);

      if (!user) {
        // eslint-disable-next-line no-shadow
        const user = null;
        return user;
      }
      return user;
    },
    items: async (parent) => {
      //  filter out the array of request_id and try to populate it
      const itemsList = JSON.parse(JSON.stringify(parent.items));
      const user = await findUserById(parent.user);
      const itemsDataObject = [];
      for (const each of itemsList) {
        const eachItem =
          (await fetchOneItem(each, user.closet.toString())) || [];
        itemsDataObject.push(JSON.parse(JSON.stringify(eachItem)));
      }
      return itemsDataObject;
    },
  },
  Report: {
    user: async (parent) => {
      const user = await findUserById(parent.user);

      if (!user) {
        // eslint-disable-next-line no-shadow
        const user = null;
        return user;
      }
      return user;
    },
    items: async (parent) => {
      //  filter out the array of request_id and try to populate it
      const itemsList = JSON.parse(JSON.stringify(parent.items));
      const user = await findUserById(parent.user);
      const itemsDataObject = [];
      for (const each of itemsList) {
        const eachItem =
          (await fetchOneItem(each, user.closet.toString())) || {};
        itemsDataObject.push(JSON.parse(JSON.stringify(eachItem)));
      }
      return itemsDataObject;
    },
  },
};

export default resolvers;
