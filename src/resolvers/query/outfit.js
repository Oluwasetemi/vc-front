/* eslint-disable no-shadow */
import {
  findAllOutfits,
  findAllOutfitsUser,
  findOutfitById,
} from '../../services/outfit';

const outfitQueries = {
  async fetchAllOutfit(_, args, {user}) {
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

      const {outfit, total} = await findAllOutfits(query);

      if (!outfit) {
        throw new Error('Outfit data not found');
      }
      if (!total) {
        throw new Error('Outfit data not found');
      }

      const results = {};
      results.total = total;
      results.data = outfit;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchAllOutfitUser(_, args, {user}) {
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

      if (args.userId) {
        query.userId = args.userId;
      }

      const {outfit, total} = await findAllOutfitsUser(query);

      if (!outfit) {
        throw new Error('Outfit data not found');
      }
      if (!total) {
        throw new Error('Outfit data not found');
      }

      const results = {};
      results.total = total;
      results.data = outfit;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchAllOutfitMe(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
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

      query.userId = user._id.toString();

      const {outfit, total} = await findAllOutfitsUser(query);

      if (!outfit) {
        throw new Error('Outfit data not found');
      }
      if (!total) {
        throw new Error('Outfit data not found');
      }

      const results = {};
      results.total = total;
      results.data = outfit;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneOutfit(_, {id}, {user}) {
    // must be done by an admin
    if (!user || user === null) {
      throw new Error("You're not logged in");
    }

    const outfit = await findOutfitById(id);

    if (!outfit) {
      throw new Error(`Error find outfit with ${id}`);
    }

    return outfit;
  },
};

export default outfitQueries;
