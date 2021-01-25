/* eslint-disable no-shadow */
import {findAllStylists, findStylistById} from '../../services/stylist';

const stylistQueries = {
  async fetchAllStylist(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const query = {};

      if (args.type) {
        query.type = args.type;
      }

      if (args.first) {
        query.first = args.first;
      }

      if (args.start) {
        query.start = args.start;
      }

      if (args.sort) {
        query.sort = args.sort;
      }

      if (args.sortBy) {
        query.sortBy = args.sortBy;
      }

      const {stylist, total} = await findAllStylists(query);

      if (!stylist) {
        throw new Error('Stylist data not found');
      }
      if (!total) {
        throw new Error('Stylist data not found');
      }

      const results = {};
      results.total = total;
      results.data = stylist;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneStylist(_, {id}, {user}) {
    // must be done by an admin
    if (!user || user === null) {
      throw new Error("You're not logged in");
    }

    if (user.type !== 'ADMIN') {
      throw new Error('You do not have the permission to do this');
    }

    const stylist = await findStylistById(id);

    if (!stylist) {
      throw new Error(`Error find stylist with ${id}`);
    }

    return stylist;
  },
};

export default stylistQueries;
