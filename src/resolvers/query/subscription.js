import {
  findAllSubscriptions,
  findSubscriptionById,
} from '../../services/subscription';

const subscriptionQueries = {
  // subscription
  async fetchAllSubscription(_, args, {user}) {
    // must be done by a user
    if (!user) {
      throw new Error('You must be logged In');
    }

    const allSub = await findAllSubscriptions({});

    if (!allSub) {
      throw new Error('server error');
    }

    return allSub;
  },
  async fetchAllSubscriptionByType(_, {type}, {user}) {
    // must be done by a user
    if (!user) {
      throw new Error('You must be logged In');
    }

    const allSub = await findAllSubscriptions({type});

    if (!allSub) {
      throw new Error('server error');
    }

    return allSub;
  },
  async fetchOneSubscription(_, {id}, {user}) {
    // must be done by a user
    if (!user) {
      throw new Error('You must be logged In');
    }

    const sub = await findSubscriptionById(id);

    if (!sub) {
      throw new Error('server error');
    }

    return sub;
  },
};

export default subscriptionQueries;
