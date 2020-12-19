import AuthMutation from './auth';
import UserMutation from './user';
// all the mutation
const mutation = {
  ...AuthMutation,
  ...UserMutation,
};

export default mutation;
