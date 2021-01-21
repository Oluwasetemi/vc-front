/* eslint-disable no-shadow */

import {findAllRequests, findRequestById} from '../../services/request';

const requestQueries = {
  async fetchAllRequest(_, args, {user}) {
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

      const {req, total} = await findAllRequests(query);

      if (!req) {
        throw new Error('Request data not found');
      }
      if (!total) {
        throw new Error('Request data not found');
      }

      const results = {};
      results.total = total;
      results.data = req;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneRequest(_, {id}, {user}) {
    // must be done by an admin
    if (!user || user === null) {
      throw new Error("You're not logged in");
    }

    if (user.type !== 'ADMIN') {
      throw new Error('You do not have the permission to do this');
    }

    const req = await findRequestById(id);

    if (!req) {
      throw new Error(`Error find request with ${id}`);
    }

    return req;
  },
};

export default requestQueries;
