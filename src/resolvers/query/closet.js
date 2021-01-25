/* eslint-disable no-shadow */
import {findClosetById} from '../../services/closet';

const closetQueries = {
  async fetchUserCloset(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      const results = await findClosetById(user.closet);

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneItem(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      const results = await findClosetById(user.closet);

      // find them item with the id
      const confirm = results.items.id(id);

      return confirm;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchAllItem(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      const results = await findClosetById(user.closet);

      return results.items;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default closetQueries;
