// all the subscription
const subscription = {
  newRequest: {
    subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('new-request'),
  },
};

export default subscription;
