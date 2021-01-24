import authMutation from './auth';
import closetMutation from './closet';
import outfitMutation from './outfit';
import paymentMutation from './payment';
import requestMutation from './request';
import subscriptionMutation from './subscription';
import userMutation from './user';
// all the mutation
const mutation = {
  ...authMutation,
  ...userMutation,
  ...paymentMutation,
  ...subscriptionMutation,
  ...requestMutation,
  ...closetMutation,
  ...outfitMutation,
};

export default mutation;
