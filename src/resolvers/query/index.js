import closetQueries from './closet';
import paymentQueries from './payment';
import requestQueries from './request';
import subscriptionQueries from './subscription';
import userQueries from './user';

// all the query
const Query = {
  ...userQueries,
  ...paymentQueries,
  ...subscriptionQueries,
  ...requestQueries,
  ...closetQueries,
};

export default Query;
