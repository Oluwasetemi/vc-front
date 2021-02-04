/* eslint-disable no-shadow */
import {findClosetById} from '../../services/closet';
import {findUserById} from '../../services/user';

const closetQueries = {
  // for the authenticated user
  async fetchClosetMe(_, args, {user}) {
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
  async fetchOneItemMe(_, {id}, {user}) {
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
  async fetchAllItemMe(_, args, {user}) {
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
  // for a particular user with user Id
  async fetchUserCloset(_, {userId}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      //find user
      const closetOwner = await findUserById(userId);

      if (!closetOwner) {
        throw new Error('User does not exist');
      }

      if (!closetOwner.closet) {
        throw new Error('User does not have a closet');
      }

      return findClosetById(closetOwner.closet);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  },
  async fetchOneItemUser(_, {userId, id}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      //find user
      const closetOwner = await findUserById(userId);

      if (!closetOwner) {
        throw new Error('User does not exist');
      }

      if (!closetOwner.closet) {
        throw new Error('User does not have a closet');
      }

      const closet = await findClosetById(closetOwner.closet);

      const confirm = closet.items.id(id);

      return confirm;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  },
  async fetchAllItemUser(_, {userId}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      //find user
      const closetOwner = await findUserById(userId);

      if (!closetOwner) {
        throw new Error('User does not exist');
      }

      if (!closetOwner.closet) {
        throw new Error('User does not have a closet');
      }

      const closet = await findClosetById(closetOwner.closet);

      return closet.items;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  },
};

export default closetQueries;
