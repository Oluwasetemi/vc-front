// all the subscription
const subscription = {
  newRequest: {
    subscribe: (parent, args, {pubsub}) => {
      console.log(pubsub);
      return pubsub.asyncIterator('new-request');
    },
  },
};

export default subscription;
