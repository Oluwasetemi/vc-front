import paymentQueries from './payment';
import RequestQueries from './request';
import subscriptionQueries from './subscription';
import UserQueries from './user';

// all the query
const Query = {
  ...UserQueries,
  ...paymentQueries,
  ...subscriptionQueries,
  ...RequestQueries,
};

export default Query;
