// all the subscription
const subscription = {
  newRequest: {
    subscribe: (parent, args, {pubsub}) =>
      // console.log(pubsub);
      pubsub.asyncIterator('new-request'),
  },
};

export default subscription;
