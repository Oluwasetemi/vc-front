import closetQueries from './closet';
import outfitQueries from './outfit';
import paymentQueries from './payment';
import reportQueries from './report';
import requestQueries from './request';
import stylistQueries from './stylist';
import subscriptionQueries from './subscription';
import userQueries from './user';

// all the query
const Query = {
  ...userQueries,
  ...paymentQueries,
  ...subscriptionQueries,
  ...requestQueries,
  ...closetQueries,
  ...outfitQueries,
  ...stylistQueries,
  ...reportQueries,
};

export default Query;
