import {
  findAllSubscriptions,
  findSubscriptionById,
} from '../../services/subscription';
import stripe from '../../utils/stripe';

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
  async fetchAllPaymentFromStripe(_, {start, first = 10, end}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      let query = {limit: first};

      if (start) {
        query = {limit: first, starting_after: start};
      }

      if (end) {
        query = {limit: first, ending_before: end};
      }

      const charges = await stripe.charges.list(query);

      if (!charges) {
        throw new Error('Error while fetching charges');
      }

      // loop thru the data object from charges and pick the once you need
      const finalResult = {};
      finalResult.perPage = first;
      finalResult.start = charges.data[0].id;
      finalResult.end = charges.data[first - 1].id;
      finalResult.hasNextPage = charges.has_more;

      const results = [];
      for (const charge of charges.data) {
        const each = {};
        each.id = charge['id'];
        each.email = charge['receipt_email'] || 'no email';
        each.username =
          (charge['receipt_email'] && charge['receipt_email'].split('@')[0]) ||
          'no username';
        each.amount = charge['amount'];
        each.created = charge['created'];
        each.updated = charge['updated'] || null;
        each.paymentType = charge['paymentType'] || 'subscription';
        each.description = charge['description'] || null;
        results.push(each);
      }

      finalResult.results = results;

      return finalResult;
    } catch (error) {
      console.log(error.message);
      throw new Error('Server error while fetching payments');
    }
  },
  async fetchAllSubscriptionFromStripe(_, {start, first = 10, end}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      let query = {limit: first};

      if (start) {
        query = {limit: first, starting_after: start};
      }

      if (end) {
        query = {limit: first, ending_before: end};
      }

      const charges = await stripe.subscriptions.list(query);

      if (!charges) {
        throw new Error('Error while fetching charges');
      }

      // loop thru the data object from charges and pick the once you need
      const finalResult = {};
      finalResult.perPage = first;
      finalResult.start = charges.data[0].id;
      finalResult.end = charges.data[first - 1].id;
      finalResult.hasNextPage = charges.has_more;

      const results = [];
      for (const charge of charges.data) {
        const each = {};
        each.id = charge['id'];
        each.email = charge['receipt_email'] || 'no email';
        each.username =
          (charge['receipt_email'] && charge['receipt_email'].split('@')[0]) ||
          'no username';
        each.amount = charge['amount'];
        each.created = charge['created'];
        each.updated = charge['updated'] || null;
        each.paymentType = charge['paymentType'] || 'subscription';
        each.description = charge['description'] || null;
        results.push(each);
      }

      finalResult.results = results;

      return finalResult;
    } catch (error) {
      throw new Error('Server error while fetching payments');
    }
  },
};

export default subscriptionQueries;
