import paymentQueries from './payment';
import subscriptionQueries from './subscription';
import UserQueries from './user';

// all the query
const Query = {
  ...UserQueries,
  ...paymentQueries,
  ...subscriptionQueries,
};

export default Query;
