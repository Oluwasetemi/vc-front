/* eslint-disable no-shadow */

import {findAllUsers, findUserById, findUsersByIds} from '../../services/user';

const userQueries = {
  async me(_, args, {user}) {
    try {
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      user.password = null;

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async userById(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      if (id) {
        const userData = await findUserById(id);

        if (!userData) {
          throw new Error('No user found');
        }

        userData.password = null;

        return userData;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async userByIds(_, {ids}, {user}) {
    try {
      // must be done by an admin

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      if (Array.isArray(ids)) {
        const users = await findUsersByIds(ids);

        if (!users) {
          throw new Error('No user found');
        }

        return users;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async users(parent, args, {user}) {
    // must be done by an admin
    if (!user) {
      throw new Error('You must be logged In');
    }

    if (user.type !== 'ADMIN') {
      throw new Error('You do not have the permission to do this');
    }

    // this should be protected for only admin
    const users = await findAllUsers({});

    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  },
  async usersByType(_, {type}, {user}) {
    // must be done by an admin
    if (!user) {
      throw new Error('You must be logged In');
    }

    if (user.type !== 'ADMIN') {
      throw new Error('You do not have the permission to do this');
    }

    // eslint-disable-next-line
    let query = {type};

    // this should be protected for only admin
    const users = await findAllUsers(query);

    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  },
};

export default userQueries;
