import Subscription from '../models/subscription';

export const createSubscription = (data) => Subscription.create(data);

export const findOneBasedOnQuery = (data) => Subscription.findOne(data);

export const findBasedOnQuery = (data) => Subscription.find(data);

export const findSubscriptionById = (id) => Subscription.findById(id);

export const findAllSubscriptions = (query = {}) => Subscription.find(query);

export const removeSubscription = (id) => Subscription.findByIdAndRemove(id);

export const updateSubscription = (query, data) =>
  Subscription.findOneAndUpdate(query, data, {
    new: true,
    runValidators: true,
  });

export const deleteSubscriptionByEmail = (email) =>
  Subscription.deleteOne({email});

export const search = (searchParams) =>
  Subscription.find({
    $text: {
      $search: searchParams,
    },
    score: {$meta: 'textScore'},
  }).sort({score: {$meta: 'textScore'}});
