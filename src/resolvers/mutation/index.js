import authMutation from './auth';
import paymentMutation from './payment';
import subscriptionMutation from './subscription';
import userMutation from './user';
// all the mutation
const mutation = {
  ...authMutation,
  ...userMutation,
  ...paymentMutation,
  ...subscriptionMutation,
};

export default mutation;
